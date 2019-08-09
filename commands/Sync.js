'use strict'

const { Command } = use('@adonisjs/ace')
const COR = use('adonis-cor-sdk')
const chalk = require('chalk')

class Sync extends Command {
  static get signature() {
    return 'check:service'
  }

  static get description() {
    return `${chalk.cyan("Checking for service status")}`
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
        console.log(`${chalk.green(res.statusCode)} - ${chalk.cyan(res.body)}`)
      })
      .catch(res => {
        console.log(`${chalk.red(res.statusCode)} - ${chalk.cyan(res.body)}`)
      })
  }
}

module.exports = Sync