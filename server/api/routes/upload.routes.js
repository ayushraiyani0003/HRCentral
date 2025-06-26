/**
 * UploadRoutes - Express router for handling file uploads.
 * Currently supports uploading salary slip ZIP files for processing.
 */

const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload.controller");
const { uploadMiddleware } = require("../../utils/upload.util");

/**
 * @route POST /api/uploads/salary-slips
 * @desc Upload a ZIP file containing salary slips for processing
 * @access Public
 * @param {File} req.file - Uploaded file under the field name `zipFile`
 * @returns {Object} 200 - Upload success response
 * @returns {Object} 400 - Invalid file type, missing file, or validation error
 * @returns {Object} 500 - Internal server error during upload or processing
 * @example
 * // Upload via FormData with field 'zipFile'
 *
 * // Response:
 * {
 *   "success": true,
 *   "message": "Salary slips uploaded successfully",
 *   "fileInfo": {
 *     "originalName": "slips.zip",
 *     "size": "134KB"
 *   }
 * }
 */
router.post(
    "/salary-slips",
    uploadMiddleware.single("zipFile"),
    uploadController.handleSalarySlipUpload
);

module.exports = router;
