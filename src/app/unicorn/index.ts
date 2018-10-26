import { Client } from "@line/bot-sdk";
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
  const encoded = aes.encrypt(Buffer.from(JSON.stringify({ userId, email, role })))

  const profile = await messagingClient.getProfile(userId)

  let message = `Hi ${profile.displayName}, please confirm registration in your email`
  messagingClient.sendMessage(userId, message)

  const confirmationUrl = `https://bots.catcat.io/unicorn/fulfillment/registerConfirmation?token=${encoded.toString('hex')}`
  console.log(confirmationUrl)

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
  const encoded = aes.encrypt(Buffer.from(JSON.stringify({ userId, email, role })))

  let message = `Hi ${email}, please confirm registration in your email`
  messagingClient.sendMessage(userId, message)

  const confirmationUrl = `https://bots.catcat.io/unicorn/fulfillment/registerConfirmation?token=${encoded.toString('hex')}`
  console.log(confirmationUrl)

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

const producerEmailConfirm = (messagingProvider, messageFormatter, config) => async (params) => {
  const aes = AESCrypto(config.encryptionKey)
  const decoded = aes.decrypt(Buffer.from(params.token, 'hex'))
  const registerationInfo = JSON.parse(decoded.toString())

  const formatter = messageFormatter(registerationInfo.source)
  const messagingClient = messagingProvider.get(registerationInfo.source)

  let message = `Hi ${registerationInfo.email}, welcome to ${registerationInfo.role} mode`
  messagingClient.sendMessage(registerationInfo.userId, message)

  // NC:TODO: post message to admin group
}

const adminEmailConfirm = (messagingProvider, messageFormatter, config) => async (params) => {
  const aes = AESCrypto(config.encryptionKey)
  const decoded = aes.decrypt(Buffer.from(params.token, 'hex'))
  const registerationInfo = JSON.parse(decoded.toString())

  const formatter = messageFormatter(registerationInfo.source)
  const messagingClient = messagingProvider.get(registerationInfo.source)

  let message = `Hi ${registerationInfo.email}, welcome to ${registerationInfo.role} mode`
  messagingClient.sendMessage(registerationInfo.userId, message)
}

const adminApproveProducerRegistration = (config) => async (params) => {

}

export default (config) => {
  const messageFormatter = MessageFormatter(config)
  const messagingProvider = MessagingProvider(config)
  return {
    producerRegister: producerRegister(messagingProvider, messageFormatter, config),
    adminRegister: adminRegister(messagingProvider, messageFormatter, config),
    producerEmailConfirm: producerEmailConfirm(messagingProvider, messageFormatter, config),
    adminEmailConfirm: adminEmailConfirm(messagingProvider, messageFormatter, config),
    database: Database(config),
    config: config
  }
}