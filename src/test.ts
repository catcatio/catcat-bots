import Unicorn from './app/unicorn'
import config from './config';


const email = 'nipon.chi@gmail.com'
const userId = 'U9c5aff748b62b918ef89a668c33b1f8f'
const requestSource = 'line'

const tokenProducer = '6f71a057042b46a037cfcd990ec38c5686d3693fd668e759d60d652acdd2196e3c5a2b6ad55bc88672607cdf957bafd29cc752ee4343f10a0b5f9f60b41a6e240df59d4708dbbe8ba8d00b6bca2acc6204eb826affd1eba5b1c7dc4a2b7f536c'
const tokenAdmin = '6f71a057042b46a037cfcd990ec38c5686d3693fd668e759d60d652acdd2196e3c5a2b6ad55bc88672607cdf957bafd29cc752ee4343f10a0b5f9f60b41a6e240df59d4708dbbe8ba8d00b6bca2acc62644b4be504e81744043c35d069b68716'

const start = async () => {
  const unicorn = Unicorn(config.unicorn)
  unicorn.database.initDb()

  unicorn.producerRegister(email, { userId, requestSource })

  // unicorn.producerEmailConfirm({ token: tokenProducer })

  // unicorn.adminRegister(email, { userId })

  // unicorn.adminEmailConfirm({ token: tokenAdmin })

}

start()
  .then(() => console.log('OK'))

