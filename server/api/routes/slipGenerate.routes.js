/**
 * SlipGenerateRoutes - Express router for generating and downloading salary slips.
 * Handles file upload, progress streaming, and zip download of generated slips.
 */

const express = require("express");
const router = express.Router();
const slipGenerateController = require("../controllers/slipGenerate.controller");

/**
 * @route POST /api/slips/upload
 * @desc Upload input data (e.g., Excel or CSV) and generate salary slips
 * @access Public
 * @param {Object} req.files - Uploaded file(s) containing employee salary data
 * @returns {Object} 200 - Success message with job tracking info
 * @returns {Object} 400 - Validation or file format error
 * @returns {Object} 500 - Internal server error
 * @example
 * // Upload FormData with a file
 * // Response:
 * {
 *   "success": true,
 *   "message": "Slips generation started",
 *   "jobId": "abc123"
 * }
 */
router.post("/upload", slipGenerateController.uploadAndGenerateSlips);

/**
 * @route GET /api/slips/stream-slip-progress
 * @desc Stream real-time progress of slip generation (e.g., via SSE or polling)
 * @access Public
 * @param {string} req.query.jobId - Job ID to track progress
 * @returns {Object} 200 - Streaming progress updates or final status
 * @returns {Object} 404 - Job not found or expired
 * @returns {Object} 500 - Internal server error
 * @example
 * // Request: GET /api/slips/stream-slip-progress?jobId=abc123
 * // Response (stream or JSON):
 * {
 *   "success": true,
 *   "progress": 75,
 *   "status": "Generating"
 * }
 */
router.get("/stream-slip-progress", slipGenerateController.streamSlipProgress);

/**
 * @route GET /api/slips/download
 * @desc Download the generated salary slips as a ZIP file
 * @access Public
 * @param {string} req.query.jobId - Job ID associated with the generated slips
 * @returns {File} 200 - ZIP file containing all slips
 * @returns {Object} 404 - ZIP not found or job incomplete
 * @returns {Object} 500 - Internal server error
 * @example
 * // Request: GET /api/slips/download?jobId=abc123
 * // Response: ZIP file download (Content-Disposition: attachment)
 */
router.get("/download", slipGenerateController.downloadZip);

module.exports = router;
