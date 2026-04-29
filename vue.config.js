const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const { packageInfo, version } = require('./package.json')

// 打印構建環境信息
console.log('Build Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  VUE_APP_API_URL: process.env.VUE_APP_API_URL,
  VUE_APP_IMG_URL: process.env.VUE_APP_IMG_URL,
  VUE_APP_SITE_URL: process.env.VUE_APP_SITE_URL,
  VUE_APP_GMO_PAY_API_URL: process.env.VUE_APP_GMO_PAY_API_URL
})

module.exports = {
  filenameHashing: true,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      // Inject version as environment variable
      new (require('webpack').DefinePlugin)({
        'process.env.VUE_APP_VERSION': JSON.stringify(version)
      })
    ]
  },
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      // GMO mul-pay金流
      '/gmo-api': {
        target: process.env.VUE_APP_GMO_PAY_API_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/gmo-api': ''
        }
      }
    },
    host: 'localhost',
    https: true,
    hot: true
  },
  pwa: {
    name: process.env.VUE_APP_SITE_TITLE,
    start_url: '.',
    themeColor: '#000',
    msTileColor: '#000',
    display: 'standalone',
    orientation: 'portrait-primary',
    manifestOptions: {
      name: process.env.VUE_APP_SITE_TITLE,
      short_name: process.env.VUE_APP_SITE_TITLE,
      icons: [
        {
          src: `${process.env.VUE_APP_IMG_URL}/img/icons/PlayBUZ/32x32.png`,
          sizes: '32x32',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: `${process.env.VUE_APP_IMG_URL}/img/icons/PlayBUZ/48x48.png`,
          sizes: '48x48',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: `${process.env.VUE_APP_IMG_URL}/img/icons/PlayBUZ/144x144.png`,
          sizes: '144x144',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: `${process.env.VUE_APP_IMG_URL}/img/icons/PlayBUZ/180x180.png`,
          sizes: '180x180',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: `${process.env.VUE_APP_IMG_URL}/img/icons/PlayBUZ/192x192.png`,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: `${process.env.VUE_APP_IMG_URL}/img/icons/PlayBUZ/512x512.png`,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: `${process.env.VUE_APP_IMG_URL}/img/icons/PlayBUZ/1024x1024.png`,
          sizes: '1024x1024',
          type: 'image/png',
          purpose: 'any'
        }
      ]
    },
    iconPaths: {
      appleTouchIcon: '/img/logo/180x180.png',
      msTileImage: '/img/logo/144x144.png'
    },
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: `./public/service-worker.js`
      // skipWaiting: true,
      // clientsClaim: true,
      // // Tell Workbox we want to inject custom runtime caching rules
      // runtimeCaching: [
      //   {
      //     // 1. Handle navigation requests (index.html)
      //     urlPattern: ({ request }) => request.mode === 'navigate',
      //     handler: 'NetworkFirst',
      //     options: {
      //       cacheName: 'html-cache',
      //       networkTimeoutSeconds: 5,
      //       expiration: {
      //         maxEntries: 5,
      //         purgeOnQuotaError: true
      //       }
      //     }
      //   },
      //   {
      //     // 2. Cache JS and CSS files with CacheFirst (they're hash-versioned)
      //     urlPattern: /\.(?:js|css)$/,
      //     handler: 'CacheFirst',
      //     options: {
      //       cacheName: 'static-resources',
      //       expiration: {
      //         maxEntries: 50,
      //         purgeOnQuotaError: true
      //       }
      //     }
      //   },
      //   {
      //     // 3. Cache images with CacheFirst (optional)
      //     urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      //     handler: 'CacheFirst',
      //     options: {
      //       cacheName: 'image-cache',
      //       expiration: {
      //         maxEntries: 50,
      //         maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      //         purgeOnQuotaError: true
      //       }
      //     }
      //   }
      // ]
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/css/variable.scss";'
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('vue', path.resolve('./node_modules/vue'))
      .set('@', path.resolve(__dirname, 'src/'))
      .set('~', path.resolve(__dirname, 'src/assets/'))
      .set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js')

    config.plugin('html').tap(args => {
      args[0].title = process.env.VUE_APP_SITE_TITLE
      args[0].description = process.env.VUE_APP_SITE_DESCRIPTION
      args[0].keyword = process.env.VUE_APP_SITE_KEYWORD
      args[0].og_title = process.env.VUE_APP_SITE_OG_TITLE
      args[0].site_url = process.env.VUE_APP_SITE_URL
      args[0].site_tw_url = 'https://tw.playbuz.app/'
      args[0].site_singapore_url = 'https://playbuz.app/'
      args[0].img_url = process.env.VUE_APP_IMG_URL
      args[0].clarity_code = process.env.VUE_APP_CLARITY_CODE
      return args
    })

    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionWebpackPlugin').use(
        new CompressionWebpackPlugin({
          test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/,
          threshold: 10240
        })
      )
    }
  }
}
