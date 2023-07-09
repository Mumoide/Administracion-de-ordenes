const express = require('express');
const router = express.Router();
const OrdenesController = require('../controllers/ordenesController');
const validateCreateOrdenes = require('../middlewares/validators/validateCreateOrdenes');
const validateEditOrdenes = require('../middlewares/validators/validateEditOrdenes');
const verifyRoute = require("../middlewares/verificadorToken")



router.get('/ordenes', verifyRoute([1, 2]), OrdenesController.getAll);
router.get('/ordenes/:id', verifyRoute([1, 2]), OrdenesController.getById);
router.post('/ordenes', verifyRoute([1]), validateCreateOrdenes(), OrdenesController.create);
router.put('/ordenes/:id', verifyRoute([1]), validateEditOrdenes(), OrdenesController.update);
router.delete('/ordenes/:id', verifyRoute([1]), OrdenesController.deleteOrden);
router.put('/assignUser/:fileNumber/:rut', verifyRoute([1]), OrdenesController.assignUser);


module.exports = router;
