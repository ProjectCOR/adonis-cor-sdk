'use strict'

const { Command } = use('@adonisjs/ace')
const COR = use('adonis-cor-sdk')

class Sync extends Command {
  static get signature() {
    return 'check:service'
  }

  static get description() {
    return `${this.chalk.cyan("Checking for service status")}`
  }

  async handle(args, options) {
    console.log('')
    console.log('\x1b[36m%s\x1b[0m', '***********************************')
    console.log('\x1b[36m%s\x1b[0m', '                                  ')
    console.log('\x1b[36m%s\x1b[0m', `  ENV:   ${COR.env}               `)
    console.log('\x1b[36m%s\x1b[0m', `  URL:   ${COR.currentURL}        `)
    console.log('\x1b[36m%s\x1b[0m', '                                  ')
    console.log('\x1b[36m%s\x1b[0m', '************************************')
    await COR.checkService()
      .then(res => {
        console.log(`${this.chalk.green(res.statusCode)} - ${this.chalk.cyan(res.body)}`)
      })
      .catch(res => {
        console.log(`${this.chalk.red(res.statusCode)} - ${this.chalk.cyan(res.body)}`)
      })
  }
}

module.exports = Sync