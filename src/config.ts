import { join } from 'path'
import { readFileSync } from 'fs'

const port = parseInt(process.env.PORT || '') || 3000
const chatbots = {
  port
}

const extendLinepay = (config) => {
  const linePay = require('line-pay')
  const linepay = new linePay(config.linepay)
  config.linepay = linepay
}

const loadConfig = (name) => {
  const config = require(join(process.cwd(), `${name}.config.json`))
  extendLinepay(config)
  return config
}

const gdh = loadConfig('gdh')
const bookshelf = loadConfig('bookshelf')
const unicorn = loadConfig('unicorn')
const unicornAdmin = loadConfig('unicorn-admin')

export default {
  isProduction: process.env.NODE_ENV === 'production',
  chatbots,
  gdh,
  bookshelf,
  unicorn,
  unicornAdmin
}
