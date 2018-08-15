module.exports = (config) => {
  const start = async () => {
    const app = require('./initExpress')(config)
    const routers = require('./routers')(config)
    app.use(routers)
  }

  return {
    start
  }
}