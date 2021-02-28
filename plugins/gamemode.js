const permissions = require('permissions')
const { Command } = require('commands')

exports.gamemode = (args, player, packet) => {
  const permission = new permissions.Permission('mcjs.command.gamemode')
  if (permission.hasPermission(player.username)) {
    var gamemode = args[0]
    if (gamemode) {
      gamemode = gamemode.toLowerCase()
      if (gamemode == 'survival' || gamemode == 's') {
        gamemode = 0
      } else if (gamemode == 'creative' || gamemode == 'c') {
        gamemode = 1
      } else if (gamemode == 'adventure' || gamemode == 'a') {
        gamemode = 2
      } else if (gamemode == 'spectator' || gamemode == 'sp') {
        gamemode = 3
      } else {
        gamemode = parseInt(gamemode, 10)
      }

      if (gamemode != NaN) {
        player.setGamemode(gamemode)
  
        const gamemodes = [
          'Survival',
          'Creative',
          'Adventure',
          'Spectator'
        ]

        //Now
        player.sendMessage({
          text: `Set own gamemode to ${gamemodes[gamemode]} Mode`
        })
      } else {
        player.sendMessage({
          text: 'Invalid Gamemode!',
          color: 'red'
        })
      }
    } else {
      player.sendMessage({
        text: 'Invalid Gamemode!',
        color: 'red'
      })
    }
  } else {
    permissions.defaultError(player._client)
  }
}

exports.gm = (args, client, packet) => {
  exports.gamemode(args, client, packet)
}

exports.gms = (args, player, packet) => {
  const permission = new permissions.Permission('mcjs.command.gamemode')
  if (permission.hasPermission(player.username)) {
    player.setGamemode(0)
    player.sendMessage({
      text: 'Set own gamemode to Survival Mode'
    })
  } else {
    permissions.defaultError(player._client)
  }
}

exports.gmc = (args, player, packet) => {
  const permission = new permissions.Permission('mcjs.command.gamemode')
  if (permission.hasPermission(player.username)) {
    player.setGamemode(1)
    player.sendMessage({
      text: 'Set own gamemode to Creative Mode'
    })
  } else {
    permissions.defaultError(player._client)
  }
}

exports.gma = (args, player, packet) => {
  const permission = new permissions.Permission('mcjs.command.gamemode')
  if (permission.hasPermission(player.username)) {
    player.setGamemode(2)
    player.sendMessage({
      text: 'Set own gamemode to Adventure Mode'
    })
  } else {
    permissions.defaultError(player._client)
  }
}

exports.gmsp = (args, player, packet) => {
  const permission = new permissions.Permission('mcjs.command.gamemode')
  if (permission.hasPermission(player.username)) {
    player.setGamemode(3)
    player.sendMessage({
      text: 'Set own gamemode to Spectator Mode'
    })
  } else {
    permissions.defaultError(player._client)
  }
}

exports.init = () => {
  new Command({
    command: 'gamemode',
    filename: 'gamemode.mcjsp',
    info: 'Changes your gamemode',
    usage: '/gamemode < 0 | 1 | 2 | 3 | s | c | a | sp | survival | creative | adventure | spectator >'
  })
  new Command({
    command: 'gm',
    filename: 'gamemode.mcjsp',
    info: 'Changes your gamemode',
    usage: '/gm < 0 | 1 | 2 | 3 | s | c | a | sp | survival | creative | adventure | spectator >'
  })
  new Command({
    command: 'gms',
    filename: 'gamemode.mcjsp',
    info: 'Changes your gamemode to Survival',
    usage: '/gms'
  })
  new Command({
    command: 'gmc',
    filename: 'gamemode.mcjsp',
    info: 'Changes your gamemode to Creative',
    usage: '/gmc'
  })
  new Command({
    command: 'gma',
    filename: 'gamemode.mcjsp',
    info: 'Changes your gamemode to Adventure',
    usage: '/gma'
  })
  new Command({
    command: 'gmsp',
    filename: 'gamemode.mcjsp',
    info: 'Changes your gamemode to Spectator',
    usage: '/gmsp'
  })
}