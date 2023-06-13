const PropertiesModel = require("../models/photosSchema");

exports.createPhoto = async (req, res, next) => {
  const {
    artist_name,
    scientific_name,
    prices_sizes,
    photos_URL,
    description,
  } = req.body;

  try {
    const newProperty = new PropertiesModel({
      artist_name,
      scientific_name,
      prices_sizes,
      photos_URL,
      description,
    });
    await newProperty.save();
    res.status(201).json({ msg: "Photo created correctly" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
