// routes/whatsapp.routes.js
const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsapp.controller');

// WhatsApp connections routes
router.get('/generate-qr', whatsappController.generateQRCode);
router.get('/status', whatsappController.getStatus);
router.get('/check-status', whatsappController.getStatus);
router.post('/disconnect', whatsappController.disconnectSession);

// PDF sending routes
router.post('/send-pdfs', whatsappController.startSendingPDFs);
router.post('/pause', whatsappController.pauseSending);
router.post('/resume', whatsappController.resumeSending);
router.post('/retry-failed', whatsappController.retryFailed);
router.get('/progress', whatsappController.getProgress);

module.exports = router;