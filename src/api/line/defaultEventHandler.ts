const eventType = '*'

const handler = () => async (event) => {
  console.warn('unhandled event', JSON.stringify(event))
  return null
}

export default {
  eventType,
  handler
}
