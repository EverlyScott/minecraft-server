const { Command } = require('commands')
const permissions = require('permissions')
const { performAllPlayers } = require('players')

exports.weather = (args, player, packet) => {
  const permission = new permissions.Permission('mcjs.command.weather')
  if (permission.hasPermission(player.username)) {
    var weather = args[0]
    if (weather) {
      weather = weather.toLowerCase()
      const types = {
        clear: {
          reason: 1
        },
        rain: {
          reason: 2
        }
      }

      if (types[weather]) {
        performAllPlayers((client) => {
          client.write('game_state_change', types[weather])
        })
        
        player.sendMessage({
          text: `Set the weather to ${weather}`
        })
      } else {
        error()
      }
    } else {
      error()
    }
  } else {
    permissions.defaultError(player._client)
  }

  function error() {
    player.sendMessage({
      text: 'Invalid Weather Type!',
      color: 'red'
    })
  }
}

exports.init = () => {
  new Command({
    command: 'weather',
    filename: 'weather.mcjsp',
    info: 'Changes the weather',
    usage: '/weather < clear | rain >'
  })
}