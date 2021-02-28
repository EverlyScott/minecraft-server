module.exports = {
  port: 25565, //Changes the port the server runs on. If this value is 25565, you will not need to enter the port number in game. (Integer, default: 25565)
  host: '0.0.0.0', //Changes the host the server runs on. If this is '127.0.0.1', only your computer will be able to access the server. If it is '0.0.0.0', any connection will be accepted (String, default: '0.0.0.0')
  //kickTimeout: 10000, //Kick client that doesn't answer to keepalive after specified time (Integer, default: 10000 (10 seconds))
  //checkTimeoutInterval: 4000, //Send keepalive packet at specified period (Integer, default: 4000 (4 seconds))
  'online-mode': true, //Boolean, default: true
  //beforePing: (response, client, callback) => {}, // Allow customization of the answer to ping the server does. It takes a function with argument response and client, response is the default json response, and client is client who sent a ping. It can take as third argument a callback. If the callback is passed, the function should pass its result to the callback, if not it should return. (Function, default: (response, client, callback) => {})
  motd: 'A MinecraftJS Server', //The MOTD that displays on server lists (String, default: 'A MinecraftJS server)
  //maxPlayers: 20, //Changes the max amount of players that can join at a time (Integer, default: 20)
  //keepAlive: true //Whether the server sends keepalive packets to clients (Boolean, default: true)
  version: '', //Changes server version. for supported versions, see ../supported-versions.txt (String)
  world: 'world/', //Changes the world folder path. (String, default: 'world/')
  //customPackets: '', //Honestly not sure what this does because the github description is confusing: An object index by version/state/direction/name, see client_custom_packet for an example
  //errorHandler: (client, error) => {}, //A way to override the default error handler for client errors. A function that takes a Client and an error. The default kicks the client (Function)
  //agent: null, //An HTTP agent that can be used to set proxy settings for yggdrasil authentication (https://authserver.mojang.com) confirmation (see proxy-agent on npm) (default: null)
  debug: false, //Enabled debug logging (Boolean, default: false)
  useUnbuiltPlugins: false, //Uses the unbuilt versions of plugins. Helpful for debugging crashes (Boolean, default: false)
  checkforupdates: true, //Whether the server checks our remote server for any updates on startup. (Boolean, default: true)
  coloredOps: { //This changes whether opped players have a different colored name in chat and commands
    enabled: true, //Boolean, default: true
    color: 'dark_red' //See the 'Name' attribe on this table for all possible colors: https://minecraft.gamepedia.com/Formatting_codes#Color_codes (String, default: 'dark_red')
  },
}