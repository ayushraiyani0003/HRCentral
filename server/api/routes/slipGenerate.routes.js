// routes/slipGenerate.routes.js
const express = require('express');
const router = express.Router();
const slipGenerateController = require('../controllers/slipGenerate.controller');

router.post('/upload', slipGenerateController.uploadAndGenerateSlips);  // SSE for progress updates // in this receive the excel file and generate the slips and send the progress as a stream

// SSE routes for real-time updates
router.get('/stream-slip-progress', slipGenerateController.streamSlipProgress);  // SSE for progress updates // in this receive the excel file and generate the slips and send the progress as a stream


module.exports = router;
