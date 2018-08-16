
module.exports = (config) => {
  const { middleware, eventHandler } = require('../api/line')(config)
  const router = require('express').Router()

  router.post('/webhook', middleware, (req, res) => {
    Promise
      .all(req.body.events.map(eventHandler))
      .then((result) => res.json(result))
      .catch((err) => {
        console.error(err.message)
        res.status(500).end()
      })
  })

  router.use('/', (req, res) => {
    res.status(200).send('OK')
  })

  return router
}