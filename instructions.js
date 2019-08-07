'use strict'

const path = require('path')

module.exports = async (cli) => {
  try {
    await cli.copy(path.join(__dirname, 'config/index.js'), path.join(cli.helpers.configPath(), 'cor-sdk.js'))
    cli.command.completed('create', 'config/cor-sdk.js')
  } catch (error) {
    console.log(error)
  }
}