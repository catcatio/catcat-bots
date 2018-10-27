export const intentName = 'producer.register'

export const handler = (unicorn) => async (agent) => {
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
    const result = await unicorn.producerRegister(email, { userId, requestSource: requestSource })
    console.log(intentName, result)
    return null
  } catch (err) {
    console.log(intentName, err)
  }
}