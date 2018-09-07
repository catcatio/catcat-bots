const eventType = 'message'
import dialogflow from 'dialogflow';
import structjson from '../dialogflow/structjson'
import sessionHelper from '../../utils/sessionHelper'

const projectId = 'catcatchatbot' //https://dialogflow.com/docs/agents#settings

const PLATFORM_UNSPECIFIED = 'PLATFORM_UNSPECIFIED'
const PLATFORM_LINE = 'LINE'

const handler = (lineClient, languageDetector) => {
  return async (event) => {
    if (!event || !event.message || !event.message.text) {
      console.error(`something wrong here !!!`)
      console.error(JSON.stringify(event))
      return
    }

    console.log(`\t--> ${event.message.text}`)
    const sessionClient = new dialogflow.SessionsClient()
    const sessionId = sessionHelper.makeSessionId(event)
    const sessionPath = sessionClient.sessionPath(projectId, sessionId)
    const queryParamsPayload = {
      source: 'line',
      data: event
    }
    const query = {
      session: sessionPath,
      queryInput: {
        text: {
          text: event.message.text,
          languageCode: await languageDetector(event.message.text)
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
        console.log(JSON.stringify(response[0].queryResult))
        if (result.fulfillmentText) {
          console.log(`\t<-- ${result.fulfillmentText}`)
          lineClient.replyMessage(event.replyToken, { type: 'text', text: result.fulfillmentText })

        } else if (result.fulfillmentMessages && result.fulfillmentMessages.length > 0) {
          const replyMsgLine = result.fulfillmentMessages.find(f => f.platform === PLATFORM_LINE)
          const replyMsgUnknown = result.fulfillmentMessages.find(f => f.platform === PLATFORM_UNSPECIFIED)
          const replyMsg = replyMsgLine || replyMsgUnknown

          if (!replyMsg) { return }

          if (replyMsg.message === 'payload') { // from dialogflow custom response
            const payload: any = structjson.structProtoToJson(replyMsg.payload)
            const linePayload = payload.line
            console.log(`\t<-- ${JSON.stringify(linePayload)}`)
            return linePayload && lineClient.replyMessage(event.replyToken, linePayload)
          } else {
            const msg = replyMsg[replyMsg.message]
            console.log(`\t<-- ${msg}`)
            return lineClient.replyMessage(event.replyToken, msg)
          }
        }
      })
  }
}

export default {
  handler,
  eventType
}