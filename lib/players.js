const { log } = require('api')
const fs = require('fs')
const messageParser = require('message-parser')
const { Packet } = require('packets')

exports.players = []

class Player {
  constructor(client) {
    const { config } = require('../src/server')
    const { performAllPlugins } = require('../src/server')

    exports.players.push(client)
    this._client = client
    this.loginPacket = require('../src/server').mcData.loginPacket
    this.online = true
    this.playerData = getPlayerData(this._client)
    this.username = this._client.username
    this.uuid = this._client.uuid
    this.ip = this._client.socket.remoteAddress
    this.port = this._client.socket.remotePort
    this.playerData.uuid = this.uuid
    this.playerData.username = this.username
    if (!this.playerData.ipHistory.includes(this.ip)) {
      this.playerData.ipHistory.push(this.ip)
    }
    this.latency = this._client.latency
    exports.sendMessage = this.sendMessage
    this._client.on('packet', (packet) => {
      new Packet(this, packet)
    })
    this._client.write('login', {
      entityId: this._client.id,
      isHardcore: false,
      gameMode: this.playerData.gamemode,
      previousGameMode: this.playerData.gameMode,
      worldNames: this.loginPacket.worldNames,
      dimensionCodec: this.loginPacket.dimensionCodec,
      dimension: this.loginPacket.dimension,
      worldName: 'minecraft:overworld',
      hashedSeed: [0, 0]
    })
    this.updatePosition(this.playerData.position.x, this.playerData.position.y, this.playerData.position.z, this.playerData.position.yaw, this.playerData.position.pitch)
    log('info', `UUID of player ${this.username} is ${this.uuid}`)

    const joinmsg = {
      text: `${this.username} joined the game`,
      color: 'yellow'
    }
    log('chat', messageParser(joinmsg))
    exports.performAllPlayers((client) => {
      this.sendMessage(joinmsg, client)
    })
    log('info', `${this.username}[/${this.ip}:${this.port}] logged in`)

    this._client.on('end', (reason) => {
      this.online = false
      this.leaveReason = reason
      exports.players.splice(exports.players.indexOf(this._client), 1)
      log('info', `${this.username} lost connection: ${this.leaveReason}`)
      if (this.leaveReason != 'SocketClosed') {
        log('error', 'It appears an error occurred! Here\'s the error stack:')
        console.log(this.leaveReason)
      }
      const leaveMsg = {
        text: `${this.username} left the game`,
        color: 'yellow'
      }
      log('chat', messageParser(leaveMsg))
      exports.performAllPlayers((client) => {
        this.sendMessage(leaveMsg, client)
      })
    })

    performAllPlugins((plugin) => {
      plugin = require(`../plugins/${plugin}`)
      if (typeof plugin.onJoin == 'function') {
        plugin.onJoin(this)
      }
    })
  }

  sendMessage(message, client = this._client) {
    if (typeof message == 'object') {
      client.write('chat', {message: JSON.stringify(message), position: 0, sender: '0'})
    } else if (typeof message == 'string') {
      client.write('chat', {message, position: 0, sender: '0'})
    } else {
      throw `Invalid chat object: ${message}! Needs to be typeof object or stringified object`
    }
  }

  updatePosition(x, y, z, yaw, pitch, client = this._client) {
    if (typeof x == 'number' && typeof y == 'number' && typeof z == 'number' && typeof yaw == 'number' && typeof pitch == 'number') {
      client.write('position', {
        x,
        y,
        z,
        yaw,
        pitch,
        flags: 0x00
      })
      this.playerData.position.x = x
      this.playerData.position.y = y
      this.playerData.position.z = z
      this.playerData.position.yaw = yaw
      this.playerData.position.pitch = pitch
      updatePlayerData(this.playerData)
    } else {
      throw `Invalid coords: ${x} ${y} ${z} ${yaw} ${pitch}! Needs to be typeof number`
    }
  }

  setGamemode(gamemode, client = this._client) {
    if (typeof gamemode == 'number' && gamemode > -1 && gamemode < 4) {
      client.write('game_state_change', {
        reason: 3,
        gameMode: gamemode
      })
      this.playerData.gamemode = gamemode
      updatePlayerData(this.playerData)
    } else {
      throw `Invalid gamemode: ${gamemode}! Needs to be typeof number and within the range of 0-3`
    }
  }

  kick(reason, client = this._client) {
    if (typeof reason == 'string') {
      client.write('disconnect', {
        reason
      })
    } else {
      throw `Invalid reason: ${reason}! Needs to be typeof string`
    }
  }
}

function getPlayerData(client) {
  if (fs.existsSync(`lib/playerdata/${client.uuid}.mcjspd`)) {
    return JSON.parse(fs.readFileSync(`lib/playerdata/${client.uuid}.mcjspd`))
  } else {
    return {
      username: client.username,
      uuid: client.uuid,
      ipHistory: [],
      gamemode: 0,
      position: {
        x: 0,
        y: 0,
        z: 0,
        yaw: 0,
        pitch: 0
      }
    }
  }
}

function updatePlayerData(playerData) {
  fs.writeFileSync(`lib/playerdata/${playerData.uuid}.mcjspd`, JSON.stringify(playerData))
}

exports.Player = Player

exports.performAllPlayers = (code) => {
  for (let i = 0; i < exports.players.length; i++) {
    code(exports.players[i])
  }
}