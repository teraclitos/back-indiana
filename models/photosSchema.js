const mongoose = require('mongoose')
const mongoosePagination = require('mongoose-paginate-v2')

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  original_name: { type: String, required: true },
  public_id: { type: String, required: true }
}, { _id: false })

const PhotosSchema = new mongoose.Schema({
  fotoPrincipal: { type: ImageSchema, required: true },
  fotoHover: { type: ImageSchema, required: true },
  fotosExtra: [{
    type: ImageSchema
  }],
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  version: { type: String },
  precio: { type: Number, required: true },
  caja: { type: String, required: true },
  segmento: { type: String },
  cilindrada: { type: Number },
  color: { type: String },
  anio: { type: Number, required: true },
  combustible: { type: String },
  transmision: { type: String },
  kilometraje: { type: Number, required: true },
  traccion: { type: String },
  tapizado: { type: String },
  categoriaVehiculo: { type: String },
  frenos: { type: String },
  turbo: { type: String },
  llantas: { type: String },
  HP: { type: String },
  detalle: { type: String }
}, {
  timestamps: true
})

PhotosSchema.plugin(mongoosePagination)

const PhotosModel = mongoose.model('photos', PhotosSchema)

module.exports = PhotosModel
