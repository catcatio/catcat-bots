import initExpress from './initExpress'
import routers from './routers'

export default (config) => {
  const start = async () => {
    const app = initExpress(config)
    app.use(routers(config))
  }

  return {
    start
  }
}