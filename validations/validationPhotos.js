const { body } = require('express-validator')

const photosFields = ['artistName', 'scientificName', 'description']

const validateEmptyFields = () => {
  return photosFields.map((field) => body(field).trim().notEmpty().withMessage(`field ${field} empty`))
}
const validateLengthFields = () => {
  return photosFields.map((field) => {
    if (field !== 'description') {
      return body(field).trim().isLength({ min: 5, max: 20 }).withMessage(`the field ${field} must have from 5 to 20 characters`)
    } else {
      return body(field).trim().isLength({ min: 8 }).withMessage(`the field ${field} must have at least 8 characters`)
    }
  })
}
const validatePricesSizesField = () => {
  return [
    (req, res, next) => {
      const parsedData = JSON.parse(req.body.pricesSizes)

      req.body.pricesSizes = parsedData

      next()
    },
    body('pricesSizes').isArray({ min: 1 }).withMessage('The pricesSizes field must be an array with a length of at least 1'),
    body('pricesSizes.*').isObject().withMessage('The priceSizes field must be an array of objects'),
    body('pricesSizes.*.size').exists().withMessage('there is no size'),
    body('pricesSizes.*.size').isObject().withMessage('size must be an Object'),
    body('pricesSizes.*.price').exists().withMessage('there is no price'),
    body('pricesSizes.*.price').isNumeric().withMessage('price must be a number'),
    body('pricesSizes.*.size.width').exists().withMessage('there is no width'),
    body('pricesSizes.*.size.height').exists().withMessage('there is no heigh'),
    body('pricesSizes.**.width').isNumeric().withMessage('width must be a number'),
    body('pricesSizes.**.height').isNumeric().withMessage('height must be a number')]
}

module.exports = { validateEmptyFields, validateLengthFields, validatePricesSizesField }
