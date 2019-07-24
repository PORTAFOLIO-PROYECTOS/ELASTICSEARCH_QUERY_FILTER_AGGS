const express = require('express');
const router = express.Router();
const controller = require('../controllers/filtros');

router.post('/', controller.obtener);

module.exports = router;