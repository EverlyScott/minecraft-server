const { log } = require('api')
const main = require('../src/main')
const { commands } = require('commands')

module.exports = (player, packet) => {
  let msg = packet.message
  let cmd = msg.replace('/', '').split(' ')[0]
  let args = msg.split(' ')
  args.shift()
  let cmdindex
  for (let i = 0; i < commands.length; i++) {
    if (commands[i].command == cmd) {
      cmdindex = i
    }
  }
  if (commands[cmdindex]) {
    var filename = commands[cmdindex].filename
    if (commands[cmdindex].debug) {
      if (filename.endsWith('.mcjsp')) {
        filename = filename.replace('.mcjsp', '.js')
      }
    } else {
      if (filename.endsWith('.js')) {
        filename = filename.replace('.js', '.mcjsp')
      }
    }
    try {
      require(`../plugins/${filename}`)[cmd](args, player, packet)
    } catch (err) {
      if (err.code == 'MODULE_NOT_FOUND') {
        player.sendMessage([
          {
            text: 'Error: Command initialized, but not found.\n',
            color: 'dark_red',
            bold: true
          },
          {
            text: 'It\'s possible that the developer of this plugin didn\'t use the correct filename to initialize the command.',
            color: 'dark_rde',
            bold: true
          }
        ])
      } else {
        if (err.code) {
          player.sendMessage({
            text: `An unknown error occurred with your command! Error code: ${err.code}`
          })
          log('error', `An unexpected error occurred while running /${cmd}: ${err.code}`)
          if (debug) {
            log('debug', err)
          }
        } else {
          player.sendMessage({
            text: `An unknown error occurred with your command! Error: ${err}`,
            color: 'dark_red'
          })
          log('error', `An unexpected error occurred while running /${cmd}: ${err}`)
          console.log(err)
        }
      }
    }
  } else {
    player.sendMessage([
      {
        text: 'The command ',
        color: 'dark_red'
      },
      {
        text: `/${cmd}`,
        color: 'dark_red',
        bold: true
      },
      {
        text: ' does not exist!',
        color: 'dark_red'
      }
    ])
  }
}