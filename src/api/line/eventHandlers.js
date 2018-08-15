const messageEventHandler = require('./messageEventHandler')
const defaultEventHandler = require('./defaultEventHandler')

const eventHandlers = {
  [messageEventHandler.eventType]: messageEventHandler
}

module.exports = (event) => {
  const handler = eventHandlers[event.type] || defaultEventHandler
  return handler.handleEvent(event)
}