importScripts('/sw-version.js')

const VERSION = self.__APP_VERSION__ || 'v0'
const PRECACHE = `precache-${VERSION}`
const RUNTIME = `runtime-${VERSION}`

const allowedOrigins = [self.location.origin]

self.addEventListener('install', event => {
  console.log(`[SW] Installed version: ${VERSION}`)
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  console.log(`[SW] Activating version: ${VERSION}`)
  const currentCaches = [PRECACHE, RUNTIME]

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!currentCaches.includes(cacheName)) {
              console.log(`[SW] Deleting old cache: ${cacheName}`)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        // 立刻接管所有 clients，確保新 SW 立刻生效
        return self.clients.claim()
      })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  // 可以在這裡增加點擊通知的處理邏輯
})

async function networkFirst(request, cacheName, networkTimeoutSeconds = 5) {
  const cache = await caches.open(cacheName)
  try {
    const fetchPromise = fetch(request)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Network timeout')), networkTimeoutSeconds * 1000)
    )
    const response = await Promise.race([fetchPromise, timeoutPromise])
    if (response && response.ok) {
      await cache.put(request, response.clone())
      return response
    }
    throw new Error('Network response not ok')
  } catch (error) {
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

async function cacheFirst(request, cacheName, maxEntries, maxAgeSeconds) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  if (cachedResponse) {
    if (maxAgeSeconds) {
      const dateHeader = cachedResponse.headers.get('date')
      if (dateHeader) {
        const age = (Date.now() - new Date(dateHeader).getTime()) / 1000
        if (age > maxAgeSeconds) {
          await cache.delete(request)
          return undefined
        }
      }
    }
    return cachedResponse
  }
  try {
    const response = await fetch(request)
    if (response && response.ok) {
      await cache.put(request, response.clone())
      if (maxEntries) {
        const keys = await cache.keys()
        if (keys.length > maxEntries) {
          await cache.delete(keys[0])
        }
      }
      return response
    }
  } catch {
    // 失敗不回傳
  }
  return undefined
}

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET' || !allowedOrigins.includes(url.origin)) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, `html-cache-${VERSION}`, 5).catch(() => caches.match('/index.html')))
    return
  }

  if (/\.(js|css)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request, `static-resources-${VERSION}`, 50).then(res => res || fetch(request)))
    return
  }

  if (/\.(png|jpg|jpeg|svg|gif|webp)$/.test(url.pathname)) {
    event.respondWith(
      cacheFirst(request, `image-cache-${VERSION}`, 50, 30 * 24 * 60 * 60).then(res => res || fetch(request))
    )
    return
  }

  event.respondWith(
    caches.match(request).then(
      cachedResponse =>
        cachedResponse ||
        fetch(request).then(response => {
          return caches.open(`runtime-${VERSION}`).then(cache => {
            cache.put(request, response.clone())
            return response
          })
        })
    )
  )
})
