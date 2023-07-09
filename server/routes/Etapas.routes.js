const express = require('express');
const EtapasController = require('../controllers/etapaController');
const validateEtapas = require('../middlewares/validators/validateEtapas');
const validateEtapasLabo = require('../middlewares/validators/validateEtapasLabo');
const verifyToken = require('../middlewares/verificadorToken');

const router = express.Router();

router.get('/etapas/:id', verifyToken([1, 2]), EtapasController.getAllEtapas);
router.get('/etapa/:id', verifyToken([1, 2]), EtapasController.getById);
router.post('/etapas/:id/:number', verifyToken([1]), validateEtapas(), EtapasController.createEtapa);
router.put('/etapa/:id', verifyToken([1, 2]), validateEtapas(), EtapasController.updateEtapa);
router.put('/etapaLabo/:id', verifyToken([1, 2]), validateEtapasLabo(), EtapasController.updateEtapaLabo);
router.delete('/etapa/:id', verifyToken([1]), EtapasController.deleteEtapa);

module.exports = router;
