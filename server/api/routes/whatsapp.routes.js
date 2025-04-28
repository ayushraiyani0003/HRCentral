// routes/whatsapp.routes.js
const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsapp.controller');

// WhatsApp connections routes
router.get('/generate-qr', whatsappController.generateQRCode);
router.get('/status', whatsappController.getStatus);  // Keep the regular REST endpoint
router.get('/check-status', whatsappController.getStatus);  // Keep for backward compatibility

// New SSE endpoints for real-time updates
router.get('/stream-status', whatsappController.streamStatus);  // SSE for status updates
router.get('/stream-progress', whatsappController.streamProgress);  // SSE for progress updates

router.post('/disconnect', whatsappController.disconnectSession);

// PDF sending routes
router.post('/send-pdfs', whatsappController.startSendingPDFs);
router.post('/pause', whatsappController.pauseSending);
router.post('/resume', whatsappController.resumeSending);
router.post('/retry-failed', whatsappController.retryFailed);
router.get('/progress', whatsappController.getProgress);  // Keep the regular REST endpoint

module.exports = router;