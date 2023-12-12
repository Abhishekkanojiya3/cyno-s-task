const express = require('express');
const profileController = require('../controllers/profileController');

const router = express.Router();

router.get('/user-profile', profileController.getUserProfile);

router.post('/add-treatment', profileController.addTreatment);

router.put('/update-treatment/:treatmentId', profileController.updateTreatment);

router.delete('/delete-treatment/:treatmentId', profileController.deleteTreatment);

module.exports = router;