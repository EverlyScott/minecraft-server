const { Command } = require('commands')
const { log } = require('api')
const permissions = require('permissions')
const { performAllPlayers } = require('players')

exports.me = (args, player, packet) => {
  const permission = new permissions.Permission('mcjs.command.me')
  if (permission.hasPermission(player.username)) {
    const msg = {
      text: `* ${player.username} ${args.join(' ')}`
    }
    performAllPlayers((client) => {
      player.sendMessage(msg, client)
    })
    log('chat', msg.text)
  } else {
    permissions.defaultError(player._client)
  }
}

exports.init = () => {
  new Command({
    command: 'me',
    filename: 'me.mcjsp',
    info: 'Sends a message about yourself in chat.',
    usage: '/me <message>'
  })
}