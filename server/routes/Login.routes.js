const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/LoginController');
const verifyToken = require('../middlewares/verificadorToken');

const validarPassword = require("../middlewares/validators/validatePassword")
router.post('/login',
    validarPassword(),
    LoginController.login);
router.get('/logout', LoginController.logout);
router.post('/forgotPassword', LoginController.forgotPassword);
router.post('/resetPassword/', LoginController.resetPassword);


module.exports = router;