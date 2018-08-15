const httpContext = require('express-http-context')
const randomString = require('../utils/randomString')

module.exports = (req, res, next) => {
  httpContext.set('reqId', randomString(5))
  next()
}