import line from './line'
import { Router } from 'express'

export default (config) => {
  const router = Router()
  router.use('/line', line(config))
  return router
}