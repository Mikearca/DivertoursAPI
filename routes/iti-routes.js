const express = require('express');
const router = express.Router();
const iticontroller = require('../contollers/iti-controller');

router.get('/itis', iticontroller.getAllIti);
router.post('/iti', iticontroller.createIti);
router.delete('/deliti/:id', iticontroller.deleteIti);
router.get('/getiti/:id', iticontroller.getItiById);
router.delete('/clear', iticontroller.clearAllItineraries);
router.post('/enroll/:id', iticontroller.enrollUserToItinerary);

module.exports = router;

