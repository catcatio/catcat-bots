require('dotenv/config')

const config = require('./src/config')
const server = require('./src/server')

server(config).start()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })