require('dotenv/config')

const config = require('./src/config')
const server = require('./src/server')

console.log('config.isProduction: ', config.isProduction)

server(config).start()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })