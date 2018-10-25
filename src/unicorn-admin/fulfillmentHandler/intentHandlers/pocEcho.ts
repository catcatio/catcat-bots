export const intentName = 'poc-echo'

export const handler = (moviesRepository, lineClient, lineMessageFormatter, { userStore }) => async (agent) => {
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

  const movies = moviesRepository.getAllMovies()

  const x = movies.map(m => Object.assign({}, {hasPurchased: userStore[userId] && userStore[userId][m.id]}, m))
  console.log(parameters['echotext'])
  try {
    const message = lineMessageFormatter.messageTemplate(`admin: ${parameters['echotext']}`)
    console.log(JSON.stringify(message))
    lineClient.pushMessage(userId, message)
    return {platform: "LINE", content: message}
  } catch (err) {
    console.log(intentName, err)
  }
}