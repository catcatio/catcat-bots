import Unicorn from './app/unicorn'
import config from './config';


const email = 'nipon.chi@gmail.com'
const userId = 'U9c5aff748b62b918ef89a668c33b1f8f'
const requestSource = 'line'

const start = async () => {
  const unicorn = Unicorn(config.unicorn)
  unicorn.database.initDb()

  const tokenProducer = await unicorn.producerRegister(email, { userId, requestSource })

  const x: any = await unicorn.registerConfirmation({ token: tokenProducer })

  // await unicorn.adminRegister(email, { userId, requestSource })

  // await unicorn.registerConfirmation({ token: tokenAdmin  })

  await unicorn.approveRegistration({ token: x.approvedToken })
  await unicorn.approveRegistration({ token: x.rejectedToken })

}

start()
  .then(() => console.log('OK'))

