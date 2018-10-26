import { SessionsClient } from 'dialogflow'

import languageDetector from '../../../utils/languageDetector'
import structjson from '../../../utils/dialogflow/structjson'
import { IParsedMessage } from '@catcat/chatbot-engine'

const PLATFORM_UNSPECIFIED = 'PLATFORM_UNSPECIFIED'

export const messageHandler = (config) =>
  async (prasedMessage: IParsedMessage, originalMessage: any) => {
    const projectId = config.googleServiceAccountKey.projectId
    const { message, userId, source, type } = prasedMessage
    console.log(`[${source}/${type}]\t${userId} --> ${message}`)

    if (type !== 'textMessage') {
      return null
    }

    const detectLanguage = languageDetector(config.googleServiceAccountKey.apiKey)
    const sessionClient = new SessionsClient(config.googleServiceAccountKey)
    const sessionPath = sessionClient.sessionPath(projectId, userId)

    const queryParamsPayload = {
      source,
      userId,
      type,
      message,
      data: originalMessage
    }
    const query = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: message ? await detectLanguage(message.substr(0, 12)) : 'en'
        },
      },
      queryParams: {
        // https://github.com/dialogflow/dialogflow-nodejs-client-v2/issues/9
        payload: structjson.jsonToStructProto(queryParamsPayload)
      }
    }

    return sessionClient.detectIntent(query)
      .then(response => {
        const result = response[0].queryResult
        console.log('detectIntent', JSON.stringify(response[0].queryResult))
        if (result.fulfillmentText) {
          console.log(`[${source}/${type}]\t${userId} <-- ${result.fulfillmentText}`)
          return result.fulfillmentText
        } else if (result.fulfillmentMessages && result.fulfillmentMessages.length > 0) {
          const targetPlatform = source ? source.toUpperCase() : PLATFORM_UNSPECIFIED
          const replyMsgLine = result.fulfillmentMessages.find(f => f.platform === targetPlatform)
          const replyMsgUnknown = result.fulfillmentMessages.find(f => f.platform === PLATFORM_UNSPECIFIED)
          const replyMsg = replyMsgLine || replyMsgUnknown

          if (!replyMsg) { return }

          if (replyMsg.payload !== undefined) { // from dialogflow custom response
            const payload: any = structjson.structProtoToJson(replyMsg.payload)
            const linePayload = payload.line
            console.log(`[${source}/${type}]\t${userId} <-- ${JSON.stringify(linePayload)}`)
            return linePayload
          } else if (replyMsg.text !== undefined) {
            const msg = replyMsg.text
            console.log(`[${source}/${type}]\t${userId} <-- ${JSON.stringify(msg)}`)
            return Array.isArray(msg.text) && msg.text.length > 0 ? msg.text[0]: JSON.stringify(msg)
          }
        }
      })
  }