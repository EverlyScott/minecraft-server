const { log } = require('api')
const permissions = require('permissions')
const { Command } = require('commands')
const { performAllPlayers } = require('players')

exports.say = (args, player, packet) => {
  const permission = new permissions.Permission('mcjs.command.say')
  if (permission.hasPermission(player.username)) {
    const msg = {
      translate: 'chat.type.announcement',
      with: [
        player.username,
        args.join(' ')
      ]
    }
    performAllPlayers((client) => {
      player.sendMessage(msg, client)
    })
    log('chat', `[${msg.with[0]}] ${msg.with[1]}`)
  } else {
    permissions.defaultError(player._client)
  }
}

exports.init = () => {
  new Command({
    command: 'say',
    filename: 'say.mcjsp',
    info: 'Broadcasts a message to chat.',
    usage: '/say <message>'
  })
}