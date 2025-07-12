/**
 * WhatsAppRoutes - Express router for managing WhatsApp sessions and sending PDFs.
 * Includes QR generation, session management, real-time status updates via SSE, and bulk PDF sending features.
 */

const express = require("express");
const router = express.Router();
const whatsappController = require("../controllers/whatsapp.controller");

/**
 * @route GET /api/whatsapp/generate-qr
 * @desc Generate and return a WhatsApp QR code for authentication
 * @access Public
 * @returns {Object} 200 - QR code image or base64 string
 * @returns {Object} 500 - Internal server error
 */
router.get("/generate-qr", whatsappController.generateQRCode);

/**
 * @route GET /api/whatsapp/status
 * @desc Get current WhatsApp connection status
 * @access Public
 * @returns {Object} 200 - Status info (connected, disconnected, etc.)
 * @returns {Object} 500 - Internal server error
 */
router.get("/status", whatsappController.getStatus);

/**
 * @route GET /api/whatsapp/check-status
 * @desc Get WhatsApp connection status (legacy endpoint for backward compatibility)
 * @access Public
 * @returns {Object} 200 - Same as /status
 */
router.get("/check-status", whatsappController.getStatus);

/**
 * @route GET /api/whatsapp/stream-status
 * @desc Stream real-time WhatsApp connection status via Server-Sent Events (SSE)
 * @access Public
 * @returns {SSE} 200 - Continuous stream of status updates
 */
router.get("/stream-status", whatsappController.streamStatus);

/**
 * @route GET /api/whatsapp/stream-progress
 * @desc Stream real-time progress of PDF sending via SSE
 * @access Public
 * @returns {SSE} 200 - Continuous stream of progress updates
 */
router.get("/stream-progress", whatsappController.streamProgress);

/**
 * @route POST /api/whatsapp/disconnect
 * @desc Disconnect the active WhatsApp session
 * @access Public
 * @returns {Object} 200 - Success message
 * @returns {Object} 500 - Error during disconnection
 */
router.post("/disconnect", whatsappController.disconnectSession);

/**
 * @route POST /api/whatsapp/send-pdfs
 * @desc Start sending PDFs to contacts via WhatsApp
 * @access Public
 * @param {Object} req.body - Payload containing file references and contact info
 * @returns {Object} 200 - Job started confirmation
 * @returns {Object} 400 - Bad request or validation error
 * @returns {Object} 500 - Internal server error
 */
router.post("/send-pdfs", whatsappController.startSendingPDFs);

/**
 * @route POST /api/whatsapp/pause
 * @desc Pause the ongoing PDF sending process
 * @access Public
 * @returns {Object} 200 - Pause confirmation
 * @returns {Object} 500 - Internal server error
 */
router.post("/pause", whatsappController.pauseSending);

/**
 * @route POST /api/whatsapp/resume
 * @desc Resume the paused PDF sending process
 * @access Public
 * @returns {Object} 200 - Resume confirmation
 * @returns {Object} 500 - Internal server error
 */
router.post("/resume", whatsappController.resumeSending);

/**
 * @route POST /api/whatsapp/retry-failed
 * @desc Retry sending PDFs that previously failed
 * @access Public
 * @returns {Object} 200 - Retry job started
 * @returns {Object} 500 - Internal server error
 */
router.post("/retry-failed", whatsappController.retryFailed);

/**
 * @route GET /api/whatsapp/progress
 * @desc Get the current progress of the PDF sending process
 * @access Public
 * @returns {Object} 200 - Progress details (e.g., total, sent, failed)
 * @returns {Object} 500 - Internal server error
 */
router.get("/progress", whatsappController.getProgress);

module.exports = router;
