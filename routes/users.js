var express = require('express');
var router = express.Router();
const userController = require("../controllers/userController");

/* GET users listing. */
router.get('/login', userController.loginPage);
router.get('/register', userController.registerPage);

router.post('/login', userController.login);

router.post('/authenticate', userController.authenticate);
router.post('/register', userController.register);
router.get('/',userController.getAll);
router.get('/current', userController.getCurrent);
router.get('/:id', userController.getById);
module.exports = router;
