const { Command } = require('commands')
const permissions = require('permissions')
const { log } = require('api')
const messageParser = require('message-parser')
const { performAllPlayers } = require('players')

exports.tellraw = (args, player, packet) => { 
  const permission = new permissions.Permission('mcjs.command.tellraw')
  if (permission.hasPermission(player.username)) {
    try {
      const json = JSON.parse(args.join(' '))
      if (!json.text && typeof json != 'string') {
        throw {
          message: 'No valid text object!'
        }
      }
      performAllPlayers((client) => {
        player.sendMessage(args.join(' '), client)
      })
      log('chat', messageParser(json))
    } catch (err) {
      player.sendMessage([
        {
          text: 'Malformed JSON! Error:\n',
          color: 'red'
        },
        {
          text: err.message,
          color: 'white'
        }
      ])
    }
  } else {
    permissions.defaultError(player._client)
  }
}

exports.init = () => {
  new Command({
    command: 'tellraw',
    filename: 'tellraw.mcjsp',
    info: 'Sends a custom JSON encoded message to the server which will be returned to chat. Example: {"text":"Hello, world!","color":"red","bold":"true}',
    usage: '/tellraw <JSON>'
  })
}