exports.init = () => {

}

exports.onJoin = (player) => {
  sendChunks(player)
  //Send entire map in a loop until later versions when we can detect the player location and send chunks based on that
  setInterval(() => {
    sendChunks(player)
  }, 1000)
}

function sendChunks(player) {
  const chunks = require('world').chunks
  for (var i = 0; i < chunks.length; i++) {
    const json = {
      x: chunks[i].chunkX,
      z: chunks[i].chunkZ,
      groundUp: true,
      biomes: chunks[i].chunk.dumpBiomes !== undefined ? chunks[i].chunk.dumpBiomes() : undefined,
      heightmaps: {
        type: 'compound',
        name: '',
        value: {
          MOTION_BLOCKING: { type: 'longArray', value: new Array(36).fill([0, 0]) }
        }
      },
      bitMap: chunks[i].chunk.getMask(),
      chunkData: chunks[i].chunk.dump(),
      blockEntities: []
    }
    player._client.write('map_chunk', json)
  }
}