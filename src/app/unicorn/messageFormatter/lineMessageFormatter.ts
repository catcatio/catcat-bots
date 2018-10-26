import { FlexMessageBuilder, FlexComponentBuilder } from "../../../utils/lineMessageBuilder"
import { FlexImage } from "@line/bot-sdk";

const limitChar = (str, limit) => {
  return `${str.substr(0, limit)}${str.length > limit ? '...' : ''}`
}

const approveRegistrationTemplate = (imageResizeService) => (imageUrl, displayName, role, email, approvalUrl, rejectUrl) => {
  console.log(`${imageResizeService}${encodeURIComponent(imageUrl)}`)

  const lineTemplate = new FlexMessageBuilder()
  const template = lineTemplate.flexMessage(`Approve registration ${displayName}`)
    .addBubble()
    .addHeader()
      .setLayout('vertical')
      .addComponents(
        FlexComponentBuilder.flexText()
        .setText('Registration Approval')
        .setWeight('bold')
        .setGarvity('center')
        .build()
      )
    .addHero(FlexComponentBuilder.flexImage()
      .setUrl(`${imageResizeService}${encodeURIComponent(imageUrl)}&size=240&seed=${Date.now()}`)
      .setSize('3xl')
      .setAspectRatio('1:1')
      .setAspectMode('cover')
      .build() as FlexImage)
    .addBody()
    .setSpacing('md')
    .addComponents(
      FlexComponentBuilder.flexText()
        .setText(`${displayName}`)
        .setWrap(true)
        .setWeight('bold')
        .setGarvity('center')
        .setSize('md')
        .build(),
      FlexComponentBuilder.flexText()
        .setText(`${email}`)
        .setWrap(true)
        .setGarvity('center')
        .setSize('md')
        .build(),
      FlexComponentBuilder.flexText()
        .setText(role)
        .setWrap(true)
        .setGarvity('center')
        .setSize('md')
        .build(),
      FlexComponentBuilder.flexButton()
        .setStyle('primary')
        .setColor('#718792')
        .setAction({
          'type': 'uri',
          'uri': approvalUrl,
          'label': 'Approve'
        })
        .build(),
      FlexComponentBuilder.flexButton()
        .setStyle('primary')
        .setColor('#718792')
        .setAction({
          'type': 'uri',
          'uri': rejectUrl,
          'label': 'Reject'
        })
        .build()
    )
  console.log(JSON.stringify(template.build()))
  return template.build()
}

const messageTemplate = (message) => {
  var messages = []
  if (typeof message === 'string') {
    messages = [{
      text: message,
      type: 'text'
    }]
  } else if (Array.isArray(message)) {
    message.forEach(msg => {
      if (typeof msg === 'string') {
        let singleMessage = {
          text: msg,
          type: 'text'
        }
        messages.push(singleMessage)
      } else {
        messages.push(msg)
      }
    })
  } else {
    if (!message) throw new Error('You LINE message is empty')
    if (!message.type) throw new Error('Your LINE message is required to have a type')

    // object type message
    messages = [message]
  }

  return messages
}

const quickReply = (message, ...options) => {
  const msg = {
    'type': 'text',
    'text': message,
    'quickReply': {
      'items': options.map(op => (typeof op !== 'string' ? op : {
        'type': 'action',
        'action': {
          'type': 'message',
          'label': op,
          'text': op
        }
      }))
    }
  }

  console.log(msg)
  return msg
}

export default ({ imageResizeService }) => ({
  approveRegistrationTemplate: approveRegistrationTemplate(imageResizeService),
  messageTemplate,
  quickReply,
  name: 'line'
})
