import messageHandler from './messageHandler'
import fulfillmentHandler from './fulfillmentHandler'
import Unicorn from '../app/unicorn'

export default async (config) => {
  const unicorn = Unicorn(config)
  // await unicorn.database.initDb()

  return {
    name: 'unicorn',
    messageHandler: messageHandler(unicorn.config),
    fulfillmentHandler: null, // fulfillmentHandler(unicorn),
    providerConfigs: {
      line: config.line
    }
  }
}
