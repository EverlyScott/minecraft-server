const mc = require('minecraft-protocol')
const { performance } = require('perf_hooks')
const { log } = require('api')
const fs = require('fs')
const { Player } = require('players')
const pluginBuilder = require('plugin-builder')
const { minify } = require('uglify-es')
const startTick = require('tick').init
const Console = require('console.js')

class Server {
  constructor(config) {
    exports.server = this
    this.config = config

    if (process.argv.includes('--offline') || process.argv.includes('-o')) {
      this.config['online-mode'] = false
    }

    if (process.argv.includes('--debug') || process.argv.includes('-d')) {
      this.config.debug = true
    }

    exports.config = this.config

    log('info', `Starting MCJS with support for version ${this.config.version}`)
    log('info', `Starting MCJS on ${this.config.host}:${this.config.port}`)

    startTick()

    if (!this.config['online-mode']) {
      log('info', 'Starting in offline mode!')
    }

    if (this.config.debug) {
      log('debug', 'Debug mode has been enabled!')
    }

    pluginBuilder(true)

    //Load world
    require('world').init()

    this.performAllPlugins((plugin) => {
      if (this.config.debug) {
        log('debug', `Plugin initializing: ${plugin}`)
      }
      if (fs.existsSync(`plugins/${plugin.replace('.mcjsp', '.js')}`)) {
        if (this.config.debug) {
          log('debug', `Checking for changes since last build of ${plugin}`)
        }
        const unbuiltplugin = plugin.replace('.mcjsp', '.js')
        const newminified = minify(fs.readFileSync(`plugins/${unbuiltplugin}`, 'utf-8'))
        if (newminified.code != fs.readFileSync(`plugins/${plugin}`, 'utf-8')) {
          if (this.config.debug) {
            log('debug', `Rebuilding ${plugin}`)
          }
          if (newminified.error) {
            log('debug', `Error rebuilding plugin ${plugin}`)
            console.error(newminified.error)
          } else {
            fs.writeFileSync(`plugins/${plugin}`, newminified.code)
            if (this.config.debug) {
              log('debug', `Rebuilt plugin ${plugin}`)
            }
          }
        } else {
          if (this.config.debug) {
            log('debug', `No changes since last build of ${plugin}`)
          }
        }
      }
      try {
        if (this.config.useUnbuiltPlugins) {
          require(`../plugins/${plugin.replace('.mcjsp', '')}`).init()
        } else {
          require(`../plugins/${plugin}`).init()
        }
      } catch (err) {
        if (err == 'TypeError: require(...).init is not a function') {
          log('error', `The plugin ${plugin} does not contain a valid init function!`)
        } else {
          throw err
        }
      }
      if (this.config.debug) {
        log('debug', `Plugin initialized: ${plugin}`)
      }
    })

    this.server = mc.createServer(this.config)
    this.server.mcData = require('minecraft-data')(this.server.version)
    exports.mcData = this.server.mcData

    this.server.on('listening', () => {
      const time = performance.now()
      log('info', `Time elapsed: ${Math.round(time)} ms`)
      log('info', `Done (${Math.round((time / 1000) * 1000)/1000}s)! For help, type "/help"`)

      new Console()

      this.performAllPlugins((plugin) => {
        plugin = require(`../plugins/${plugin}`)
        if (typeof plugin.onstart == 'function') {
          plugin.onstart(time)
        }
      })
    })

    this.server.on('login', (client) => {
      new Player(client)
    })
  }

  performAllPlugins(code) {
    this._plugins = fs.readdirSync('plugins')
    for (let i = 0; i < this._plugins.length; i++) {
      let currentPlugin = this._plugins[i]
      if (currentPlugin.endsWith('.mcjsp')) {
        code(currentPlugin)
      }
    }
  }

  stop() {
    log('info', 'Stopping the server')
    log('info', 'Stopping server')
    log('info', 'Closing Server')
    //Kick all players
    require('players').performAllPlayers((client) => {
      client.write('disconnect', {
        reason: '{"text":"hello"}'
      })
    })
    //Stop ticking
    require('tick').stopTicking()
    process.exit()
  }
}

exports.Server = Server

exports.performAllPlugins = (code) => {
  const plugins = fs.readdirSync('plugins')
  for (let i = 0; i < plugins.length; i++) {
    let currentPlugin = plugins[i]
    if (currentPlugin.endsWith('.mcjsp')) {
      code(currentPlugin)
    }
  }
}