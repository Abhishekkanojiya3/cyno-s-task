const express = require('express');
const medicationController = require('../controllers/medicationController');

const router = express.Router();

router.get('/medications', medicationController.getAllMedications);

router.get('/running-medications', medicationController.getRunningMedications);

router.post('/add-medication', medicationController.addMedication);

router.put('/stop-medication/:medicationId', medicationController.stopMedication);

module.exports = router;