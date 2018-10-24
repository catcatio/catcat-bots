import messageHandler from './messageHandler'
import fulfillmentHandler from './fulfillmentHandler'

export default async (config) => {
  const linePay = require('line-pay')
  const linepay = new linePay(config.linepay)
  config.linepay = linepay

  return {
    name: 'gdh',
    messageHandler: messageHandler(config),
    fulfillmentHandler: fulfillmentHandler(config),
    providerConfigs: {
      line: config.line
    }
  }
}