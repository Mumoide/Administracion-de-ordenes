const express = require('express');
const router = express.Router();
const userRelatedController = require('../controllers/userRelatedController');
const verifyRoute = require("../middlewares/verificadorToken")
const validateRelatedUser = require('../middlewares/validators/validateRelatedUser');
const validarPersonaNoPass = require('../middlewares/validators/validatorPersonaNoPass');

router.get('/relatedUser', verifyRoute([1]), userRelatedController.getAll);
router.get('/relatedUser/:id', verifyRoute([1]), userRelatedController.getById);
router.get('/relatedUserDoctor/:id', verifyRoute([1]), userRelatedController.getDoctorByRut);
router.get('/relatedUserPatient/:id', verifyRoute([1]), userRelatedController.getPatientByRut);
router.post('/relatedUser', validateRelatedUser(), verifyRoute([1]), userRelatedController.create);
router.put('/relatedUser/:id', validateRelatedUser(), verifyRoute([1]), userRelatedController.update);
router.delete('/relatedUser/:id/:rol_id', verifyRoute([1]), userRelatedController.delete);

module.exports = router;
