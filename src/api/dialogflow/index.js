const request = require('request-promise-native')

module.exports = ({ accessToken }) => {
  const detectIntent = async (projectId, sessionId, queryText, languageCode, payload) => {
    const session = `projects/${projectId}/agent/sessions/${sessionId}`
    const detectIntentUrl = `https://dialogflow.googleapis.com/v2/${session}:detectIntent`

    const reqBody = {
      session: session,
      query_input: {
        text: {
          text: queryText,
          language_code: languageCode
        },
      },
      query_params: {
        payload: payload
      }
    }

    return request({
      method: 'POST',
      uri: detectIntentUrl,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: reqBody,
      json: true
    }).catch(console.error)
  }

  return { detectIntent }
}