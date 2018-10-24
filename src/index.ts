require('dotenv/config')
require('@rabbotio/noconsole')

import { chatbots } from 'catcat-chatbot-framework'
import config from './config';
import gdh from './gdh'

console.log('config.isProduction: ', config.isProduction)

chatbots(config.chatbots)
  .then(async bots => {
    bots.register(await gdh(config.gdh))
    bots.start()
    return bots
  })
  .then(bots => {
    process.on('SIGTERM', () => {
      console.info('SIGTERM signal received.');
      bots.stop()
    })
  })
