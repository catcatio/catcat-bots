import { Sequelize } from 'sequelize-typescript'
import { Version, Registration, schemaVersion } from './models'
import versionController from './controllers/version'
import { Producer } from './models/Producer';

const initDb = async (config) => {
  console.log('initial Sequelize')
  const defaultConfig = {
    modelPaths: [Version, Registration, Producer],
    operatorsAliases: Sequelize.Op as any,
    logging: false,
  }
  const option: any = Object.assign(defaultConfig, config.sequelizeConfig)

  const sequelize = new Sequelize(option)
  console.log('Sequelize initialized: ', await sequelize.databaseVersion())
  return sequelize
}

const checkDBSchema = async (db) => {
  await db.sync({ force: true })
  // NC:TODO: turn this back on
  // const currentSchemaVersion = schemaVersion
  // const liveSchemaVersion = await versionController.getSchemaVersion()
  //   .catch(err => {
  //     console.log(err.message)
  //     return { value: '' }
  //   })
  //   .then(version => version ? version.value : '' )

  // console.log(`schema live: ${liveSchemaVersion}, current: ${currentSchemaVersion}`)
  // if (currentSchemaVersion !== liveSchemaVersion) {
  //   console.log(`updating schema to ${currentSchemaVersion}`)
  //   await db.sync({ force: true })
  //   const updateResult = await versionController.saveSchemaVersion(currentSchemaVersion)
  //   console.log(`schema updated to: ${updateResult ? updateResult.value : '???'}`)
  // }
}

export default (config) => {
  let database
  return {
    initDb: async () => {
      database = await initDb(config)
      await checkDBSchema(database)
    }
  }
}