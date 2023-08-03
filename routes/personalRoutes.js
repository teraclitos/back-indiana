const router = require('express').Router()
const tokenValidation = require('../middlewars/auth')
const { createPersonalInformation, getPersonalInformation, updatePersonalInformation } = require('../controllers/personalControllers')
const { uploadFile } = require('../middlewars/multer')
router.post('/create', tokenValidation(process.env.SUPER_USER), uploadFile().uploadOneImage, createPersonalInformation)
router.get('/getpersonalinformation', getPersonalInformation)
router.put('/updatepersonalinformation/:id', tokenValidation(process.env.SUPER_USER), uploadFile().uploadOneImage, updatePersonalInformation)
module.exports = router
