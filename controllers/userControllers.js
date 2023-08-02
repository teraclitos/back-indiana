const UserModel = require('../models/userSchema')

exports.createUser = async (req, res) => {
  const {
    username,
    password

  } = req.body

  try {
    const newUser = new UserModel({
      username,
      password

    })
    await newUser.save()
    res.status(201).json({ error: null, msg: 'User created correctly' })
  } catch (error) {
    res.status(500).json({ error: true, msg: error.message })
  }
}
