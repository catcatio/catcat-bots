const { Client } = require('@line/bot-sdk')
import lineMessageFormatter from '../unicorn/fulfillmentHandler/messageFormatter/lineMessageFormatter'
import AESCrypto from '../utils/AESCrypto';

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
    <p style="margin: 2px;">🦄 Thanks for registering <b>Unicorn</b> 🦄</p>
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
  mailgun.messages().send(mailOption, (error, body) => {
    console.log(JSON.stringify(error || body))
    if (error) {
      reject(error)
    } else {
      resolve(body)
    }
  })
})

const register = (config) => async (email, { userId }) => {
  console.log('register', email)
  const aes = AESCrypto(config.encryptionKey)
  const messageFormatter = lineMessageFormatter(config)
  const lineClient = new Client(config.line)
  const encoded = aes.encrypt(Buffer.from(JSON.stringify({ userId, email })))

  let message = messageFormatter.messageTemplate(`Hi ${email}, please confirm registration in your email`)
  lineClient.pushMessage(userId, message)

  const confirmationUrl = `https://bots.catcat.io/unicorn/fulfillment/registerConfirmation?token=${encoded.toString('hex')}`

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

const registerConfirm = (config) => async (params) => {
  const aes = AESCrypto(config.encryptionKey)
  const messageFormatter = lineMessageFormatter(config)
  const lineClient = new Client(config.line)
  const decoded = aes.decrypt(Buffer.from(params.token, 'hex'))
  const registerationInfo = JSON.parse(decoded.toString())
  let message = messageFormatter.messageTemplate(`Hi ${registerationInfo.email}, welcome to producer mode`)
  lineClient.pushMessage(registerationInfo.userId, message)
}

export default (config) => {
  return {
    register: register(config),
    registerConfirm: registerConfirm(config),
  }
}