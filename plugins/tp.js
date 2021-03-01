const { Command } = require('commands')
const permissions = require('permissions')

function command(args, player, packet) {
  player.updatePlayerData()
  var x = args[0]
  var y = args[1]
  var z = args[2]
  var yaw = args[3] || player.playerData.position.yaw
  var pitch = args[4] || player.playerData.position.pitch
  const coordsbefore = [player.playerData.position.x, player.playerData.position.y, player.playerData.position.z, player.playerData.position.yaw, player.playerData.position.pitch]
  const coords = [x, y, z, yaw, pitch]
  for (let i = 0; i < coords.length; i++) {
    if (typeof coords[i] != 'number') {
      if (coords[i].startsWith('~')) {
        if (coords[i] == '~') {
          coords[i] = coordsbefore[i]
        } else {
          coords[i] = coordsbefore[i] + parseInt(coords[i].replace('~', ''))
        }
      } else {
        coords[i] = parseInt(coords[i])
      }
    }
  }
  player.updatePosition(coords[0], coords[1], coords[2], coords[3], coords[4])
}

exports.tp = command
exports.teleport = command

exports.init = () => {
  new Command({
    command: 'tp',
    filename: 'tp.js',
    info: 'Teleports the player',
    usage: '/tp <x> <y> <z> <yaw?> <pitch?>'
  })
  new Command({
    command: 'teleport',
    filename: 'tp.js',
    info: 'Teleports the player',
    usage: '/teleport <x> <y> <z> <yaw?> <pitch?>'
  })
}