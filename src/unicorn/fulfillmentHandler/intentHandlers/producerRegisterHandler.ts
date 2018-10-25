export const intentName = 'producer.register'

export const handler = (unicorn, lineClient, lineMessageFormatter, config) => async (agent) => {
  console.log(intentName)

  const {
    requestSource,
    locale,
    action,
    session,
    parameters,
    userId,
    languageCode,
    queryText,
  } = agent


  const email = parameters['email']
  try {
    const result = await unicorn.register(email, { userId })
    return null
  } catch (err) {
    console.log(intentName, err)
  }
}