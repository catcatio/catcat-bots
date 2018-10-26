import * as intentHandlers from './intentHandlers'
import { WebhookClient } from 'dialogflow-fulfillment'

const getLanguageCode = request => {
  try {
    return request.body.queryResult.languageCode
  } catch (e) {
    return null
  }
}

const getQueryText = request => {
  try {
    return request.body.queryResult.queryText
  } catch (e) {
    return null
  }
}

const getUserId = request => {
  try {
    return request.body.originalDetectIntentRequest.payload.data.source.userId
  } catch (e) {
    return null
  }
}

export default  (unicorn) => {
  const intentMap = new Map()
  Object.keys(intentHandlers).forEach(key => {
    intentMap.set(intentHandlers[key].intentName, intentHandlers[key].handler(unicorn))
  })

  return (request, response) => {
    try {
      console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers))
      console.log('Dialogflow Request body: ' + JSON.stringify(request.body))
      const agent = new WebhookClient({ request, response })

      agent.userId = getUserId(request)
      agent.languageCode = getLanguageCode(request)
      agent.queryText = getQueryText(request)

      agent.handleRequest(intentMap)

    } catch (error) {
      console.error('unicorn', error)
    }
  }
}