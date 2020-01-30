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
    cli.command.info(`Checking if file exist: ${path.join(cli.helpers.configPath(), 'cor-sdk.js')}`)
    const exists = await cli.command.pathExists(path.join(cli.helpers.configPath(), 'cor-sdk.js'))
    cli.command.completed(`Exist`, exists)
    if (exists) {
      this.command.info('The file exist. Procedding to remove it')
      await cli.command.removeFile(path.join(cli.helpers.configPath(), 'cor-sdk.js'))
    }
    
    await cli.copy(path.join(__dirname, 'config/index.js'), path.join(cli.helpers.configPath(), 'cor-sdk.js'))
    cli.command.completed('create', 'config/cor-sdk.js')
  } catch (error) {
    cli.command.warn('config/cor-sdk.js already exists. Copy the config file from the following url')
    console.log('http://bit.ly/2RFTznS')
  }
}