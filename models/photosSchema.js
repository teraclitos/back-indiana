const mongoose = require('mongoose')
const mongoosePagination = require('mongoose-paginate-v2')

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  original_name: { type: String, required: true },
  public_id: { type: String, required: true },
  highlighted: { type: Boolean, default: false }
}, { _id: false })

const PhotosSchema = new mongoose.Schema({
  fotoFrontal: { type: ImageSchema, required: true },
  fotoTrasera: { type: ImageSchema, required: true },
  fotoLateralIzquierda: { type: ImageSchema, required: true },
  fotoLateralDerecha: { type: ImageSchema, required: true },
  fotoInterior: { type: ImageSchema, required: true },
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  version: { type: String, required: true },
  precio: { type: Number, required: true },
  caja: { type: String, required: true },
  segmento: { type: String, required: true },
  cilindrada: { type: Number, required: true },
  color: { type: String, required: true },
  anio: { type: Number, required: true },
  combustible: { type: String, required: true },
  transmision: { type: String, required: true },
  kilometraje: { type: Number, required: true },
  traccion: { type: String, required: true },
  tapizado: { type: String, required: true },
  categoriaVehiculo: { type: String, required: true },
  frenos: { type: String, required: true },
  turbo: { type: String, required: true },
  llantas: { type: String, required: true },
  HP: { type: String, required: true },
  detalle: { type: String, required: true },
  highlighted: { type: String, default: 'fotoFrontal' }
}, {
  timestamps: true
})

PhotosSchema.plugin(mongoosePagination)

const PhotosModel = mongoose.model('photos', PhotosSchema)

module.exports = PhotosModel
