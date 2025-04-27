const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

/**
 * Process Excel file and extract contact information
 * Expected Excel format:
 * - Column A: Sr No (sequential number)
 * - Column B: Punch Code (unique employee ID, alphanumeric)
 * - Column C: Name (employee name)
 * - Column D: Phone No (with country code)
 *
 * @param {string} excelFilePath Path to the Excel file
 * @returns {Array} Array of contact objects
 */
const processExcelFile = (excelFilePath) => {
    try {
        // Read the Excel file
        const workbook = XLSX.readFile(excelFilePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Skip header row and process data
        const contacts = [];
        for (let i = 1; i < data.length; i++) {
            const row = data[i];

            // Skip empty rows
            if (!row || row.length === 0) continue;

            // Extract data from columns
            const contact = {
                srNo: row[0] || i,
                punchCode:
                    row[1] !== undefined && row[1] !== null
                        ? String(row[1])
                        : "",
                name: row[2] || "",
                phoneNo: row[3] ? row[3].toString().replace(/\D/g, "") : "",
                status: "pending",
                errorMessage: null,
            };

            // Validate phone number
            if (!contact.phoneNo) {
                contact.status = "failed";
                contact.errorMessage = "Missing phone number";
            } else if (contact.phoneNo.length < 10) {
                contact.status = "failed";
                contact.errorMessage = "Invalid phone number";
            }

            // Ensure punch code exists for PDF mapping
            if (!contact.punchCode) {
                contact.status = "failed";
                contact.errorMessage =
                    (contact.errorMessage || "") + " Missing punch code";
            }

            contacts.push(contact);
        }

        return contacts;
    } catch (error) {
        console.error("Error processing Excel file:", error);
        throw new Error("Failed to process Excel file: " + error.message);
    }
};

/**
 * Map contacts to PDF files based on punch code
 * @param {Array} contacts Array of contact objects
 * @param {Array} pdfFiles Array of PDF filenames
 * @returns {Array} Updated contacts with PDF file paths
 */
const mapContactsToPDFs = (contacts, pdfFiles) => {
    return contacts.map((contact) => {
        // Handle both string and numeric punch codes
        // First ensure punchCode is a string
        const punchCodeStr = contact.punchCode || "";

        // Search for PDF file with punch code in the filename
        // Look for both formats: S253 and 253, and also {S253} and {253}
        const matchingPDF = pdfFiles.find((file) => {
            const fileName = path.basename(file, ".pdf").toLowerCase();

            // If punchCode is something like "S253", also look for "253"
            const numericPart = punchCodeStr
                .replace(/^[a-z]/i, "")
                .toLowerCase();

            // Check for various formats
            return (
                fileName.includes(punchCodeStr.toLowerCase()) ||
                (numericPart && fileName.includes(numericPart)) ||
                fileName.includes(`{${punchCodeStr.toLowerCase()}}`) ||
                fileName.includes(`{${numericPart}}`)
            );
        });

        if (matchingPDF) {
            contact.pdfFile = matchingPDF;
        } else {
            contact.status = "failed";
            contact.errorMessage =
                (contact.errorMessage || "") + " No matching PDF found";
        }

        return contact;
    });
};

module.exports = {
    processExcelFile,
    mapContactsToPDFs,
};
