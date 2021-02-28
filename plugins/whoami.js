const { Command } = require('commands')
const { Permission, defaultError } = require('permissions')

exports.whoami = (args, player, packet) => {
  const permission = new Permission('mcjs.command.whoami')
  if (permission.hasPermission(player.username)) {
    player.sendMessage([
      {
        text: `Username: `,
        color: 'aqua'
      },
      {
        text: player.username,
        color: 'aqua',
        bold: true
      },
      {
        text: '\nUUID: ',
        color: 'aqua',
        bold: false
      },
      {
        text: player.uuid,
        color: 'aqua',
        bold: true
      },
      {
        text: '\nIP Address: ',
        color: 'aqua',
        bold: false
      },
      {
        text: player.ip,
        color: 'aqua',
        bold: true
      },
      {
        text: '\nPort: ',
        color: 'aqua',
        bold: false
      },
      {
        text: player.port,
        color: 'aqua',
        bold: true
      }
    ])
  } else {
    defaultError(player._client)
  }
}

exports.init = () => {
  new Command({
    command: 'whoami',
    filename: 'whoami.mcjsp',
    info: 'Shows info about you',
    usage: '/whoami'
  })
}