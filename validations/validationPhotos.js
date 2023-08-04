const { body } = require('express-validator')

const photosFields = ['artistName', 'scientificName', 'pricesSizes', 'description']

const validateEmptyFields = () => {
  return photosFields.map((field) => body(field).trim().notEmpty().withMessage(`field ${field} empty`))
}

module.exports = { validateEmptyFields }
