const eventType = '*'

const handler = () => async (event) => {
  console.warn(JSON.stringify(event, null, 2))
  return null
}

export default {
  eventType,
  handler
}
