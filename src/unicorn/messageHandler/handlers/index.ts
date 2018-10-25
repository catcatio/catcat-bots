import { messageHandler as commonHandler } from './commonMessageHandler'
import { messageHandler as line } from './lineMessageHandler'
import { IParsedMessage } from 'catcat-chatbot-engine';

export const handlers = (config) => {
  const messageHandlers = {
    line: line(config),
    common: commonHandler(config)
  }

  return async (prasedMessage: IParsedMessage, originalMessage: any) => {
    const { source } = prasedMessage

    const messageHandler = messageHandlers[source]

    const response = await messageHandler(prasedMessage, originalMessage)

    return response || messageHandlers.common(prasedMessage, originalMessage)
  }
}
