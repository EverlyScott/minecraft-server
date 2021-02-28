const { Command } = require('commands')
const permissions = require('permissions')

exports.ping = (args, player, packet) => {
  const permission = new permissions.Permission('mcjs.command.ping')
  if (permission.hasPermission(player.username)) {
    player.sendMessage([
      {
        text: 'Your ping is ',
        color: 'aqua'
      },
      {
        text: player.latency,
        color: 'aqua',
        bold: true
      },
      {
        text: 'ms',
        color: 'aqua',
        bold: false
      }
    ])
  } else {
    permissions.defaultError(player._client)
  }
}

exports.init = () => {
  new Command({
    command: 'ping',
    filename: 'ping.mcjsp',
    info: 'Shows your current ping in milliseconds',
    usage: '/ping'
  })
}