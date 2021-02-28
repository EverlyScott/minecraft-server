const { checkforupdates } = require('./config')
const fetch = require('node-fetch')
const semver = require('semver')
const current = require('../package.json').version
const colors = require('colors')
const { log } = require('api')

module.exports = (callback) => {
  if (checkforupdates) {
    log('info', 'Checking for updates...')
    fetch('https://cdn.scribblenerd.com/latestversions/minecraft-js.json').then((res) => {
      if (checkStatus(res)) {
        res.json().then((json) => {
          const latest = json.version
          if (semver.gte(latest, current)) {
            if (latest != current) {
              log('info', 'The version of MCJS you\'re running is out of date!'.red.bold)
              log('info', 'You\'re on version '.cyan + current.red + ', but the latest is '.cyan + latest.green + '.'.cyan)
              log('info', 'Please download the latest version here: '.cyan + 'https://mcjs.scribblenerd.com'.green)
              log('info', '\nServer starting in 5 seconds...'.cyan)
              setTimeout(() => {
                callback()
              }, 5000)
            } else {
              log('info', 'You\'re running the latest version of MCJS!'.green)
              callback()
            }
          } else {
            log('info', 'You\'re running the latest version of MCJS!'.green)
            callback()
          }
        })
      } else {
        callback()
      }
    })
  } else {
    callback()
  }
}

function checkStatus(res) {
  if (res.ok) {
    return true
  } else {
    log('error', 'Unable to check for updates!'.red.bold)
    return false
  }
}