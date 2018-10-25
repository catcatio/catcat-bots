import messageHandler from './messageHandler'
import fulfillmentHandler from './fulfillmentHandler'

export default async (config) => {
  return {
    name: 'unicorn',
    messageHandler: messageHandler(config),
    fulfillmentHandler: fulfillmentHandler(config),
    providerConfigs: {
      line: config.line
    }
  }
}
