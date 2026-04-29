const fs = require('fs')

const setConfig = version => {
  const content = `export const VERSION = '${version}'\n`
  fs.writeFile('src/configs/version.js', content, 'utf-8', err => {
    if (err) throw err
    console.log(`
      ******************************
        > VERSION: ${version}
      ******************************
    `)
  })
  // 新增：寫入 public/sw-version.js（給 service-worker.js 用）
  const swContent = `self.__APP_VERSION__ = '${version}';\n`
  fs.writeFileSync('public/sw-version.js', swContent, 'utf-8')
}

const readPackage = () => {
  const packageText = fs.readFileSync('./package.json', 'utf8')
  const version = JSON.parse(packageText).version.toString() || 'none'
  setConfig(version)
}

readPackage()
