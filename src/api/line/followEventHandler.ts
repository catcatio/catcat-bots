const welcomeTemplate = (message, ...options) => {
  return {
    'type': 'text',
    'text': message,
    'quickReply': {
      'items': options.map(op => ({
        'type': 'action',
        'action': {
          'type': 'message',
          'label': op,
          'text': op
        }
      }))
    }
  }
}

const eventType = 'follow'

const tryGetErrorMessage = (err) => {
  try {
    return err.originalError.response.data.message
  } catch (err) {
    return ''
  }
}
const handler = (lineClient) => async (event) => {
  return lineClient.replyMessage(
    event.replyToken,
    welcomeTemplate('Hi there! We\'re tickets agent. You can try type "event" for listing an events.', 'Event', 'Nothing')
  )
  .catch(err => {
    console.log(JSON.stringify(event))
    console.error(tryGetErrorMessage(err))
  })
}

export default {
  eventType,
  handler
}
