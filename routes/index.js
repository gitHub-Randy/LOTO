var express = require('express');
var router = express.Router();

const indexController = require("../controllers/indexController");

router.get("/", indexController.read);
router.get("/add", indexController.add);
router.post("/", indexController.create);
router.get("/edit", indexController.edit);
router.post("/update", indexController.update);
module.exports = router;
