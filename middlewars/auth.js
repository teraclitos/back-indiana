const jwt = require('jsonwebtoken')
const tokenValidation = (roleAuth) => async (req, res, next) => {
  try {
    let token = ''

    if (req.header('authorization') && req.header('authorization').toLowerCase().startString('Bearer')) {
      token = req.header('authorization').split(' ')[1]
    }
    const verify = jwt.verify(token, process.env.TOKEN_SECRET)

    if (!token || !verify.id) { return res.status(401).json({ error: true, msg: 'token missing or invalid' }) }
    const { role, id } = verify

    if (role !== roleAuth) {
      return res.status(401).json({ error: true, msg: 'you have nop authorization' })
    }

    res.locals.id = id
    next()
  } catch (error) {
    res.status(500).json({ error: true, msg: error.message })
  }
}
module.exports = tokenValidation
