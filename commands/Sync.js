'use strict'

const { Command } = use('@adonisjs/ace')
const COR = use('adonis-cor-sdk')

class Sync extends Command {
  static get signature () {
    return 'check:service'
  }

  static get description () {
    return 'Checking for service status.'
  }

  async handle (args, options) {
      COR.checkService(sync => {
        console.log(`${this.chalk.gray(sync.statusCode)} - ${this.chalk.cyan(sync.body)}`)
      })
  }
}

module.exports = Sync