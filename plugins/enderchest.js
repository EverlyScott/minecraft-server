const { Command } = require('commands')
const permissions = require('permissions')

exports.enderchest = (args, player, packet) => {
  const permission = new permissions.Permission('mcjs.command.enderchest')
  if (permission.hasPermission(player.username)) {
    player._client.write('open_window', {
      windowId: 165,
      inventoryType: 'minecraft:chest',
      windowTitle: JSON.stringify('yeah'),
      slotCount: 26
    })
  } else {
    permissions.defaultError(player._client)
  }
}

exports.init = () => {
  new Command({
    command: 'enderchest',
    filename: 'enderchest.mcjsp',
    info: 'Opens the player\'s enderchest',
    usage: '/enderchest'
  })
}