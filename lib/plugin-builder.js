const fs = require('fs')
const { minify } = require('uglify-es')
const colors = require('colors')
const api = require('api')

var ranfromserver = false

function log(type, str) {
  if (ranfromserver) {
    api.log(type, str)
  } else {
    console.log(str)
  }
}

module.exports = (ranfromsrv = false, rebuild = false) => {
  ranfromserver = ranfromsrv
  const plugins = fs.readdirSync('plugins')
  var timesran = 0
  var errors = 0
  log('info', 'Checking for new plugins to build...')
  for (let i = 0; i < plugins.length; i++) {
    if (rebuild) {
      if (plugins[i].endsWith('.js')) {
        timesran++
        const plugin = fs.readFileSync(`plugins/${plugins[i]}`, 'utf-8')
        const result = minify(plugin)
        if (result.error) {
          log('error', `Error building plugin ${plugins[i]}!`)
          console.log(result.error)
          timesran--
          errors++
        } else {
          fs.writeFileSync(`plugins/${plugins[i].replace('.js', '.mcjsp')}`, result.code)
        }
      }
    } else {
      if (plugins[i].endsWith('.js') && !fs.existsSync(`plugins/${plugins[i].replace('.js', '.mcjsp')}`)) {
        timesran++
        const plugin = fs.readFileSync(`plugins/${plugins[i]}`, 'utf-8')
        const result = minify(plugin)
        if (result.error) {
          log('error', `Error building plugin ${plugins[i]}!`)
          console.log(result.error)
          timesran--
          errors++
        } else {
          fs.writeFileSync(`plugins/${plugins[i].replace('.js', '.mcjsp')}`, result.code)
        }
      }
    }
  }

  if (timesran == 0 && errors == 0) {
    log('info', 'No new plugins to build')
    return false
  } else {
    if (errors == 0) {
      log('info', `Successfully built ${timesran} plugins`)
      return true
    } else if (timesran != 0 && errors != 0) {
      log('info', `Successfully built ${timesran} plugins with ${errors} errors.`)
    } else if (timesran == 0 && errors != 0) {
      log('error', `Error building ${errors} plugins.`.red)
    }
  }
}