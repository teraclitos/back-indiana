const { createUser } = require('../controllers/userControllers')
const router = require('express').Router()
router.post('/createuser', createUser)
module.exports = router
