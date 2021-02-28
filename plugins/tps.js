const { Command } = require('commands')
const permissions = require('permissions')
const { TickAction } = require('tick')

var tps = 0
var ticks = 0

exports.tps = (args, player, packet) => {
  const permission = new permissions.Permission('mcjs.command.tps')
  if (permission.hasPermission(player.username)) {
    player.sendMessage([
      {
        text: 'The current TPS is: ',
        color: 'aqua'
      },
      {
        text: tps,
        color: 'aqua',
        bold: true
      }
    ])
  } else {
    permissions.defaultError(player._client)
  }
}

exports.init = () => {
  new Command({
    command: 'tps',
    filename: 'tps.mcjsp',
    info: 'Shows the current ticks/second',
    usage: '/tps'
  })

  new TickAction('/tps', () => {
    ticks++
  })

  setInterval(() => {
    tps = ticks
    ticks = 0
  }, 1000)
}