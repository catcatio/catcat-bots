module.exports = {
  port: parseInt(process.env.PORT) || 3000,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  accessToken: process.env.GOOGLE_CLOUD_ACCESSTOKEN,
  isProduction: process.env.NODE_ENV === 'production',
}