import AESCrypto from '../../utils/AESCrypto';
import Database from './database'
import MessageFormatter from './messageFormatter'
import MessagingProvider from '../../messaging/messagingProvider'
import registrationController from './controllers/registration'
import producerController from './controllers/producer'

const confirmEmailTemplate = (confirmationUrl) => `<html>
<head>
    <style>
        html,
        body {
            margin: 0px
        }
        .content {
            padding: 20px;
            background-image: linear-gradient(to top, #FFFFFF, rgba(69, 90, 100, 0.382));
            background-repeat: no-repeat;
            text-shadow: 1px 1px #eeeeee;
        }
        a.confirm {
            text-decoration: none;
            color: #FFF;
            text-shadow: 1px 1px #222;
        }
    </style>
</head>
<div class="content" style="text-align: center;">
    <p style="margin: 2px; font-size: large;">🦄 Thanks for registering <b>Unicorn</b> 🦄</p>
    <p style="margin: 2px;"> / </p>
    <img width="32px" height="32px" src="https://raw.githubusercontent.com/rabbotio/minemark/master/public/kat.png">
    <br />
    <br />
    <table style="margin: 0px auto; background: #4184f3; display: table; border-radius: 2px; box-shadow: 1px 1px white;">
      <tr style="height: 6px;">
      </tr>
      <tr>
          <td style="padding-left: 8px; padding-right: 8px;">
              <a class="confirm" href="${confirmationUrl}">
                  Click here to confirm</a>
          </td>
      </tr>
      <tr style="height: 6px;">
      </tr>
    </table>
    <br />
    <p style="font-size: x-small;color:#555555;">MADE WITH ❤ <a href="https://catcat.io" style="font-size: x-small;color:#555555;text-decoration-line: none;">CATCAT.IO</a></p>
</div>
</html>
`
const sendMailAsync = (mailgun, mailOption) => new Promise((resolve, reject) => {
  // NC:TODO: Remove this when done !!!!
  // resolve('Fake mail sent')
  // return
  mailgun.messages().send(mailOption, (error, body) => {
    console.log(JSON.stringify(error || body))
    if (error) {
      reject(error)
    } else {
      resolve(body)
    }
  })
})

const producerRegister = (messagingProvider, messageFormatter, config) => async (email, { userId, requestSource }) => {
  email = email.toLowerCase()
  const source = requestSource.toLowerCase()
  console.log('register', email)
  const aes = AESCrypto(config.encryptionKey)
  const formatter = messageFormatter(source)
  const messagingClient = messagingProvider.get(source)
  const role = 'producer'


  const producer = await producerController.getByEmail(email)

  if (producer) {
    const errorMsg = `Hi ${producer.displayName}, you are already be a producer`
    console.log(errorMsg)
    await messagingClient.sendMessage(userId, errorMsg)
    return Promise.reject('REGISTER_ALREADY_ENROLLED')
  }

  const profile = await messagingClient.getProfile(userId)
  const registratonDetail = { userId, email, role, source, ...profile }

  const registration = await registrationController.newRegistration(email, role, registratonDetail)

  const encoded = aes.encrypt(Buffer.from(`{"id": "${registration.id}"}`)).toString('hex')

  let message = `Hi ${profile.displayName}, please confirm registration in your email`
  await messagingClient.sendMessage(userId, message)

  const confirmationUrl = `https://bots.catcat.io/unicorn/fulfillment/registerConfirmation?token=${encoded}`
  console.log('producerRegister', confirmationUrl)

  const mailgun = require('mailgun-js')(config.mailgunconfig)
  const html = confirmEmailTemplate(confirmationUrl)

  const mailOption = {
    from: config.unicornmail,
    to: email,
    subject: `Confirmation: Unicorn ${role} registration`,
    html,
  }

  sendMailAsync(mailgun, mailOption)
    .then(console.log)
    .catch(console.error)

  return encoded
}

const adminRegister = (messagingProvider, messageFormatter, config) => async (email, { userId, requestSource }) => {
  console.log('register', email)
  const source = requestSource.toLowerCase()
  const aes = AESCrypto(config.encryptionKey)
  const formatter = messageFormatter(source)
  const messagingClient = messagingProvider.get(source)
  const role = 'admin'
  const encoded = aes.encrypt(Buffer.from(JSON.stringify({ userId, email, role, source })))

  let message = `Hi ${email}, please confirm registration in your email`
  await messagingClient.sendMessage(userId, message)

  const confirmationUrl = `https://bots.catcat.io/unicorn/fulfillment/registerConfirmation?token=${encoded.toString('hex')}`
  console.log('adminRegister', confirmationUrl)

  const mailgun = require('mailgun-js')(config.mailgunconfig)

  const html = confirmEmailTemplate(confirmationUrl)

  const mailOption = {
    from: config.unicornmail,
    to: email,
    subject: `Confirmation Unicorn Admin Registration`,
    html,
  }

  sendMailAsync(mailgun, mailOption)
    .then(config.log)
    .catch(console.error)
}

const producerRegistrationConfirm = async (aes, registration, messagingProvider, messageFormatter, { adminGroup }) => {
  const source = registration.detail.source
  const formatter = messageFormatter(source)
  const messagingClient = messagingProvider.get(source)
  const adminGroupId = adminGroup[source]

  if (registration.approved != null) {
    const confirmedMessage = `Your registration has already been processed: ${registration.id}`
    console.log(confirmedMessage)
    await messagingClient.sendMessage(registration.detail.userId, confirmedMessage)
    return Promise.reject('REGISTER_ALREADY_PROCESSED')
  }

  const registerationInfo = registration.detail
  console.log(registerationInfo)
  let message = `Thanks for confirming your email, we will let you know when done: ${registerationInfo.role}`
  await messagingClient.sendMessage(registerationInfo.userId, message)

  const token = { id: registration.id }
  const approvedEncoded = aes.encrypt(Buffer.from(JSON.stringify({ ...token, approved: true }))).toString('hex')
  const rejectedEncoded = aes.encrypt(Buffer.from(JSON.stringify({ ...token, approved: false }))).toString('hex')
  const domain = 'https://bots.catcat.io'
  // const domain = 'http://localhost:3000'
  const approvalUrl = `${domain}/unicorn/fulfillment/approveRegistration?token=${approvedEncoded}`
  const rejectedUrl = `${domain}/unicorn/fulfillment/approveRegistration?token=${rejectedEncoded}`

  console.log('approvalUrl', approvalUrl)
  console.log('rejectedUrl', rejectedUrl)
  // NC:TODO: make a cool headshot image
  message = formatter.approveRegistrationTemplate(registerationInfo.pictureUrl, registerationInfo.displayName, registerationInfo.role, registerationInfo.email, approvalUrl, rejectedUrl)
  await messagingClient.sendCustomMessages(adminGroupId, message)

  return {
    approvedToken: approvedEncoded,
    rejectedToken: rejectedEncoded
  }
}

const adminRegistrationConfirm = async (registerationInfo, messagingProvider, messageFormatter) => {
  const formatter = messageFormatter(registerationInfo.source)
  const messagingClient = messagingProvider.get(registerationInfo.source)

  let message = `Hi ${registerationInfo.email}, welcome to ${registerationInfo.role} mode`
  await messagingClient.sendMessage(registerationInfo.userId, message)
}

const registerConfirmation = (messagingProvider, messageFormatter, config) => async (params) => {
  const aes = AESCrypto(config.encryptionKey)
  const decrypted = aes.decrypt(Buffer.from(params.token, 'hex')).toString()
  const decryptedInfo = JSON.parse(decrypted)

  const registration = await registrationController.getById(decryptedInfo.id)

  if (!registration) {
    console.error(`REGISTER_NOT_FOUND, ${decryptedInfo.id}`)
    return Promise.reject('REGISTER_NOT_FOUND')
  }

  if (registration.approved != null) {
    console.log('REGISTER_NOT_FOUND',`this registration has been processed, ${decryptedInfo.id}`)
    return Promise.reject('REGISTER_ALREADY_PROCESSED')
  }

  switch (registration.detail.role) {
    case 'producer':
      return producerRegistrationConfirm(aes, registration, messagingProvider, messageFormatter, config)
    case 'admin':
      return adminRegistrationConfirm(registration, messagingProvider, messageFormatter)
  }
}

const approveProducerRegistration = async (registration, approved, messagingProvider, messageFormatter, { adminGroup }) => {
  const registerationInfo = registration.detail
  const formatter = messageFormatter(registerationInfo.source)
  const messagingClient = messagingProvider.get(registerationInfo.source)
  const adminGroupId = adminGroup[registerationInfo.source]

  // const profile = await messagingClient.getProfile(registerationInfo.userId)

  if (registration.approved != null) {
    const confirmedMessage = `This registration has already been processed: ${registration.id}`
    console.log(confirmedMessage)
    await messagingClient.sendMessage(adminGroupId, confirmedMessage)
    return Promise.reject('REGISTER_ALREADY_PROCESSED')
  }

  registrationController.setApprovalResult(registration.id, approved)

  let message = approved
    ? `Hi ${registerationInfo.displayName}, welcome to ${registerationInfo.role} mode`
    : `Sorry ${registerationInfo.displayName}, your registration as ${registerationInfo.role} has been rejected`
  await messagingClient.sendMessage(registerationInfo.userId, message)

  let approvalResultMessage = `${approved ? 'APPROVED' : 'REJECTED'}: ${registerationInfo.displayName} as ${registerationInfo.role}`
  await messagingClient.sendMessage(adminGroupId, approvalResultMessage)

  if (approved) {
    producerController.newProducer(
      registerationInfo.email,
      registerationInfo.displayName,
      registerationInfo.pictureUrl,
      {
        [registerationInfo.source]: registerationInfo.userId
      }
    )
  }

  return approved ? 'APPROVED' : 'REJECTED'
}

const approveRegistration = (messagingProvider, messageFormatter, config) => async (params) => {
  const aes = AESCrypto(config.encryptionKey)
  const decoded = aes.decrypt(Buffer.from(params.token, 'hex'))
  const registerationInfo = JSON.parse(decoded.toString())

  const registration = await registrationController.getById(registerationInfo.id)
  if (!registration) {
    console.error(`REGISTER_NOT_FOUND, ${registerationInfo.id}`)
    return Promise.reject('REGISTER_NOT_FOUND')
  }

  switch (registration.detail.role) {
    case 'producer':
      return approveProducerRegistration(registration, registerationInfo.approved, messagingProvider, messageFormatter, config)
  }

// NC:TODO: handle unsupported role
}

export default (config) => {
  const messageFormatter = MessageFormatter(config)
  const messagingProvider = MessagingProvider(config)

  return {
    producerRegister: producerRegister(messagingProvider, messageFormatter, config),
    adminRegister: adminRegister(messagingProvider, messageFormatter, config),
    registerConfirmation: registerConfirmation(messagingProvider, messageFormatter, config),
    approveRegistration: approveRegistration(messagingProvider, messageFormatter, config),
    database: Database(config),
    config: config
  }
}