const line = require('@line/bot-sdk')

const dummyMiddleware = (req, res, next) => next()

const middleware = (config) => config.isProduction ? line.middleware(config) : dummyMiddleware

const eventHandler = (config) => {
  const languageDetector = require('../languageDector')
  const lineClient = new line.Client(config)
  const handleEvent = require('./eventHandlers')(lineClient, languageDetector)

  return async (event) => {
    return handleEvent(event)
  }
}

module.exports = (config) => ({
  middleware: middleware(config),
  eventHandler: eventHandler(config)
})