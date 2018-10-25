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

const gdh = require(join(process.cwd(), 'gdh.config.json'))
const bookshelf = require(join(process.cwd(), 'bookshelf.config.json'))
const unicorn = require(join(process.cwd(), 'unicorn.config.json'))

extendLinepay(gdh)
extendLinepay(bookshelf)
extendLinepay(unicorn)

export default {
  isProduction: process.env.NODE_ENV === 'production',
  chatbots,
  gdh,
  bookshelf,
  unicorn
}
