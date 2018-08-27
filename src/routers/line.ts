import { Router } from 'express'
import lineApi from '../api/line'

export default (config) => {
  const { middleware, eventHandler } = lineApi(config)
  const router = Router()

  router.post('/webhook', middleware, (req, res) => {
    Promise
      .all(req.body.events.map(eventHandler))
      .then((result) => res.json(result))
      .catch((err) => {
        console.error(err.message)
        console.error(err.stack)
        res.status(500).end()
      })
  })

  router.use('/', (req, res) => {
    res.status(200).send('OK')
  })

  return router
}