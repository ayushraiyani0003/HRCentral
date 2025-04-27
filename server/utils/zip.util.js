// utils/zip.util.js
const fs = require('fs');
const path = require('path');
const extract = require('extract-zip');
const { uploadDir, extractedDir, pdfsDir } = require('./upload.util');

/**
 * Extract ZIP file and separate PDFs and Excel files
 * @param {string} zipFilePath Path to the ZIP file
 * @returns {Promise<Object>} Object containing paths to extracted files
 */
const extractZipFile = async (zipFilePath) => {
  try {
    // Create a unique extraction directory
    const extractionId = Date.now().toString();
    const extractionPath = path.join(extractedDir, extractionId);
    
    if (!fs.existsSync(extractionPath)) {
      fs.mkdirSync(extractionPath, { recursive: true });
    }
    
    // Extract the ZIP file
    await extract(zipFilePath, { dir: extractionPath });
    
    // Process extracted files
    const files = fs.readdirSync(extractionPath);
    
    // Separate PDFs and Excel files
    const pdfFiles = [];
    const excelFiles = [];
    
    // Process all files recursively
    const processDirectory = (dirPath, basePath = '') => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.join(basePath, entry.name);
        
        if (entry.isDirectory()) {
          processDirectory(fullPath, relativePath);
        } else {
          const ext = path.extname(entry.name).toLowerCase();
          
          if (ext === '.pdf') {
            // Create a copy in the pdfs directory
            const pdfDestination = path.join(pdfsDir, entry.name);
            fs.copyFileSync(fullPath, pdfDestination);
            pdfFiles.push(pdfDestination);
          } else if (['.xlsx', '.xls', '.csv'].includes(ext)) {
            excelFiles.push(fullPath);
          }
        }
      }
    };
    
    processDirectory(extractionPath);
    
    // Check if we have both PDFs and an Excel file
    if (pdfFiles.length === 0) {
      throw new Error('No PDF files found in the ZIP archive');
    }
    
    if (excelFiles.length === 0) {
      throw new Error('No Excel file found in the ZIP archive');
    }
    
    // Return the extracted file paths
    return {
      pdfFiles,
      excelFile: excelFiles[0], // Use the first Excel file
      extractionPath
    };
  } catch (error) {
    console.error('Error extracting ZIP file:', error);
    throw new Error('Failed to extract ZIP file: ' + error.message);
  }
};

module.exports = {
  extractZipFile
};