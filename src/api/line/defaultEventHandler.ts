const eventType = '*'

const handler = () => async (event) => {
  console.warn(JSON.stringify(event))
  return null
}

export default {
  eventType,
  handler
}
