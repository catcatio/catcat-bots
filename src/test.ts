import Unicorn from './app/unicorn'
import config from './config';


const email = 'nipon.chi@gmail.com'
const userId = 'U9c5aff748b62b918ef89a668c33b1f8f'
const requestSource = 'line'

const start = async () => {
  const unicorn = Unicorn(config.unicorn)
  unicorn.database.initDb()

  // const tokenProducer = await unicorn.producerRegister(email, { userId, requestSource })
  //   .catch(error => console.error(error))

  // const x: any = await unicorn.registerConfirmation({ token: tokenProducer })
  //   .catch(error => console.error(error))

  // // await unicorn.adminRegister(email, { userId, requestSource })
  // // await unicorn.registerConfirmation({ token: tokenAdmin  })

  // await unicorn.approveRegistration({ token: x.approvedToken })
  //   .catch(error => console.error(error))
  // await unicorn.approveRegistration({ token: x.rejectedToken })
  //   .catch(error => console.error(error))




  // const tokenProducer2 = await unicorn.producerRegister(email, { userId, requestSource })
  //   .catch(error => console.error(error))

  // const x2: any = await unicorn.registerConfirmation({ token: tokenProducer2 })
  //   .catch(error => console.error(error))

  // // await unicorn.adminRegister(email, { userId, requestSource })
  // // await unicorn.registerConfirmation({ token: tokenAdmin  })

}

start()
  .then(() => console.log('OK'))

