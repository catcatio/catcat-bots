const eventType = '*'

const handleEvent = async (event) => {
  console.warn(JSON.stringify(event, null, 2))
  return null
}

module.exports = {
  eventType,
  handleEvent
}
