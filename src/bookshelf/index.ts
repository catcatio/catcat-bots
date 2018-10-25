import messageHandler from './messageHandler'
import fulfillmentHandler from './fulfillmentHandler'

export default async (config) => {
  return {
    name: 'bookshelf',
    messageHandler: messageHandler(config),
    fulfillmentHandler: fulfillmentHandler(config),
    providerConfigs: {
      line: config.line
    }
  }
}
