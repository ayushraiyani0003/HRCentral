/**
 * @fileoverview Upload Controller
 *
 * This module handles file upload operations, specifically for salary slip processing.
 * It manages ZIP file uploads containing Excel files and PDF documents, processes
 * the data, and maps contacts to their corresponding salary slip PDFs.
 *
 * @author Your Name
 * @version 1.0.0
 * @since 2024
 */

const fs = require("fs");
const path = require("path");
const { extractZipFile } = require("../../utils/zip.util");
const {
    processExcelFile,
    mapContactsToPDFs,
} = require("../../utils/excel.util");

/**
 * @typedef {Object} Contact
 * @property {string} id - Unique identifier for the contact
 * @property {string} name - Full name of the contact
 * @property {string} email - Email address
 * @property {string} phone - Phone number
 * @property {string} department - Department name
 * @property {string} position - Job position
 * @property {number} salary - Salary amount
 * @property {string} pdfFileName - Associated PDF file name
 * @property {string} status - Processing status ('pending', 'success', 'failed')
 * @property {string} [errorMessage] - Error message if processing failed
 */

/**
 * @typedef {Object} ExtractedFiles
 * @property {string} excelFile - Path to the extracted Excel file
 * @property {string[]} pdfFiles - Array of paths to extracted PDF files
 */

/**
 * @typedef {Object} ProcessingStats
 * @property {number} total - Total number of contacts processed
 * @property {number} valid - Number of successfully processed contacts
 * @property {number} invalid - Number of contacts that failed processing
 */

/**
 * @typedef {Object} UploadResponse
 * @property {boolean} success - Whether the upload was successful
 * @property {string} message - Response message
 * @property {Contact[]} [contacts] - Array of processed contacts with PDF mappings
 * @property {ProcessingStats} [stats] - Processing statistics
 */

/**
 * @typedef {Object} MulterFile
 * @property {string} fieldname - Field name specified in the form
 * @property {string} originalname - Name of the file on the user's computer
 * @property {string} encoding - Encoding type of the file
 * @property {string} mimetype - Mime type of the file
 * @property {number} size - Size of the file in bytes
 * @property {string} destination - Folder to which the file has been saved
 * @property {string} filename - Name of the file within the destination
 * @property {string} path - Full path to the uploaded file
 * @property {Buffer} buffer - A Buffer of the entire file
 */

/**
 * Handle salary slip upload and processing
 *
 * This function processes a ZIP file containing an Excel file with contact information
 * and PDF salary slips. It extracts the ZIP, processes the Excel data, and maps
 * each contact to their corresponding PDF file.
 *
 * @async
 * @function handleSalarySlipUpload
 * @param {express.Request} req - Express request object
 * @param {MulterFile} req.file - Uploaded ZIP file from multer middleware
 * @param {express.Response} res - Express response object
 * @returns {Promise<UploadResponse>} Response with processed contacts and statistics
 *
 */
const handleSalarySlipUpload = async (req, res) => {
    try {
        // Validate file upload
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No ZIP file uploaded",
            });
        }

        // Extract the ZIP file
        const zipFilePath = req.file.path;
        const extractedFiles = await extractZipFile(zipFilePath);

        // Process Excel file to get contact information
        const contacts = processExcelFile(extractedFiles.excelFile);

        // Map contacts to their corresponding PDF files
        const contactsWithPDFs = mapContactsToPDFs(
            contacts,
            extractedFiles.pdfFiles
        );

        // Calculate processing statistics
        const stats = {
            total: contactsWithPDFs.length,
            valid: contactsWithPDFs.filter((c) => c.status === "pending")
                .length,
            invalid: contactsWithPDFs.filter((c) => c.status === "failed")
                .length,
        };

        // Store the contacts in the session or a temporary file
        // For now, we're returning them directly
        return res.status(200).json({
            success: true,
            message: "Files uploaded and processed successfully",
            contacts: contactsWithPDFs,
            stats: stats,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Export all upload controller functions
 * @type {Object}
 */
module.exports = {
    handleSalarySlipUpload,
};
