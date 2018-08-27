import * as express from 'express'
import * as cors from 'cors'
import { urlencoded } from 'body-parser'

export default ({ port }) => {

  const app = express()

  app.use(cors({ origin: true }))
  app.use(urlencoded({ extended: false }))

  // body parsing will done in line middleware
  // app.use(bodyParser.json())

  app.listen(port, (err) => {
    if (err) {
      return console.log(`Failed to start server on port ${port}`, err)
    }
    console.log(`Listening on port ${port}`)
  })

  return app
}

