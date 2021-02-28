const messageParser = require('message-parser')
const { log } = require('api')

class Chat {
  constructor(player, packet) {
    const { sendMessage, performAllPlayers } = require('players')
    const commandParser = require('command-parser')
    const { isOp } = require('permissions')
    const { config } = require ('../src/server').server

    let msg = packet.message
    if (msg.startsWith('/')) {
      commandParser(player, packet)
    } else {
      var message
      if (isOp(player.username) && config.coloredOps.enabled) {
        message = {
          translate: 'chat.type.text',
          with: [
            {
              text: player.username,
              color: config.coloredOps.color
            },
            msg
          ]
        }
        log('chat', `<${messageParser({text: player.username,color: config.coloredOps.color})}> ${msg}`)
      } else {
        message = {
          translate: 'chat.type.text',
          with: [
            player.username,
            msg
          ]
        }
        log('chat', `<${player.username}> ${msg}`)
      }
      performAllPlayers((client) => {
        sendMessage(message, client)
      })
    }
  }
}

module.exports = Chat