const Translate = require('@google-cloud/translate')
const translate = new Translate()

module.exports = async (text) => {
  const defaultLanguage = 'en'
  const startTime = Date.now()
  try {
    const results = await translate.detect(text)

    if (results.length <= 0 || !results[0].language) {
      console.error('Bad detection result')
      return defaultLanguage
    }

    return results[0].language
  } catch (err) {
    console.error(err.message)
    return defaultLanguage  // return default language for now
  } finally {
    console.log('total language detection time: ', Date.now() - startTime)
  }
}
