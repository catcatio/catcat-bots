export default (unicorn) => {
  return async (req, res) => {
    unicorn.registerConfirm(req.query)
    res.redirect('https://catcat.io')
  }
}