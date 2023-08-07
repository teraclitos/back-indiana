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
    body('pricesSizes').isArray({ min: 1 }).withMessage('The pricesSizes field must be an array with a length of at least 1'),
    body('pricesSizes.*').isObject().withMessage('The priceSizes field must be an array of objects'),
    body('pricesSizes.**.number').isNumeric().withMessage('Number must be a number'),
    body('pricesSizes.**.size').isNumeric().withMessage('size must be a number')]
}

module.exports = { validateEmptyFields, validateLengthFields, validatePricesSizesField }
