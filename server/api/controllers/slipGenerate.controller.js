/**
 * Payslip Generation Controller
 * Handles Excel file upload, payslip generation, and ZIP file downloads
 * Provides server-sent events (SSE) for real-time progress tracking
 */

const path = require("path");
const fs = require("fs");
const fsp = require("fs").promises;
const ExcelJS = require("exceljs");
const archiver = require("archiver");
const multer = require("multer");
const { editPayslip } = require("../../services/slipGenerate.service");

// Temporary directory for storing uploaded files and generated payslips
const TEMP_DIR = path.join(__dirname, "../../uploads/temp");

/**
 * Ensure temporary directories exist for file operations
 * Creates the main temp directory and uploads subdirectory
 * @throws {Error} If directories cannot be created
 */
const ensureTempDirs = async () => {
    try {
        await fsp.mkdir(TEMP_DIR, { recursive: true });
        await fsp.mkdir(path.join(TEMP_DIR, "uploads"), { recursive: true });
    } catch (error) {
        console.error("Error creating temp directories:", error);
        throw new Error("Failed to create temporary directories");
    }
};

/**
 * Clean up temporary files older than 24 hours
 * Runs as a background task to prevent storage buildup
 * Removes both files and directories recursively
 */
const cleanupTempFiles = async () => {
    try {
        const files = await fsp.readdir(TEMP_DIR);
        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        for (const file of files) {
            try {
                const filePath = path.join(TEMP_DIR, file);
                const stats = await fsp.stat(filePath);

                // Delete files/folders older than 24 hours
                if (now - stats.mtimeMs > ONE_DAY) {
                    if (stats.isDirectory()) {
                        await fsp.rm(filePath, {
                            recursive: true,
                            force: true,
                        });
                    } else {
                        await fsp.unlink(filePath);
                    }
                }
            } catch (err) {
                console.error(`Failed to clean up file ${file}:`, err);
            }
        }
    } catch (error) {
        console.error("Error cleaning up temp files:", error);
    }
};

/**
 * Route: POST /upload
 * Handles Excel file upload for payslip generation
 * Validates file type, size, and stores in temporary directory
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with file path and session ID
 */
const uploadAndGenerateSlips = async (req, res) => {
    try {
        // Ensure directories exist and start cleanup
        await ensureTempDirs();
        cleanupTempFiles().catch(console.error); // Non-blocking cleanup

        const uploadDir = path.join(TEMP_DIR, "uploads");

        // Configure multer for file storage
        const storage = multer.diskStorage({
            destination: (req, file, cb) => cb(null, uploadDir),
            filename: (req, file, cb) =>
                cb(null, `${Date.now()}-${file.originalname}`),
        });

        // Configure multer with file validation
        const upload = multer({
            storage,
            fileFilter: (req, file, cb) => {
                // Only allow Excel files
                const allowedMimeTypes = [
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "application/vnd.ms-excel",
                ];
                const extname = [".xlsx", ".xls"].includes(
                    path.extname(file.originalname).toLowerCase()
                );
                const mimetype = allowedMimeTypes.includes(file.mimetype);

                if (mimetype && extname) {
                    return cb(null, true);
                }
                cb(new Error("Only Excel files are allowed"));
            },
            limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit
        }).single("file");

        // Handle file upload
        upload(req, res, async function (err) {
            if (err) {
                console.error("Upload error:", err);
                return res
                    .status(400)
                    .json({ success: false, error: err.message });
            }

            if (!req.file) {
                return res
                    .status(400)
                    .json({ success: false, error: "No file uploaded." });
            }

            // Extract session ID from filename timestamp
            const filePath = req.file.path;
            const sessionId = path.basename(filePath).split("-")[0];

            res.status(200).json({
                success: true,
                filePath,
                sessionId,
                message:
                    "File uploaded successfully. You can now stream the processing progress.",
            });
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            error: "Server error during upload.",
        });
    }
};

/**
 * Route: GET /stream-slip-progress?filePath=...
 * Streams payslip generation progress using Server-Sent Events (SSE)
 * Processes Excel data row by row and generates individual payslip PDFs
 * Returns real-time progress updates and creates ZIP file when complete
 * @param {Object} req - Express request object with filePath query parameter
 * @param {Object} res - Express response object configured for SSE
 */
const streamSlipProgress = async (req, res) => {
    let isConnectionClosed = false;

    // Configure response headers for Server-Sent Events
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering

    // Send headers immediately
    res.flushHeaders();

    // Detect client disconnection
    req.on("close", () => {
        isConnectionClosed = true;
        console.log("Client connection closed");
    });

    /**
     * Helper function to send Server-Sent Events
     * @param {string} eventType - Type of event (info, progress, done, error)
     * @param {Object} data - Data to send with the event
     */
    const sendEvent = (eventType, data) => {
        if (!isConnectionClosed) {
            const eventString = `event: ${eventType}\ndata: ${JSON.stringify(
                data
            )}\n\n`;
            res.write(eventString);

            // Force immediate delivery
            try {
                if (res.flush) res.flush();
            } catch (err) {
                console.error("Error flushing response:", err);
            }
        }
    };

    try {
        const filePath = req.query.filePath;

        // Validate file path
        if (!filePath || !fs.existsSync(filePath)) {
            sendEvent("error", { error: "Missing or invalid filePath" });
            return res.end();
        }

        // Send processing start notification
        sendEvent("info", { message: "Processing started" });

        // Load and parse Excel file
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0];

        if (!worksheet) {
            sendEvent("error", { error: "Excel file contains no worksheets" });
            return res.end();
        }

        // Extract column headers from first row
        const headers = [];
        worksheet.getRow(1).eachCell((cell, colNumber) => {
            headers[colNumber - 1] = cell.value
                ? cell.value.toString().trim()
                : "";
        });

        // Parse data rows (starting from row 2)
        const rawData = [];
        for (let i = 2; i <= worksheet.rowCount; i++) {
            const row = worksheet.getRow(i);
            const rowData = {};
            let isEmpty = true;

            // Process each cell in the row
            row.eachCell((cell, colNumber) => {
                const header = headers[colNumber - 1];
                if (header) {
                    // Handle formula results and regular values
                    const value = cell.value?.result ?? cell.value ?? "";
                    if (value !== "") isEmpty = false;
                    rowData[header] = value;
                }
            });

            // Only add non-empty rows
            if (!isEmpty) rawData.push(rowData);
        }

        // Initialize progress tracking variables
        const total = rawData.length;
        let generated = 0;
        let failed = 0;

        // Create tracking array for individual employee status
        const tracking = rawData.map((row) => ({
            employeeName: row["Name"] || "contact HR office",
            punchCode: row["User_ID"] || "contact HR office",
            phoneNo: row["Mobile_No"] || "contact HR office",
            status: "pending",
            reason: "",
        }));

        // Send initial progress update
        sendEvent("progress", {
            total,
            generated,
            failed,
            pending: total,
        });

        const outputFolders = new Set(); // Track unique output folders

        // Process each employee record and generate payslip
        for (let i = 0; i < rawData.length; i++) {
            // Stop processing if client disconnected
            if (isConnectionClosed) {
                console.log("Connection closed, stopping processing");
                break;
            }

            const row = rawData[i];
            const data = mapExcelRowToPayslipData(row);
            const trackItem = tracking[i];

            try {
                // Generate individual payslip PDF
                const folderPath = await editPayslip(data);

                if (!folderPath)
                    throw new Error("No output folder path returned");

                // Track successful generation
                outputFolders.add(path.dirname(folderPath));
                trackItem.status = "success";
                generated++;
            } catch (err) {
                // Track failed generation
                trackItem.status = "failed";
                trackItem.reason = err.message || "Unknown error";
                failed++;
            }

            // Calculate progress metrics
            const pending = total - generated - failed;
            const percentage = Math.round(((i + 1) / total) * 100);

            // Send progress updates periodically to avoid overwhelming client
            const updateFrequency = Math.max(1, Math.floor(total / 100));
            if (i % updateFrequency === 0 || i === total - 1) {
                sendEvent("progress", {
                    total,
                    generated,
                    failed,
                    pending,
                    processed: i + 1,
                    percentage,
                    tracking,
                });
            }
        }

        // Create ZIP file if any payslips were generated successfully
        if (generated > 0 && outputFolders.size > 0 && !isConnectionClosed) {
            const zipFilename = `payslips-${Date.now()}.zip`;
            const zipPath = path.join(TEMP_DIR, zipFilename);
            const output = fs.createWriteStream(zipPath);
            const archive = archiver("zip", { zlib: { level: 9 } });

            // Handle ZIP creation completion
            output.on("close", () => {
                const zipSize = archive.pointer();

                // Send completion event with download information
                sendEvent("done", {
                    zipPath: zipPath.replace(/\\/g, "/"), // Normalize path separators
                    zipFilename,
                    zipSize,
                    total,
                    generated,
                    failed,
                });

                if (!isConnectionClosed) {
                    res.end();
                }
            });

            // Handle ZIP creation errors
            archive.on("error", (err) => {
                sendEvent("error", {
                    error: `ZIP creation error: ${err.message}`,
                });
                if (!isConnectionClosed) {
                    res.end();
                }
            });

            // Pipe archive to output stream
            archive.pipe(output);

            // Add all generated PDF files to ZIP
            for (const folder of outputFolders) {
                if (fs.existsSync(folder)) {
                    const files = fs.readdirSync(folder);

                    for (const file of files) {
                        const filePath = path.join(folder, file);
                        if (fs.statSync(filePath).isFile()) {
                            archive.file(filePath, { name: file });
                        }
                    }
                }
            }

            // Create and add summary Excel with processing results
            const summaryExcelPath = await createSummaryExcel(tracking);
            if (fs.existsSync(summaryExcelPath)) {
                archive.file(summaryExcelPath, { name: "contact.xlsx" });
            }

            // Finalize ZIP creation
            archive.finalize();
        } else {
            // Handle case where no payslips were generated
            sendEvent("error", {
                error:
                    generated === 0
                        ? "No payslips were successfully generated"
                        : "Processing completed but ZIP was not created",
            });

            if (!isConnectionClosed) {
                res.end();
            }
        }
    } catch (error) {
        console.error("Stream error:", error);
        if (!isConnectionClosed) {
            sendEvent("error", {
                error: error.message || "Server error during processing",
            });
            res.end();
        }
    }
};

/**
 * Route: GET /download-zip?filePath=...
 * Downloads the generated ZIP file containing all payslips
 * Includes security checks to prevent directory traversal attacks
 * @param {Object} req - Express request object with filePath query parameter
 * @param {Object} res - Express response object for file download
 * @returns {File} ZIP file download or error response
 */
const downloadZip = async (req, res) => {
    console.log("Download ZIP request received");
    console.log(req.query);

    try {
        const filePath = req.query.filePath;

        // Validate required parameters
        if (!filePath) {
            return res
                .status(400)
                .json({ success: false, error: "Missing file path" });
        }

        // Resolve temporary directory path
        const tempDir = path.resolve(
            process.env.TEMP_DIR || "../../uploads/temp"
        );

        // Resolve absolute path for security validation
        const resolvedPath = path.resolve(tempDir, filePath);

        // Security check: Prevent directory traversal attacks
        if (!resolvedPath.startsWith(tempDir + path.sep)) {
            return res.status(403).json({
                success: false,
                error: "Access denied to the requested file",
            });
        }

        // Verify file exists
        if (!fs.existsSync(resolvedPath)) {
            return res
                .status(404)
                .json({ success: false, error: "ZIP file not found" });
        }

        // Send file to client
        return res.download(resolvedPath, (err) => {
            if (err) {
                console.error("Error sending ZIP file:", err);
                if (!res.headersSent) {
                    res.status(500).json({
                        success: false,
                        error: "Failed to send the ZIP file",
                    });
                }
            }
        });
    } catch (error) {
        console.error("Unexpected error in downloadZip:", error);
        res.status(500).json({
            success: false,
            error: "Server error while processing download",
        });
    }
};

/**
 * Helper: Create summary Excel file with processing results
 * Generates a spreadsheet showing success/failure status for each employee
 * @param {Array} trackingData - Array of employee processing results
 * @returns {string} Path to generated Excel file
 */
async function createSummaryExcel(trackingData) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Summary");

    // Define column structure
    worksheet.columns = [
        { header: "Sr No", key: "srNo", width: 10 },
        { header: "Punch Code", key: "punchCode", width: 20 },
        { header: "Name", key: "name", width: 30 },
        { header: "Phone No", key: "phoneNo", width: 20 },
        { header: "Status", key: "status", width: 15 },
        { header: "Reason (if failed)", key: "reason", width: 30 },
    ];

    // Add data rows
    trackingData.forEach((trackItem, index) => {
        worksheet.addRow({
            srNo: index + 1,
            punchCode: trackItem.punchCode,
            name: trackItem.employeeName,
            phoneNo: trackItem.phoneNo,
            status: trackItem.status,
            reason: trackItem.reason || "",
        });
    });

    // Save Excel file
    const excelFilePath = path.join(TEMP_DIR, "contact.xlsx");
    await workbook.xlsx.writeFile(excelFilePath);
    return excelFilePath;
}

/**
 * Helper: Map Excel row data to payslip data structure
 * Transforms Excel column data into the format expected by payslip generation
 * @param {Object} row - Excel row data with column headers as keys
 * @returns {Object} Formatted payslip data object
 */
function mapExcelRowToPayslipData(row) {
    return {
        // Employee Information
        phoneNo: row["Mobile_No"] || "contact HR office",
        punchCode: row["User_ID"] || "contact HR office",
        employeeName: row["Name"] || "contact HR office",
        UANno: row["UAN_No"] || "-",
        month: row["month"] || "contact HR office",

        // Working Hours
        workingHrCmd: safeRound(row["Expected_Hours"]),
        payableHr: safeRound(row["Net_Work_Hours"]),
        presentHr: safeRound(row["Net_Work_Hours"]),
        presentSalary: safeRound(row["Net_Work_Hours_Salary"]),

        // Overtime
        otHr: safeRound(row["Overtime"]),
        otSalary: safeRound(row["Overtime_Salary"]),

        // Festival Hours
        festivalHr: safeRound(row["Festival_Hours"]),
        festivalSalary: safeRound(row["Festival_Hours_Salary"]),

        // Pending Hours
        pendingHr: safeRound(row["Pending_Hours"]),
        pendingSalary: safeRound(row["Pending_Hours_Salary"]),

        // Additional Overtime
        otExHr: safeRound(row["OT_Hrs_Exp"]),
        otExSalary: safeRound(row["OT_Hrs_Total"]),

        // Night Hours
        nightExHr: safeRound(row["Night_Hrs_Exp"]),
        nightExSalary: safeRound(row["Night_Hrs_Exp_Total"]),

        // Vehicle Expenses
        vehicleEx: safeRound(row["Vehicle_Day"]),
        vehicleExSalary: safeRound(row["Vehicel_Exp_Total"]),

        // Additional Allowances
        shoesAddSalary: safeRound(row["Shoes_Add"]),

        // Department-specific Expenses
        zink3Ex: safeRound(row["Zink_3_Total"]),
        cholEx: safeRound(row["Chhol_Total"]),
        unit5zinkEx: safeRound(row["Zink_5_Total"]),
        fabEx: safeRound(row["Fabrication_Total"]),
        outdoorEx: safeRound(row["Outdoor_Exp"]),
        rollFormEx: safeRound(row["RollForming_Total"]),
        transportEx: safeRound(row["Transportation_Total"]),

        // Other Expenses
        pendingEx: safeRound(row["Pending_Expense"]),
        otherEx: safeRound(row["Other_Expense"]),

        // Total Earnings
        totalEarning: safeRound(row["Total_Earning"]),

        // Deductions
        CanDed: safeRound(row["Canteen"]),
        PfDed: safeRound(row["PF"]),
        PtDed: safeRound(row["PT"]),
        tShirtDed: safeRound(row["TShirt_Less"]),
        LoneDed: safeRound(row["Loan"]),
        fineDed: safeRound(row["Fine"]),
        ShoesDed: safeRound(row["Shoes_Less"]),
        otherDed: safeRound(row["Other_Deduction"]),
        totalDed: safeRound(row["Total_Deduction"]),

        // Net Salary
        netSalary: safeRound(row["Net_Pay"]),
    };
}

/**
 * Helper function for safe numeric rounding
 * Converts string values to numbers and rounds them, returns 0 for invalid values
 * @param {string|number} value - Value to round
 * @returns {number} Rounded number or 0 if invalid
 */
function safeRound(value) {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : Math.round(num);
}

// Export controller functions
module.exports = {
    uploadAndGenerateSlips,
    streamSlipProgress,
    downloadZip,
};

/**
 * Server-Sent Events (SSE) Response Format:
 *
 * Processing Start:
 * event: info
 * data: {"message":"Processing started"}
 *
 * Progress Updates:
 * event: progress
 * data: {"total":2,"generated":0,"failed":0,"pending":2}
 *
 * Detailed Progress:
 * event: progress
 * data: {"total":2,"generated":1,"failed":0,"pending":1,"processed":1,"percentage":50,"tracking":[...]}
 *
 * Completion:
 * event: done
 * data: {"zipPath":"/path/to/payslips.zip","zipFilename":"payslips-timestamp.zip","total":2,"generated":2,"failed":0}
 *
 * Error:
 * event: error
 * data: {"error":"Error message"}
 */
