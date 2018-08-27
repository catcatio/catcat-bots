require('dotenv/config')
require('@rabbotio/noconsole')

import config from './config';
import server from './server';

console.log('config.isProduction: ', config.isProduction)

server(config).start()
  .catch(err => {
    console.error(err)
    console.error(err.stack)
    process.exit(1)
  })