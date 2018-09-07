const eventType = 'postback'

import dialogflow from 'dialogflow';
import structjson from '../dialogflow/structjson';
import sessionHelper from '../../utils/sessionHelper'
import randomString from '../../utils/randomString'

const projectId = 'catcatchatbot' //https://dialogflow.com/docs/agents#settings

const PLATFORM_UNSPECIFIED = 'PLATFORM_UNSPECIFIED'
const PLATFORM_LINE = 'LINE'

const getUserId = (source) => {
  return source && source.userId
    ? source.userId
    : `???${randomString()}`
}

const handler = (lineClient) => {
  return async (event) => {
    const sessionClient = new dialogflow.SessionsClient()
    const sessionId = sessionHelper.makeSessionId(event)
    const sessionPath = sessionClient.sessionPath(projectId, sessionId)
    const userId = getUserId(event.source)
    const queryParamsPayload = {
      source: 'line',
      data: event
    }
    const query = {
      session: sessionPath,
      queryInput: {
        text: {
          text: event.postback.data,
          languageCode: 'en'
        },
      },
      queryParams: {
        // https://github.com/dialogflow/dialogflow-nodejs-client-v2/issues/9
        payload: structjson.jsonToStructProto(queryParamsPayload)
      }
    }

    console.log(`\t${userId} --> [postback] ${event.postback.data}`)

    return sessionClient.detectIntent(query)
      .then(response => {
        const result = response[0].queryResult
        // console.log(JSON.stringify(response[0].queryResult, null, 2))
        if (result.fulfillmentText) {
          console.log(`\t<-- [postback] ${result.fulfillmentText}`)
          lineClient.replyMessage(event.replyToken, { type: 'text', text: result.fulfillmentText })

        } else if (result.fulfillmentMessages && result.fulfillmentMessages.length > 0) {
          const replyMsgLine = result.fulfillmentMessages.find(f => f.platform === PLATFORM_LINE)
          const replyMsgUnknown = result.fulfillmentMessages.find(f => f.platform === PLATFORM_UNSPECIFIED)
          const replyMsg = replyMsgLine || replyMsgUnknown

          if (!replyMsg) { return }

          if (replyMsg.message === 'payload') {
            const payload: any = structjson.structProtoToJson(replyMsg.payload)
            const linePayload = payload.line
            console.log(`\t<-- [postback] ${JSON.stringify(linePayload)}`)
            return linePayload && lineClient.replyMessage(event.replyToken, linePayload)
          } else {
            return lineClient.replyMessage(event.replyToken, replyMsg[replyMsg.message])
          }
        }
      })
  }
}

export default {
  handler,
  eventType
}
