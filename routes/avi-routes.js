const express = require('express');
const router = express.Router();
const aviController = require('../contollers/avi-controller');

router.get('/avisos', aviController.getAllAvisos);
router.post('/avisos', aviController.createAviso);
router.get('/avisos/:id', aviController.getAvisoById);
router.put('/avisos/:id', aviController.updateAvisoById);
router.delete('/avisos/:id', aviController.deleteAvisoById);

module.exports = router;
