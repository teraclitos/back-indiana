const router = require("express").Router();
const photosControllers = require("../controllers/photosControllers");
const uploadFile = require("../middlewars/multer");
router.post("/create", uploadFile(), photosControllers.createPhoto);
module.exports = router;
