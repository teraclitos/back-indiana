const { body } = require('express-validator')

const photosFields = ['artistName', 'scientificName', 'description']

const validateEmptyFields = () => {
  return photosFields.map((field) => body(field).trim().notEmpty().withMessage(`field ${field} empty`))
}
const validateLengthFields = () => {
  return photosFields.map((field) => {
    if (field !== 'description') {
      return body(field).trim().isLength({ min: 5, max: 40 }).withMessage(`the field ${field} must have from 5 to 20 characters`)
    } else {
      return body(field).trim().isLength({ min: 8, max: 1000 }).withMessage(`the field ${field} must have at least 8 characters`)
    }
  })
}
const validateItems = () => {
  return [
    (req, res, next) => {
      const parsedData = JSON.parse(req.body.items)

      req.body.items = parsedData

      next()
    },
    body('items').isArray({ min: 1 }).withMessage('The items field must be an array with a length of at least 1'),
    body('items.*').isObject().withMessage('The items field must be an array of objects'),
    body('items.*.size').exists().withMessage('there is no size'),
    body('items.*.size').isObject().withMessage('size must be an Object'),
    body('items.*.price').exists().withMessage('there is no price'),
    body('items.*.price').isNumeric().withMessage('price must be a number'),
    body('items.*.size.width').exists().withMessage('there is no width'),
    body('items.*.size.height').exists().withMessage('there is no heigh'),
    body('items.**.width').isNumeric().withMessage('width must be a number'),
    body('items.**.height').isNumeric().withMessage('height must be a number')]
}

module.exports = { validateEmptyFields, validateLengthFields, validateItems }
