export const intentName = 'admin.setupgroup'

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
    const result = await unicorn.adminSetupGroup(email, { userId, requestSource })
    return null
  } catch (err) {
    console.log(intentName, err)
  }
}