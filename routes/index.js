var express = require('express');
var router = express.Router();

const indexController = require("../controllers/indexController");

router.get("/", indexController.read);
router.get("/add", indexController.add);
router.post("/", indexController.create);
router.post("/update", indexController.update);
router.get("/export", indexController.export);
router.get("/updateRow/:nr", indexController.editRow);

module.exports = router;
