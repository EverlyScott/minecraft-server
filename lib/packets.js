const server = require('../src/server')
const Chat = require('chat')
const players = require('players')
const { log } = require('api')

class Packet {
  constructor(player, packet) {
    if (server.config.debug) {
      log('packet', JSON.stringify(packet))
    }

    if (exports.typeOf(packet) == 'message') {
      new Chat(player, packet)
    } else if (exports.typeOf(packet) === 'fullposition') {
      players.updateLocalPosition(packet.x, packet.y, packet.z, packet.yaw, packet.pitch, player._client)
    } else if (exports.typeOf(packet) === 'xyzposition') {
      players.updateLocalPosition(packet.x, packet.y, packet.z, null, null, player._client)
    } else if (exports.typeOf(packet) === 'headposition') {
      players.updateLocalPosition(null, null, null, packet.yaw, packet.pitch, player._client)
    }
  }
}

exports.typeOf = (packet) => {
  if (packet.message) {
    return 'message'
  } else if (packet.keepAliveId) {
    return 'keepAlive'
  } else if (packet.locale && packet.viewDistance && packet.chatFlags && packet.chatColors & packet.skinParts && packet.mainHand) {
    return 'login'
  } else if (packet.x && packet.y && packet.z && packet.yaw && packet.pitch && packet.onGround) {
    return 'fullposition'
  } else if (packet.x && packet.y && packet.z) {
    return 'xyzposition'
  } else if (packet.yaw && packet.pitch) {
    return 'headposition'
  }
}
exports.Packet = Packet