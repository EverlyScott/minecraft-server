const { Command } = require('commands')
const server = require('server')
const permissions = require('permissions')

exports.stop = (args, player, packet) => {
  const permission = new permissions.Permission('mcjs.command.stop')
  if (permission.hasPermission(player.username)) {
    server.stop()
  } else {
    permissions.defaultError(player._client)
  }
}

exports.init = () => {
  new Command({
    command: 'stop',
    filename: 'stop.mcjsp',
    info: 'Stops the server',
    usage: '/stop'
  })
}