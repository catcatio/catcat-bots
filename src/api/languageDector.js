const Translate = require('@google-cloud/translate')
const translate = new Translate()

module.exports = async (text) => {
  const startTime = Date.now()
  try {
    const results = await translate.detect(text)

    if (results.length <= 0 || !results[0].language) {
      throw Error('Bad detection result')
    }

    return results[0].language
  } catch (err) {
    console.error(err.message)
    throw err
  } finally {
    console.log('total language detection time: ', Date.now() - startTime)
  }
}

