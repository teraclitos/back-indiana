const express = require('express')
const router = express.Router()
// const userRoutes = require("./userRoutes");
const photosRoutes = require('./photosRoutes')
const personalRoutes = require('./personalRoutes')

router.use('/photos', photosRoutes)
// router.use("/user", userRoutes);
router.use('/personal', personalRoutes)

module.exports = router
