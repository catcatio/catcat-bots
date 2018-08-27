import * as Translate from '@google-cloud/translate';
const translate = new Translate()

export default async (text) => {
  const defaultLanguage = 'en'
  const startTime = Date.now()
  let result = 'NA'
  try {
    const results = await translate.detect(text)

    if (results.length <= 0 || !results[0].language) {
      console.error('Bad detection result')
      return defaultLanguage
    }

    return result = results[0].language
  } catch (err) {
    console.error(err.message)
    return defaultLanguage  // return default language for now
  } finally {
    console.log(`total language detection time (${result}): `, Date.now() - startTime)
  }
}
