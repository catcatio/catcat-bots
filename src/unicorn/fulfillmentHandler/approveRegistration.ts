export default (unicorn) => {
  return async (req, res) => {
    unicorn.approveRegistration(req.query)
    res.redirect('https://catcat.io')
  }
}