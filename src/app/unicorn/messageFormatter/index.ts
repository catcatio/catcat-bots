import lineMessageFormatter from './lineMessageFormatter'

export default (config) => {
  const formatters = [
    lineMessageFormatter(config)
  ]
  return (source) => {
    return formatters.find(f => f.name === source)
  }
}
