const eventType = 'message'
const dialogflow = require('dialogflow')
const structjson = require('../dialogflow/structjson')

const projectId = 'catcatchatbot' //https://dialogflow.com/docs/agents#settings
const sessionId = 'quickstart-session-id' // TODO sessionid management

const PLATFORM_UNSPECIFIED = 'PLATFORM_UNSPECIFIED'
const PLATFORM_LINE = 'LINE'

module.exports = (lineClient, languageDetector) => {
  const handleEvent = async (event) => {
    console.log(`\t--> ${event.message.text}`)
    const sessionClient = new dialogflow.SessionsClient()
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
        // console.log(JSON.stringify(response[0].queryResult, null, 2))
        if (result.fulfillmentText) {
          console.log(`\t<-- ${result.fulfillmentText}`)
          lineClient.replyMessage(event.replyToken, { type: 'text', text: result.fulfillmentText })

        } else if (result.fulfillmentMessages && result.fulfillmentMessages.length > 0) {
          const replyMsgLine = result.fulfillmentMessages.find(f => f.platform === PLATFORM_LINE)
          const replyMsgUnknown = result.fulfillmentMessages.find(f => f.platform === PLATFORM_UNSPECIFIED)
          const replyMsg = replyMsgLine || replyMsgUnknown

          if (!replyMsg) { return }

          if (replyMsg.message === 'payload') {
            const payload = structjson.structProtoToJson(replyMsg.payload)
            const linePayload = payload.line
            console.log(`\t<-- ${JSON.stringify(linePayload)}`)
            return linePayload && lineClient.replyMessage(event.replyToken, linePayload)
          } else {
            return lineClient.replyMessage(event.replyToken, replyMsg[replyMsg.message])
          }
        }
      })
  }

  return {
    eventType,
    handleEvent
  }
}
// https://bots.dialogflow.com/line/1a581501-b2e6-43cb-98a9-9a64d1b39b80/webhook