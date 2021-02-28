exports.commands = []

class Command {
  constructor(args) {
    const { server } = require('../src/server')
    const { log } = require('api')

    exports.commands.push(args)
    if (server.debug) {
      log('debug', `Command registered: /${args.command}`)
    }
  }
}

exports.Command = Command