const { createUser, loginUser } = require('../controllers/userControllers')
const router = require('express').Router()
router.post('/createuser', createUser)
router.post('/loginuser', loginUser)
module.exports = router
