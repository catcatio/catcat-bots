import { IMessagingClient } from "./messagingClient"
import { Client } from "@line/bot-sdk";

export const lineClient = (lineConfig): IMessagingClient => {
  const client = new Client(lineConfig)

  const sendMessages = (recipientId, ...messages) => {
    return client.pushMessage(recipientId, messages);
  }

  const sendImage = async (recipientId, imageUrl, thumbnailUrl, textMessage = null) => {
    const messages: any[] = [{
      'type': 'image',
      'originalContentUrl': imageUrl,
      'previewImageUrl': thumbnailUrl
    }]

    textMessage && messages.push({
      'type': 'text',
      'text': textMessage
    })

    return sendMessages(recipientId, ...messages).catch(err => console.error(err))
  }

  const sendMessage = (recipientId, ...text) => {
    const messages = text.map(t => ({
      'type': 'text',
      'text': t
    }))

    return sendMessages(recipientId, ...messages).catch(err => console.error(err))
  }

  const sendCustomMessages = (recipientId, ...messages) => {
    return sendMessages(recipientId, ...messages).catch(err => console.error(err))
  }

  const getProfile = (userId) => {
    return client.getProfile(userId)
  }

  return {
    sendImage,
    sendMessage,
    sendCustomMessages,
    getProfile,
    providerName: 'line'
  }
}