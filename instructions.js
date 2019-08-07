'use strict'

const path = require('path')

async function makeConfigFile (cli) {
    try {
      const inFile = path.join(__dirname, './config', 'index.js')
      const outFile = path.join(cli.helpers.configPath(), 'cor-sdk.js')
      await cli.copy(inFile, outFile)
      cli.command.completed('create', 'config/cor-sdk.js')
    } catch (error) {
      // ignore error
    }
}

module.exports = {
    makeConfigFile(cli)
}
