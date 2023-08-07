const { createUser, loginUser, logoutUser } = require('../controllers/userControllers')
const { validateEmptyFields, validateLengthFields } = require('../validations/validationUser')
const tokenValidation = require('../middlewars/auth')
const router = require('express').Router()
router.post(
  '/createuser',
  [
    ...validateEmptyFields(),
    ...validateLengthFields()
  ],
  createUser)
router.post(
  '/loginuser',
  [
    ...validateEmptyFields(),
    ...validateLengthFields()
  ],
  loginUser)
router.post('/logoutuser', tokenValidation(process.env.SUPER_USER), logoutUser)
module.exports = router
