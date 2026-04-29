export function getJson (Url) {
  return new Promise(resolve => {
    fetch(Url)
      .then(data => { resolve(data.json()) })
      .catch(error => {
        console.warn('Lottie Fetch Error:', error)
      })
  })
}

export function getImgUrl (path) {
  if (path.includes('images')) {
    return require('@/components/' + path)
  }
  return process.env.BASE_URL + path
}
