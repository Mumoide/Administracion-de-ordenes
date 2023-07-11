const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const verifyRoute = require("../middlewares/verificadorToken")


router.get('/exportOrders', verifyRoute([1]), exportController.exportOrders);
router.get('/exportStages/:id', verifyRoute([1]), exportController.exportStages);
router.get('/exportUsers', verifyRoute([1]), exportController.exportUsers);
router.get('/exportRelatedUsers', verifyRoute([1]), exportController.exportRelatedUsers);
module.exports = router;
