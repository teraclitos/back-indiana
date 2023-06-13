const router = require("express").Router();
const photosControllers = require("../controllers/photosControllers");
router.post("/create", photosControllers.createPhoto);
module.exports = router;
