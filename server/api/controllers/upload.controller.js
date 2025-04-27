// controllers/upload.controller.js
const fs = require('fs');
const path = require('path');
const { extractZipFile } = require('../../utils/zip.util');
const { processExcelFile, mapContactsToPDFs } = require('../../utils/excel.util');

// Handle salary slip upload
const handleSalarySlipUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No ZIP file uploaded'
      });
    }
    
    // Extract the ZIP file
    const zipFilePath = req.file.path;
    const extractedFiles = await extractZipFile(zipFilePath);
    
    // Process Excel file
    const contacts = processExcelFile(extractedFiles.excelFile);
    
    // Map contacts to PDF files
    const contactsWithPDFs = mapContactsToPDFs(contacts, extractedFiles.pdfFiles);
    
    // Store the contacts in the session or a temporary file
    // For now, we're returning them directly
    return res.status(200).json({
      success: true,
      message: 'Files uploaded and processed successfully',
      contacts: contactsWithPDFs,
      stats: {
        total: contactsWithPDFs.length,
        valid: contactsWithPDFs.filter(c => c.status === 'pending').length,
        invalid: contactsWithPDFs.filter(c => c.status === 'failed').length
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  handleSalarySlipUpload
};