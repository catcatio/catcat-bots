export default (unicorn) => {
  return async (req, res) => {
    try {
      const result = await unicorn.registerConfirmation(req.query)
      res.send(result)
    } catch(error) {
      console.error(error.message)
      res.status(400).send(typeof error === 'string' ? error : error.message)
    }
  }
}