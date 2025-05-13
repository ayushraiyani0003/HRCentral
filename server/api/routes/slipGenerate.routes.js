// routes/slipGenerate.routes.js
const express = require('express');
const router = express.Router();
const slipGenerateController = require('../controllers/slipGenerate.controller');

router.post('/upload', slipGenerateController.uploadAndGenerateSlips);
router.get('/stream-slip-progress', slipGenerateController.streamSlipProgress);

router.get('/download', slipGenerateController.downloadZip);
module.exports = router;