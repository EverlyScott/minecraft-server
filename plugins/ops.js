const { Command } = require('commands')
const permissions = require('permissions')
const config = require('config')
const fs = require('fs')

exports.ops = (args, player, packet) => {
  var opped = []

  permissions.runAllUsers((username, player) => {
    if (player.isOp) {
      opped.push(username)
    }
  })

  function genColor() {
    if (config.coloredOps.enabled) {
      return config.coloredOps.color
    }
    return 'white'
  }

  function genMessage() {
    var msg = []

    for (var i = 0; i < opped.length; i++) {
      msg.push({
        text: `${opped[i]}\n`,
        color: genColor()
      })
    }
    return msg
  }

  player.sendMessage([
    genMessage()
  ])
}

exports.op = (args, player, packet) => {
  const playerToOp = args[0]

  if (permissions.isOp(playerToOp)) {
    player.sendMessage({
      text: `${playerToOp} is already opped!`
    })
  } else {
    const perms = JSON.parse(fs.readFileSync('lib/permissions.json', 'utf-8'))

    if (perms.users[playerToOp]) {
      perms.users[playerToOp].isOp = true
    } else {
      perms.users[playerToOp] = {
        isOp: true,
        permissions: [],
        groups: []
      }
    }

    fs.writeFileSync('lib/permissions.json', JSON.stringify(perms, null, 2))

    player.sendMessage({
      text: `Opped ${playerToOp}`
    })
  }
}

exports.deop = (args, player, packet) => {
  const playerToDeop = args[0]

  if (!permissions.isOp(playerToDeop)) {
    player.sendMessage({
      text: `${playerToDeop} is not opped!`
    })
  } else {
    const perms = JSON.parse(fs.readFileSync('lib/permissions.json', 'utf-8'))

    if (perms.users[playerToDeop]) {
      perms.users[playerToDeop].isOp = false
    } else {
      perms.users[playerToDeop] = {
        isOp: false,
        permissions: [],
        groups: []
      }
    }

    fs.writeFileSync('lib/permissions.json', JSON.stringify(perms, null, 2))

    player.sendMessage({
      text: `Deopped ${playerToDeop}`
    })
  }
}

exports.init = () => {
  new Command({
    command: 'ops',
    filename: 'ops.mcjsp',
    info: 'Lists the current operators',
    usage: '/ops'
  })
  new Command({
    command: 'op',
    filename: 'ops.mcjsp',
    info: 'Gives the specified player operator',
    usage: '/op <player>'
  })
  new Command({
    command: 'deop',
    filename: 'ops.mcjsp',
    info: 'Remove the specified player\'s operator',
    usage: '/deop <player>'
  })
}