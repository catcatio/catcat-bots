export default (unicorn) => {
  return async (req, res) => {
    unicorn.registerConfirmation(req.query)
    res.redirect('https://catcat.io')
  }
}