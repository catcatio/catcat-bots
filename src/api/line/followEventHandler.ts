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

const handler = (lineClient) => async (event) => {
  return lineClient.replyMessage(event.replyToken, welcomeTemplate('Hi there, how can I help you?', 'Show Events', 'Nothing'))
}

export default {
  eventType,
  handler
}
