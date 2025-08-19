const router = require('express').Router()
const tokenValidation = require('../middlewars/auth')
// const { validateEmptyFields, validateLengthFields, validateItems } = require('../validations/validationPhotos')
const { createPhoto, getAllPhotos, getOnePhoto, deletePhoto, updatePhoto } = require('../controllers/photosControllers')
const { uploadFile, handleMulterErrors } = require('../middlewars/multer')

router.post(
  '/create',
  // tokenValidation(process.env.SUPER_USER),

  uploadFile().uploadCarPhotos,
  handleMulterErrors,
  [
    // ...validateEmptyFields()
    // ...validateLengthFields()
    // ...validateItems()
  ],
  createPhoto)
router.get(
  '/getallphotos',
  getAllPhotos)
router.get(
  '/getonephoto/:id',
  getOnePhoto)
router.put(
  '/updatephoto/:id',

  tokenValidation(process.env.SUPER_USER),
  uploadFile().uploadArrayOfImages,
  handleMulterErrors,
  // [
  //   ...validateEmptyFields(),
  //   ...validateLengthFields(),
  //   ...validateItems()
  // ],
  updatePhoto)
router.delete(
  '/deletephoto/:id',
  tokenValidation(process.env.SUPER_USER),
  deletePhoto)
module.exports = router
