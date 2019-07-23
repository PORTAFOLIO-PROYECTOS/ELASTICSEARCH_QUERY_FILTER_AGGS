"use strict";

const express = require('express');
const router = express.Router();
const controller = require('../controllers/sql');

router.get('/', controller.obtener)

module.exports = router;