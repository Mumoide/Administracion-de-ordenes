const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashoardController');
const verifyRoute = require("../middlewares/verificadorToken")


router.get('/dashboard', verifyRoute([1, 2]), dashboardController.getDashboardData);

module.exports = router;