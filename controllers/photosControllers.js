const PhotosModel = require('../models/photosSchema')
const { deleteFilesFromCloudinary } = require('../middlewars/cloudinary')
const { deleteFiles } = require('../services/functionsPhotos')
// const { validationResult } = require('express-validator')
const { newArrayPhotosCloudinaryFunction } = require('../middlewars/cloudinary')

const flattenFiles = (filesObject) => {
  return Object.values(filesObject).flat()
}

// Helpers
const REQUIRED_PHOTOS = [
  'fotoFrontal',
  'fotoTrasera',
  'fotoLateralIzquierda',
  'fotoLateralDerecha',
  'fotoInterior'
]

const extractPublicIdsFromCarDoc = (carDoc) => {
  if (!carDoc) return []
  return REQUIRED_PHOTOS
    .map(k => carDoc[k]?.public_id)
    .filter(Boolean)
}

exports.createPhoto = async (req, res) => {
  // CAMPOS ORIGINALES + NUEVOS (anio, combustible, transmision, kilometraje, traccion, tapizado, categoriaVehiculo, frenos, turbo, llantas, HP, detalle)
  const {
    marca, modelo, version, precio, caja, segmento, cilindrada, color,
    anio, combustible, transmision, kilometraje, traccion, tapizado,
    categoriaVehiculo, frenos, turbo, llantas, HP, detalle
  } = req.body
  const files = req.files || {}
  const missingPhotos = REQUIRED_PHOTOS.filter(field => !files[field] || files[field].length === 0)

  if (missingPhotos.length > 0) {
    deleteFiles(flattenFiles(files))
    return res.status(400).json({
      error: true,
      msg: `Faltan las siguientes fotos: ${missingPhotos.join(', ')}`
    })
  }

  const filesArray = flattenFiles(files)

  // // Si usas express-validator, descomenta:
  // const errorFromExpressValidator = validationResult(req);
  // if (!errorFromExpressValidator.isEmpty()) {
  //   deleteFiles(filesArray);
  //   return res.status(400).json({ error: true, msg: errorFromExpressValidator.array()[0].msg });
  // }

  // Único por marca+modelo+versión (case/accents insensitive)
  const carExists = await PhotosModel.findOne(
    { marca, modelo, version },
    {},
    { collation: { locale: 'es', strength: 1 } }
  )
  if (carExists) {
    deleteFiles(filesArray)
    return res.status(400).json({ error: true, msg: 'Este auto ya está registrado' })
  }

  let cloudinaryResults
  try {
    cloudinaryResults = await newArrayPhotosCloudinaryFunction(filesArray)

    // Mismo mapeo que en create original: usar fieldName para las claves
    const carPhotos = cloudinaryResults.reduce((acc, photo) => {
      const key = photo.fieldName // <-- congruente con create
      acc[key] = {
        url: photo.url,
        public_id: photo.public_id,
        original_name: photo.original_name
      }
      return acc
    }, {})

    const newCar = new PhotosModel({
      ...carPhotos,
      marca,
      modelo,
      version,
      precio,
      caja,
      segmento,
      cilindrada,
      color,
      // NUEVOS
      anio,
      combustible,
      transmision,
      kilometraje,
      traccion,
      tapizado,
      categoriaVehiculo,
      frenos,
      turbo,
      llantas,
      HP,
      detalle
    })

    await newCar.save()
    res.status(201).json({ error: null, msg: 'Auto creado correctamente' })
  } catch (error) {
    if (cloudinaryResults && cloudinaryResults.length) {
      // revierte subidas a Cloudinary si falló la persistencia
      await deleteFilesFromCloudinary(cloudinaryResults.map(p => p.public_id))
    }
    res.status(500).json({ error: true, msg: error.message })
  } finally {
    deleteFiles(filesArray)
  }
}

exports.updatePhoto = async (req, res) => {
  // Debe ser congruente con create: exigir las 5 fotos y el mismo mapeo
  const {
    marca, modelo, version, precio, caja, segmento, cilindrada, color,
    anio, combustible, transmision, kilometraje, traccion, tapizado,
    categoriaVehiculo, frenos, turbo, llantas, HP, detalle
  } = req.body

  const files = req.files || {}
  const filesArray = flattenFiles(files)

  // Requerir las 5 fotos igual que en create
  const missingPhotos = REQUIRED_PHOTOS.filter(field => !files[field] || files[field].length === 0)
  if (missingPhotos.length > 0) {
    deleteFiles(filesArray)
    return res.status(400).json({
      error: true,
      msg: `Faltan las siguientes fotos: ${missingPhotos.join(', ')}`
    })
  }

  // // Si usas express-validator, descomenta:
  // const errorFromExpressValidator = validationResult(req);
  // if (!errorFromExpressValidator.isEmpty()) {
  //   deleteFiles(filesArray);
  //   return res.status(400).json({ error: true, msg: errorFromExpressValidator.array()[0].msg });
  // }

  let oldPhoto = null
  let newUploads = null

  try {
    oldPhoto = await PhotosModel.findById(req.params.id)
    if (!oldPhoto) {
      deleteFiles(filesArray)
      return res.status(404).json({ error: true, msg: 'Auto no encontrado' })
    }

    // Validar unicidad si cambia marca+modelo+versión
    const carExists = await PhotosModel.findOne(
      { marca, modelo, version },
      {},
      { collation: { locale: 'es', strength: 1 } }
    )

    const isSameCar =
      (marca + modelo + version)
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() ===
      (oldPhoto.marca + oldPhoto.modelo + oldPhoto.version)
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

    if (!isSameCar && carExists) {
      deleteFiles(filesArray)
      return res.status(400).json({ error: true, msg: 'Este auto ya está registrado' })
    }

    // Subir nuevas fotos (congruente con create)
    newUploads = await newArrayPhotosCloudinaryFunction(filesArray)

    // Mismo mapeo que create: usar fieldName
    const carPhotos = newUploads.reduce((acc, photo) => {
      const key = photo.fieldName
      acc[key] = {
        url: photo.url,
        public_id: photo.public_id,
        original_name: photo.original_name
      }
      return acc
    }, {})

    // Actualizar documento
    const updated = await PhotosModel.findByIdAndUpdate(
      req.params.id,
      {
        ...carPhotos,
        marca,
        modelo,
        version,
        precio,
        caja,
        segmento,
        cilindrada,
        color,
        // NUEVOS
        anio,
        combustible,
        transmision,
        kilometraje,
        traccion,
        tapizado,
        categoriaVehiculo,
        frenos,
        turbo,
        llantas,
        HP,
        detalle
      },
      { new: true }
    )

    // Borrar fotos antiguas de Cloudinary solo si el update fue OK
    const oldPublicIds = extractPublicIdsFromCarDoc(oldPhoto)
    if (oldPublicIds.length) {
      await deleteFilesFromCloudinary(oldPublicIds)
    }

    res.status(200).json({ error: null, msg: 'Auto actualizado correctamente', updated })
  } catch (error) {
    // Si falló luego de subir nuevas, borra nuevas para no dejar basura
    if (newUploads && newUploads.length) {
      await deleteFilesFromCloudinary(newUploads.map(p => p.public_id))
    }
    res.status(500).json({ error: true, msg: error.message })
  } finally {
    deleteFiles(filesArray)
  }
}

exports.getAllPhotos = async (req, res) => {
  const { cursor, limit } = req.query
  const parsedCursor = parseInt(cursor) || 1
  const parsedLimit = parseInt(limit) || 8
  try {
    const allPhotos = await PhotosModel.paginate({}, { page: parsedCursor, limit: parsedLimit })
    res.status(200).json({ error: null, allPhotos })
  } catch (error) {
    res.status(500).json({ error: true, msg: error.message })
  }
}

exports.getOnePhoto = async (req, res) => {
  try {
    const getOnePhoto = await PhotosModel.findById(req.params.id.trim())
    res.status(200).json({ error: null, getOnePhoto })
  } catch (error) {
    res.status(500).json({ error: true, msg: error.message })
  }
}

exports.deletePhoto = async (req, res) => {
  try {
    const photoDeleted = await PhotosModel.findByIdAndDelete(req.params.id)
    if (!photoDeleted) {
      return res.status(404).json({ error: true, msg: 'Auto no encontrado' })
    }

    // Borrar fotos de Cloudinary del documento eliminado
    const publicIds = extractPublicIdsFromCarDoc(photoDeleted)
    if (publicIds.length) {
      await deleteFilesFromCloudinary(publicIds)
    }

    res.status(200).json({ error: null, msg: 'Auto eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: true, msg: error.message })
  }
}
