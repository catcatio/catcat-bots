
export const intentName = null

export const handler = (unicornAdmin, lineClient, lineMessageFormatter, config) => async (agent) => {
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

  agent.add('fallback')
}