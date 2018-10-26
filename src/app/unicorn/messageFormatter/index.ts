import lineMessageFormatter from './lineMessageFormatter'

export default (config) => {
  const formatters = [
    // TODO: add more message formatters here
    lineMessageFormatter(config)
  ]
  return (source) => {
    return formatters.find(f => f.name === source)
  }
}
