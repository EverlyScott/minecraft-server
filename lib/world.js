const config = require('config')
const Chunk = require('prismarine-chunk')(config.version)
const Vec3 = require('vec3')
const mcData = require('minecraft-data')(config.version)
const fs = require('fs')
const { log } = require('api')

var chunks = []

exports.init = () => {
  log('info', `Now loading world ${config.world}`)

  var worldFiles = fs.readdirSync(config.world)

  for (var w = 0; w < worldFiles.length; w++) {
    if (config.debug) {
      log('debug', `Now working on world file: ${worldFiles[w]}`)
    }
    
    var world = JSON.parse(fs.readFileSync(`${config.world}/${worldFiles[w]}`))

    for (var i = 0; i < world.length; i++) {
      //New chunk
      if (config.debug) {
        log('debug', `Now working on chunk: ${world[i].chunkX}, ${world[i].chunkZ} in world file: ${worldFiles[w]}`)
      }
      chunks.push({
        chunk: new Chunk(),
        chunkX: world[i].chunkX,
        chunkZ: world[i].chunkZ
      })
      

      for (var b = 0; b < world[i].blocks.length; b++) {
        const block = world[i].blocks[b]
        //Fix the properties JSON to actually work in JSON.parse
        if (block.prop !== '{}') {
          block.prop = block.prop.replace(/'/g, '"')
          block.prop = block.prop.replace(/": /g, '": "')
          block.prop = block.prop.replace(/, "/g, '", "')
          block.prop = block.prop.replace(/}/g, '"}')
        }
        //JSON.parse the properties
        block.prop = JSON.parse(block.prop)
        chunks[i].chunk.setBlockType(new Vec3(block.x, block.y, block.z), mcData.blocksByName[block.type].id)
        if (block.prop.snowy === 'false' && block.type === 'grass_block') {
          chunks[i].chunk.setBlockData(new Vec3(block.x, block.y, block.z), 1)
        } else {
          chunks[i].chunk.setBlockData(new Vec3(block.x, block.y, block.z), 0)
        }
        if (block.prop.axis && block.type.endsWith('log')) {
          switch (block.prop.axis) {
            case 'x': {
              chunks[i].chunk.setBlockData(new Vec3(block.x, block.y, block.z), 0)
              break
            }
            case 'y': {
              chunks[i].chunk.setBlockData(new Vec3(block.x, block.y, block.z), 1)
              break
            }
            case 'z': {
              chunks[i].chunk.setBlockData(new Vec3(block.x, block.y, block.z), 2)
              break
            }
          }
        }
        if (block.prop.lit === 'false') {
          chunks[i].chunk.setSkyLight(new Vec3(block.x, block.y, block.z), 0)
        } else {
          chunks[i].chunk.setSkyLight(new Vec3(block.x, block.y, block.z), 15)
        }
      }
    }
  }

  log('info', `Finished loading world ${config.world}`)
}


exports.chunks = chunks