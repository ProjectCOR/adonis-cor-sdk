/*
 * adonis-cor-sdk
 *
 * (c) Daniel Guzman <daniel@projectcor.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const { ServiceProvider } = require('@adonisjs/fold')

class CORIntegrationProvider extends ServiceProvider {

  register() {
    const Config = this.app.use('Adonis/Src/Config')
    this.app.singleton('Adonis/Addons/adonis-cor-sdk', () => {
      return new (require('../src/CORIntegration'))(Config)
    })

    this.app.alias('Adonis/Addons/adonis-cor-sdk', 'adonis-cor-sdk')

    this.app.bind('Adonis/Commands/Sync', () => require('../commands/Sync'))

  }

  boot() {
    const ace = require('@adonisjs/ace')

    ace.addCommand('Adonis/Commands/Sync')
  }

}

module.exports = CORIntegrationProvider
