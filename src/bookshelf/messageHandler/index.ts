import { handlers } from './handlers'
import { IParsedMessage } from 'catcat-chatbot-engine';

export default (config) => {
  const handleMessage = handlers(config)
  return async (prasedMessage: IParsedMessage, originalMessage: any) => {
    return handleMessage(prasedMessage, originalMessage)
  }
}