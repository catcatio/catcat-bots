require('dotenv/config')
require('@rabbotio/noconsole')

import { chatbots } from 'catcat-chatbot-engine'
import config from './config';
import gdh from './gdh'
import bookshelf from './bookshelf'
import unicorn from './unicorn';

console.log('config.isProduction: ', config.isProduction)

chatbots(config.chatbots)
  .then(async bots => {
    bots.register(await gdh(config.gdh))
    bots.register(await bookshelf(config.bookshelf))
    bots.register(await unicorn(config.unicorn))
    bots.start()
    return bots
  })
  .then(bots => {
    process.on('SIGTERM', () => {
      console.info('SIGTERM signal received.')
      bots.stop()
    })
  })
