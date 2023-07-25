const router = require('express').Router()
const { createPhoto, getAllPhotos, getOnePhoto } = require('../controllers/photosControllers')
const { uploadFile } = require('../middlewars/multer')
router.post('/create', uploadFile(), createPhoto)
router.get('/getallphotos', getAllPhotos)
router.get('/getonephoto/:id', getOnePhoto)
module.exports = router
