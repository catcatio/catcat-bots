import * as line from '@line/bot-sdk';
import eventHandlers from './eventHandlers'
import languageDetector from '../languageDectector'
import { json } from 'body-parser'

const dummyMiddleware = json()

const middleware = (config) => config.isProduction ? line.middleware(config) : dummyMiddleware

const eventHandler = (config) => {
  const lineClient = new line.Client(config)
  const handleEvent = eventHandlers(lineClient, languageDetector)

  return async (event) => {
    return handleEvent(event)
  }
}

export default (config) => ({
  middleware: middleware(config),
  eventHandler: eventHandler(config)
})