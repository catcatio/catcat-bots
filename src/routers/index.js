module.exports = (config) => {
  const line = require('./line')(config)
  const router = require('express').Router()
  router.use('/line', line)
  return router
}