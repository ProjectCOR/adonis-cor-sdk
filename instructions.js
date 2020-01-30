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
    console.log(typeof exists, exists)
    cli.command.completed(`Exist`, exists)
    if (exists) {
      this.command.info('The file exist. Proceeding to remove it')
      await cli.command.removeFile(path.join(cli.helpers.configPath(), 'cor-sdk.js'))
      await cli.copy(path.join(__dirname, 'config/index.js'), path.join(cli.helpers.configPath(), 'cor-sdk.js'))
      cli.command.completed('updated', 'config/cor-sdk.js')
    }else{
      this.command.info('The file does not exist. Proceeding to create it')
      await cli.copy(path.join(__dirname, 'config/index.js'), path.join(cli.helpers.configPath(), 'cor-sdk.js'))
      cli.command.completed('created', 'config/cor-sdk.js')
    }
    
    
  } catch (error) {
    cli.command.warn('config/cor-sdk.js already exists. Copy the config file from the following url')
    cli.command.warn('http://bit.ly/2RFTznS')
  }
}