const router = require('express').Router()
const tokenValidation = require('../middlewars/auth')
const { validateEmptyFields, validateLengthFields, validatePricesSizesField } = require('../validations/validationPhotos')
const { createPhoto, getAllPhotos, getOnePhoto, deleteOnePhoto, updatePhoto } = require('../controllers/photosControllers')
const { uploadFile } = require('../middlewars/multer')
router.post(
  '/create',
  tokenValidation(process.env.SUPER_USER),
  uploadFile().uploadArrayOfImages,
  [
    ...validateEmptyFields(),
    ...validateLengthFields(),
    ...validatePricesSizesField()
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
  [
    ...validateEmptyFields(),
    ...validateLengthFields(),
    ...validatePricesSizesField()
  ],
  updatePhoto)
router.delete(
  '/deleteonephoto/:id',
  tokenValidation(process.env.SUPER_USER),
  deleteOnePhoto)
module.exports = router
