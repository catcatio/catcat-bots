import Unicorn from './app/unicorn'
import config from './config';


const email = 'nipon.chi@gmail.com'
const userId = 'U9c5aff748b62b918ef89a668c33b1f8f'
const requestSource = 'line'

const tokenProducer = '6f71a057042b46a037cfcd990ec38c5686d3693fd668e759d60d652acdd2196e3c5a2b6ad55bc88672607cdf957bafd29cc752ee4343f10a0b5f9f60b41a6e240df59d4708dbbe8ba8d00b6bca2acc62a50ee5fe22018d5b35d62483ba79b3d13486b77a02413c6343663579ec2fc253'
const tokenAdmin = '6f71a057042b46a037cfcd990ec38c5686d3693fd668e759d60d652acdd2196e3c5a2b6ad55bc88672607cdf957bafd29cc752ee4343f10a0b5f9f60b41a6e240df59d4708dbbe8ba8d00b6bca2acc626de775bc55b5498376ca7e73cd9a893aefacbbc86b4374cd5371cf3ca9cab6c9'
const tokenProducerApproval = '6f71a057042b46a037cfcd990ec38c5686d3693fd668e759d60d652acdd2196e3c5a2b6ad55bc88672607cdf957bafd29cc752ee4343f10a0b5f9f60b41a6e240df59d4708dbbe8ba8d00b6bca2acc62a50ee5fe22018d5b35d62483ba79b3d1112d8b66fd1a5fb5b9adf04c51376f952d7434cedaab04de58ff7de8d628b603'

const start = async () => {
  const unicorn = Unicorn(config.unicorn)
  unicorn.database.initDb()

  await unicorn.producerRegister(email, { userId, requestSource })

  await unicorn.registerConfirmation({ token: tokenProducer })

  // await unicorn.adminRegister(email, { userId, requestSource })

  // await unicorn.registerConfirmation({ token: tokenAdmin  })

  await unicorn.approveRegistration({ token: tokenProducerApproval })

}

start()
  .then(() => console.log('OK'))

