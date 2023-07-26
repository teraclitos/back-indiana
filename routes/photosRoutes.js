const router = require('express').Router()
const { createPhoto, getAllPhotos, getOnePhoto, deleteOnePhoto, updatePhoto } = require('../controllers/photosControllers')
const { uploadFile } = require('../middlewars/multer')
router.post('/create', uploadFile(), createPhoto)
router.get('/getallphotos', getAllPhotos)
router.get('/getonephoto/:id', getOnePhoto)
router.put('/updatephoto/:id', uploadFile(), updatePhoto)
router.delete('/deleteonephoto/:id', deleteOnePhoto)
module.exports = router
