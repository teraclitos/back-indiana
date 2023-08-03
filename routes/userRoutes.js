const { createUser, loginUser, logoutUser } = require('../controllers/userControllers')
const tokenValidation = require('../middlewars/auth')
const router = require('express').Router()
router.post('/createuser', createUser)
router.post('/loginuser', loginUser)
router.post('/logoutuser', tokenValidation(process.env.SUPER_USER), logoutUser)
module.exports = router
