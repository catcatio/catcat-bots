module.exports = (lineClient, languageDetector) => {
  const messageEventHandler = require('./messageEventHandler')(lineClient, languageDetector)
  const followEventHandler = require('./followEventHandler')(lineClient)
  const defaultEventHandler = require('./defaultEventHandler')

  const eventHandlers = {
    [messageEventHandler.eventType]: messageEventHandler,
    [followEventHandler.eventType]: followEventHandler
  }

  return (event) => {
    const handler = eventHandlers[event.type] || defaultEventHandler
    return handler.handleEvent(event)
  }
}