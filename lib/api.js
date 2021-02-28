const colors = require('colors')
const { rl } = require('console.js')

module.exports = {
  log: (type, str) => {
    const time = new Date().toTimeString().split(' ')[0]

    const types = {
      info: 'INFO'.cyan,
      debug: 'DEBUG'.magenta,
      chat: 'CHAT'.green,
      error: 'ERROR'.red,
      packet: 'DEBUG PACKET'.brightMagenta
    }
    if (str.includes('\n')) {
      console.log(`[${time} ${types[type]}]:\n${str}`)
    } else {
      console.log(`[${time} ${types[type]}]: ${str}`)
    }
  }
}