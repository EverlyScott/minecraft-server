const server = require('../src/server')
const Chat = require('chat')
const { log } = require('api')

class Packet {
  constructor(player, packet) {
    if (server.config.debug) {
      log('packet', JSON.stringify(packet))
    }

    if (exports.typeOf(packet) == 'message') {
      new Chat(player, packet)
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
    return 'position'
  }
}
exports.Packet = Packet