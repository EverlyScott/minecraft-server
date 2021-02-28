//Add lib/ to module search path (search path is now ['node_modules/', 'lib/'])
require('app-module-path-node').addPath('lib')
//Then start loading other modules
var config
try {
  config = require('./config')
} catch {
  require('api').log('error', 'Please create a config.js file!')
  process.exit()
}
const { Server } = require('./server')
const update = require('./update')
const pluginBuilder = require('plugin-builder')


if (process.argv.includes('--build-plugins')) {
  if (process.argv.includes('--rebuild')) {
    pluginBuilder(false, true)
  } else {
    pluginBuilder()
  }
} else {
  update(() => {
    const server = new Server(config)
  
    process.on('SIGINT', server.stop)
    process.on('SIGTERM', server.stop)
    process.on('uncaughtException', (err) => {
      console.error(err)
      server.stop()
    })
  })
}