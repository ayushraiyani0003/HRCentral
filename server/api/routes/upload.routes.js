// routes/upload.routes.js
const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const { uploadMiddleware } = require('../../utils/upload.util');

// Upload routes
router.post('/salary-slips', uploadMiddleware.single('zipFile'), uploadController.handleSalarySlipUpload);

module.exports = router;