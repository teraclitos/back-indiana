const router = require('express').Router()
const { createPersonalInformation, getPersonalInformation, updatePersonalInformation } = require('../controllers/personalControllers')
const { uploadFile } = require('../middlewars/multer')
router.post('/create', uploadFile().uploadOneImage, createPersonalInformation)
router.get('/getpersonalinformation', getPersonalInformation)
router.put('/updatepersonalinformation/:id', uploadFile().uploadOneImage, updatePersonalInformation)
module.exports = router
