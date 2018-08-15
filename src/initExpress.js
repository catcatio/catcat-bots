module.exports = ({ port }) => {
  const cors = require('cors')({ origin: true })
  const httpContext = require('express-http-context').middleware
  const bodyParser = require('body-parser')
  const app = require('express')()

  app.use(cors)
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(httpContext)
  app.use(require('./middleware/request-id'))

  app.listen(port, (err) => {
    if (err) {
      return console.log(`Failed to start server on port ${port}`, err)
    }
    console.log(`Listening on port ${port}`)
  })

  return app
}

