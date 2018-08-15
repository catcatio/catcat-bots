const languageDetector = require('../languageDector')

const eventType = 'message'

const handleEvent = async (event) => {
  return {
    type: 'text',
    text: event.message.text,
    languageCode: await languageDetector(event.message.text)
  }
}

module.exports = {
  eventType,
  handleEvent
}
