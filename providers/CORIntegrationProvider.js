const { ServiceProvider } = require('@adonisjs/fold')

class CORIntegrationProvider extends ServiceProvider {

  register () {

    this.app.singleton('Adonis/Addons/CORIntegration', () => {
        const Config = this.app.use('Adonis/Src/Config')
    	return new (require('../src/CORIntegration'))(Config)
    })

    this.app.alias('Adonis/Addons/CORIntegration', 'CORIntegration')

  }

}

module.exports = CORIntegrationProvider
