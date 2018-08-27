import messageEventHandler from './messageEventHandler'
import followEventHandler from './followEventHandler'
import postbackEventHandler from './postbackEventHandler'
import defaultEventHandler from './defaultEventHandler'

export default (lineClient, languageDetector) => {
  const eventHandlers = {
    [messageEventHandler.eventType]: messageEventHandler.handler(lineClient, languageDetector),
    [followEventHandler.eventType]: followEventHandler.handler(lineClient),
    [postbackEventHandler.eventType]: postbackEventHandler.handler(lineClient)
  }

  return (event) => {
    const eventHandler = eventHandlers[event.type] || defaultEventHandler.handler()
    return eventHandler(event)
  }
}