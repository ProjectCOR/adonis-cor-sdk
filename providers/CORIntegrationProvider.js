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
