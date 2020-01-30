'use strict'

/*
 * adonis-cor-sdk
 *
 * (c) Daniel Guzman <daniel@projectcor.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/


const path = require('path')

module.exports = async (cli) => {
  try {

    const exists = await cli.pathExists(path.join(cli.helpers.configPath(), 'cor-sdk.js'))

    if (exists) {
      await cli.removeFile(path.join(cli.helpers.configPath(), 'cor-sdk.js'))
    }
    
    await cli.copy(path.join(__dirname, 'config/index.js'), path.join(cli.helpers.configPath(), 'cor-sdk.js'))
    cli.command.completed('create', 'config/cor-sdk.js')
  } catch (error) {
    console.log("config file already exist!")
  }
}