const colors = require('colors/safe')

module.exports = (msg) => {
  if (typeof msg == 'string') {
    msg = JSON.parse(msg)
  }
  return parsearr(msg)
  
  function parsearr(msg) {
    if (Array.isArray(msg)) {
      var str = ''
      for (var i = 0; i < msg.length; i++) {
        str += parsearr(msg[i])
      }
      return str
    } else {
      return parsecolor(msg)
    }
  }

  function parsecolor(msg) {
    const translate = {
      black: 'black',
      dark_blue: 'blue',
      dark_green: 'green',
      dark_aqua: 'cyan',
      dark_red: 'red',
      dark_purple: 'magenta',
      gold: 'yellow', 
      gray: 'gray',
      dark_gray: 'gray',
      blue: 'brightBlue',
      green: 'brightGreen',
      aqua: 'brightCyan',
      red: 'brightRed',
      pink: 'brightMagenta',
      yellow: 'brightYellow',
      white: 'white'
    }

    if (msg.color) {
      return parsestyle(colors[translate[msg.color]](msg.text), msg)
    } else {
      return parsestyle(msg.text, msg)
    }
  }

  function parsestyle(msg, original) {
    var lastmsg = msg

    if (original.obfuscated) {
      lastmsg = `${lastmsg}`.random
    }
    if (original.bold) {
      lastmsg = `${lastmsg}`.bold
    }
    if (original.strikethrough) {
      lastmsg = `${lastmsg}`.strikethrough
    }
    if (original.underline) {
      lastmsg = `${lastmsg}`.underline
    }
    if (original.italic) {
      lastmsg = `${lastmsg}`.italic
    }
    if (original.reset) {
      lastmsg = `${lastmsg}`.reset
    }
    
    return lastmsg
  }
}