import { Sequelize } from 'sequelize-typescript'

import messageHandler from './messageHandler'
import fulfillmentHandler from './fulfillmentHandler'
import { Version, schemaVersion } from './models'
import versionController from './controllers/version'
import { version } from 'bluebird';

const initDb = async (config) => {
  console.log('initial Sequelize')
  const defaultConfig = {
    modelPaths: [Version],
    operatorsAliases: Sequelize.Op as any,
    logging: false,
  }
  const option: any = Object.assign(defaultConfig, config.sequelizeConfig)

  const sequelize = new Sequelize(option)
  console.log('Sequelize initialized: ', await sequelize.databaseVersion())
  return sequelize
}

export default async (config) => {
  config.db = await initDb(config)

  const currentSchemaVersion = schemaVersion
  const liveSchemaVersion = await versionController.getSchemaVersion()
    .catch(err => {
      console.log(err.message)
      return { value: '' }
    })
    .then(version => version ? version.value : '' )

  console.log(`schema live: ${liveSchemaVersion}, current: ${currentSchemaVersion}`)
  if (currentSchemaVersion !== liveSchemaVersion) {
    console.log(`updating schema to ${currentSchemaVersion}`)
    await config.db.sync({ force: true })
    const updateResult = await versionController.saveSchemaVersion(currentSchemaVersion)
    console.log(`schema updated to: ${updateResult ? updateResult.value : '???'}`)
  }

  return {
    name: 'unicorn',
    messageHandler: messageHandler(config),
    fulfillmentHandler: fulfillmentHandler(config),
    providerConfigs: {
      line: config.line
    }
  }
}
