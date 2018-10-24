import { join } from 'path'
import { readFileSync } from 'fs'

const port = parseInt(process.env.PORT || '') || 3000
const chatbots = {
  port
}
const gdh = require(join(process.cwd(), 'gdh.config.json'))

export default {
  isProduction: process.env.NODE_ENV === 'production',
  chatbots,
  gdh
}
