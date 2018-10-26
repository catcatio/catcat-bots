import { IParsedMessage } from '@catcat/chatbot-engine'
import { handlers } from './handlers'

export default (config) => {
  const handleMessage = handlers(config)
  return async (prasedMessage: IParsedMessage, originalMessage: any) => {
    return handleMessage(prasedMessage, originalMessage)
  }
}