const line = require('@line/bot-sdk')
const eventHandlers = require('./eventHandlers')

const projectId = 'catcatchatbot' //https://dialogflow.com/docs/agents#settings
const sessionId = 'quickstart-session-id'
// const dialogflow = require('dialogflow').v2beta1
// const sessionClient = new dialogflow.SessionsClient()
// const sessionPath = sessionClient.sessionPath(projectId, sessionId)

const dummyMiddleware = (req, res, next) => next()

const middleware = (config) => config.isProduction ? line.middleware(config) : dummyMiddleware

const eventHandler = (config) => {
  const dialogflow = require('../dialogflow')(config)
  return async (event) => {
    // console.log(JSON.stringify(event))
    return eventHandlers(event).then(e => {
      const requestPayload = {
        source: 'line',
        data: event
      }
      return dialogflow
        .detectIntent(projectId, sessionId, e.text, e.languageCode, requestPayload)
        .then(response => {
          console.log('Detected intent result')
          console.log(JSON.stringify(response, null, 2))
          console.log('Detected intent')
          const result = response.queryResult
          console.log(`  Query: ${result.queryText}`)
          console.log(`  Response: ${result.fulfillmentMessages.map(f => f.text.text).join(',  ')}`)
          if (result.intent) {
            console.log(`  Intent: ${result.intent.displayName}`)
          } else {
            console.log('  No intent matched.')
          }
        })
        .catch(err => {
          console.error('ERROR:', err)
        })
    })
  }
}

module.exports = (config) => ({
  middleware: middleware(config),
  eventHandler: eventHandler(config)
})