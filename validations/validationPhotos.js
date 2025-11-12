const { body } = require('express-validator')

const photoBodyValidators = [
  body('marca').isString().trim().notEmpty(),
  body('modelo').isString().trim().notEmpty(),
  body('version').isString().trim().notEmpty(),
  body('precio').isNumeric(),
  body('caja').isString().trim().notEmpty(),
  body('segmento').isString().trim().notEmpty(),
  body('cilindrada').isNumeric(),
  body('color').isString().trim().notEmpty(),
  body('anio').isInt({ min: 1900, max: new Date().getFullYear() + 1 }),
  body('combustible').isString().trim().notEmpty(),
  body('transmision').isString().trim().notEmpty(),
  body('kilometraje').isInt({ min: 0 }),
  body('traccion').isString().trim().notEmpty(),
  body('tapizado').isString().trim().notEmpty(),
  body('categoriaVehiculo').isString().trim().notEmpty(),
  body('frenos').isString().trim().notEmpty(),
  body('turbo').isString().trim().notEmpty(),
  body('llantas').isString().trim().notEmpty(),
  body('HP').isString().trim().notEmpty()
]
module.exports = { photoBodyValidators }
