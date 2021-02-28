const { Command } = require('commands')
const permissions = require('permissions')

exports.about = (args, player, packet) => {
  const permission = new permissions.Permission('mcjs.command.about')
  if (permission.hasPermission(player.username)) {
    player.sendMessage([
      {
        text: 'This is a server that\'s written completely in JavaScript using the help of the ',
        color: 'aqua'
      },
      {
        text: 'minecraft-protocol',
        color: 'aqua',
        bold: 'true'
      },
      {
        text: ' module!',
        color: 'aqua'
      }
    ])
  } else {
    permissions.defaultError(player._client)
  }
}

exports.init = () => {
  new Command({
    command: 'about',
    filename: 'about.mcjsp',
    info: 'Gives you info about the server.',
    usage: '/about'
  })
}