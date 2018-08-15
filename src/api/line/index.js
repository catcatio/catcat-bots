const line = require('@line/bot-sdk')
const eventHandlers = require('./eventHandlers')

const middleware = (config) => line.middleware(config)

const eventHandler = async (event) => {
  console.log(JSON.stringify(event))
  return eventHandlers(event)
}

module.exports = (config) => ({
  middleware: middleware(config),
  eventHandler
})