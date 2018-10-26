import AESCrypto from '../../utils/AESCrypto';
import Database from './database'
import MessageFormatter from './messageFormatter'
import MessagingProvider from '../../messaging/messagingProvider'

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
  resolve('Fake mail sent')
  return
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
  console.log('register', email)
  const aes = AESCrypto(config.encryptionKey)
  const formatter = messageFormatter(requestSource)
  const messagingClient = messagingProvider.get(requestSource)
  const role = 'producer'
  const source = requestSource
  const encoded = aes.encrypt(Buffer.from(JSON.stringify({ userId, email, role, source })))

  const profile = await messagingClient.getProfile(userId)

  let message = `Hi ${profile.displayName}, please confirm registration in your email`
  await messagingClient.sendMessage(userId, message)

  const confirmationUrl = `https://bots.catcat.io/unicorn/fulfillment/registerConfirmation?token=${encoded.toString('hex')}`
  console.log('producerRegister', confirmationUrl)

  const mailgun = require('mailgun-js')(config.mailgunconfig)
  const html = confirmEmailTemplate(confirmationUrl)

  const mailOption = {
    from: config.unicornmail,
    to: email,
    subject: `Confirmation Unicorn Admin Registration`,
    html,
  }

  sendMailAsync(mailgun, mailOption)
    .then(console.log)
    .catch(console.error)
}

const adminRegister = (messagingProvider, messageFormatter, config) => async (email, { userId, requestSource }) => {
  console.log('register', email)
  const aes = AESCrypto(config.encryptionKey)
  const formatter = messageFormatter(requestSource)
  const messagingClient = messagingProvider.get(requestSource)
  const role = 'admin'
  const source = requestSource
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

const producerRegistrationConfirm = async (aes, registerationInfo, messagingProvider, messageFormatter) => {
  const formatter = messageFormatter(registerationInfo.source)
  const messagingClient = messagingProvider.get(registerationInfo.source)

  let message = `Thanks for confirming your email, we will let you know when done: ${registerationInfo.role}`
  await messagingClient.sendMessage(registerationInfo.userId, message)
  registerationInfo.confirmed = true

  const encoded = aes.encrypt(Buffer.from(JSON.stringify(registerationInfo)))
  const approvalUrl = `https://bots.catcat.io/unicorn/fulfillment/approveRegistration?token=${encoded.toString('hex')}`

  console.log('approvalUrl', approvalUrl)
  // NC:TODO: post message to admin group
}

const adminRegistrationConfirm =  async (registerationInfo, messagingProvider, messageFormatter) => {
  const formatter = messageFormatter(registerationInfo.source)
  const messagingClient = messagingProvider.get(registerationInfo.source)

  let message = `Hi ${registerationInfo.email}, welcome to ${registerationInfo.role} mode`
  await messagingClient.sendMessage(registerationInfo.userId, message)
}

const registerConfirmation = (messagingProvider, messageFormatter, config) => async (params) => {
  const aes = AESCrypto(config.encryptionKey)
  const decoded = aes.decrypt(Buffer.from(params.token, 'hex'))
  const registerationInfo = JSON.parse(decoded.toString())

  switch(registerationInfo.role) {
    case 'producer':
      return producerRegistrationConfirm(aes, registerationInfo, messagingProvider, messageFormatter)
    case 'admin':
      return adminRegistrationConfirm(registerationInfo, messagingProvider, messageFormatter)
  }
}

const approveProducerRegistration = (registerationInfo, messagingProvider, messageFormatter) => {
  const formatter = messageFormatter(registerationInfo.source)
  const messagingClient = messagingProvider.get(registerationInfo.source)

  let message = `Hi ${registerationInfo.email}, welcome to ${registerationInfo.role} mode`
  messagingClient.sendMessage(registerationInfo.userId, message)
}

const approveRegistration = (messagingProvider, messageFormatter, config) => async (params) => {
  const aes = AESCrypto(config.encryptionKey)
  const decoded = aes.decrypt(Buffer.from(params.token, 'hex'))
  const registerationInfo = JSON.parse(decoded.toString())

  if (!registerationInfo.confirmed) {
    throw new Error('EMAIL_NOT_CONFIRMED')
  }

  switch(registerationInfo.role) {
    case 'producer':
      return approveProducerRegistration(registerationInfo, messagingProvider, messageFormatter)
  }

  // NC:TODO: handle no support
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