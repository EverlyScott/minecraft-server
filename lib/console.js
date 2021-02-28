var log
var commandParser
var messageParser
var stdout
var stdin
var readline
var players
var rl

class Console {
  constructor() {
    //Initialize variables
    log = require('api').log
    commandParser = require('command-parser')
    messageParser = require('message-parser')
    stdout = require('process').stdout
    stdin = require('process').stdin
    readline = require('readline')
    players = require('players')
    rl = readline.createInterface({ input: stdin, output: stdout })

    stdin.resume()
    rl.prompt()

    rl.on('line', (input) => {
      if (input.toLowerCase().startsWith('c:')) {
        const msg = {
          translate: 'chat.type.text',
          with: [
            'Console',
            input.replace('C:', '').replace('c:', '')
          ]
        }
        players.performAllPlayers((client) => {
          players.sendMessage(msg, client)
        })
        log('chat', `<${msg.with[0]}> ${msg.with[1]}`)
      } else {
        sendCommand(input)
      }
    
      rl.prompt()
    })
  }
}

function sendCommand(cmd) {
  const { server } = require('../src/server')

  //simulate a player class so plugins don't break
  const player = {
    _client: {
      write: (type, obj) => {
        if (type == 'chat') {
          player.sendMessage(obj)
        }
      }
    },
    loginPacket: require('../src/server').mcData.loginPacket,
    online: true,
    playerData: {
      username: 'Console',
      uuid: '00000000-0000-0000-0000-000000000000',
      ipHistory: [
        server.config.host
      ],
      gamemode: 0,
      position: {
        x: 0,
        y: 0,
        z: 0,
        yaw: 0,
        pitch: 0
      }
    },
    username: 'Console',
    uuid: '00000000-0000-0000-0000-000000000000',
    ip: server.config.host,
    port: server.config.port,
    latency: 0,
    
    sendMessage: (obj) => {
      if (obj.message) {
        obj = obj.message
      }
      log('chat', messageParser(obj))
    },
    
    updatePosition: () => {},

    setGamemode: () => {}
  }

  var packet
  if (cmd.startsWith('/')) {
    packet = {
      message: cmd
    }
  } else {
    packet = {
      message: `/${cmd}`
    }
  }

  commandParser(player, packet)
}

module.exports = Console