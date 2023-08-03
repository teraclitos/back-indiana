const UserModel = require('../models/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.createUser = async (req, res) => {
  const {
    username,
    password

  } = req.body

  const salt = await bcrypt.genSalt()
  const hash = await bcrypt.hash(password, salt)

  try {
    const newUser = new UserModel({
      username,
      password: hash

    })
    await newUser.save()
    res.status(201).json({ error: null, msg: 'User created correctly' })
  } catch (error) {
    res.status(500).json({ error: true, msg: error.message })
  }
}

exports.loginUser = async (req, res) => {
  const { username, password } = req.body

  const findUser = await UserModel.findOne({ username })
  const passwordOk = findUser && await bcrypt.compare(password, findUser.password)

  const validUserPassword = !((!findUser || !passwordOk))

  if (!validUserPassword) {
    return res.status(401).json({ error: true, msg: 'user or password incorrect' })
  }
  const token = jwt.sign({ id: findUser._id, role: findUser.role }, process.env.JWT_SECRET,
    { expiresIn: '1d' })

  findUser.token = token

  try {
    const loadToken = await UserModel.findOneAndUpdate({ username: findUser.username }, findUser)
    return loadToken && res.status(200).json({ error: null, msg: 'user logged' })
  } catch (error) {
    return res.status(500).json({ error: true, msg: error.message })
  }
}

exports.logoutUser = async (req, res) => {
  try {
    const userId = res.locals.id
    const findUserAndUpdate = await UserModel.findByIdAndUpdate({ _id: userId }, { $set: { token: '' } }, { new: true })
    if (!findUserAndUpdate) { return res.status(404).json({ error: true, msg: 'user not found' }) }
    return res.status(200).json({ error: null, msg: 'user logout' })
  } catch (error) { return res.status(500).json({ error: true, msg: error.message }) }
}
