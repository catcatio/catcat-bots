import messageHandler from './messageHandler'
import fulfillmentHandler from './fulfillmentHandler'

export default async (config) => ({
  name: 'gdh',
  messageHandler: messageHandler(config),
  fulfillmentHandler: fulfillmentHandler(config),
  providerConfigs: {
    line: config.line
  }
})