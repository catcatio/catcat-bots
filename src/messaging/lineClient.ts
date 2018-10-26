import { IMessagingClient } from "./messagingClient"
import { Client } from "@line/bot-sdk";

export const lineClient = ({ channelAccessToken, channelSecret }): IMessagingClient => {
  const lineClient = new Client({
    channelAccessToken,
    channelSecret
  })

  const sendMessages = (recipientId, ...messages) => {
    return lineClient.pushMessage(recipientId, messages);
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

    return sendMessages(recipientId, ...messages).catch(err => console.log(err))
  }

  const sendMessage = (recipientId, ...text) => {
    const messages = text.map(t => ({
      'type': 'text',
      'text': t
    }))

    return sendMessages(recipientId, ...messages).catch(err => console.log(err))
  }

  const sendCustomMessages = (recipientId, ...messages) => {
    return sendMessages(recipientId, ...messages).catch(err => console.log(err))
  }

  const getProfile = (userId) => {
    return lineClient.getProfile(userId)
  }

  return {
    sendImage,
    sendMessage,
    sendCustomMessages,
    getProfile,
    providerName: 'line'
  }
}