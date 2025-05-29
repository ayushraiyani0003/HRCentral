const path = require("path");
const fs = require("fs");
const fsp = require("fs").promises;
const ExcelJS = require("exceljs");
const archiver = require("archiver");
const multer = require("multer");
const { editPayslip } = require("../../services/slipGenerate.service");

const TEMP_DIR = path.join(__dirname, "../../uploads/temp");

// Ensure temp directories exist
const ensureTempDirs = async () => {
    try {
        await fsp.mkdir(TEMP_DIR, { recursive: true });
        await fsp.mkdir(path.join(TEMP_DIR, "uploads"), { recursive: true });
    } catch (error) {
        console.error("Error creating temp directories:", error);
        throw new Error("Failed to create temporary directories");
    }
};

// Clean up old temp files
const cleanupTempFiles = async () => {
    try {
        const files = await fsp.readdir(TEMP_DIR);
        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000;

        for (const file of files) {
            try {
                const filePath = path.join(TEMP_DIR, file);
                const stats = await fsp.stat(filePath);

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

// Route: POST /upload
const uploadAndGenerateSlips = async (req, res) => {
    try {
        await ensureTempDirs();
        cleanupTempFiles().catch(console.error); // Non-blocking

        const uploadDir = path.join(TEMP_DIR, "uploads");

        const storage = multer.diskStorage({
            destination: (req, file, cb) => cb(null, uploadDir),
            filename: (req, file, cb) =>
                cb(null, `${Date.now()}-${file.originalname}`),
        });

        const upload = multer({
            storage,
            fileFilter: (req, file, cb) => {
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
            limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
        }).single("file");

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

// Route: GET /stream-slip-progress?filePath=...
const streamSlipProgress = async (req, res) => {
    let isConnectionClosed = false;

    // Set appropriate headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    // Ensure immediate flushing
    res.flushHeaders();

    // Detect when client disconnects
    req.on("close", () => {
        isConnectionClosed = true;
        console.log("Client connection closed");
    });

    // Helper function to send SSE events
    const sendEvent = (eventType, data) => {
        if (!isConnectionClosed) {
            const eventString = `event: ${eventType}\ndata: ${JSON.stringify(
                data
            )}\n\n`;
            res.write(eventString);

            // Force flush the stream to ensure immediate delivery
            try {
                if (res.flush) res.flush();
            } catch (err) {
                console.error("Error flushing response:", err);
            }
        }
    };

    try {
        const filePath = req.query.filePath;

        if (!filePath || !fs.existsSync(filePath)) {
            sendEvent("error", { error: "Missing or invalid filePath" });
            return res.end();
        }

        // Send initial info event
        sendEvent("info", { message: "Processing started" });

        // Load the Excel file
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0];

        if (!worksheet) {
            sendEvent("error", { error: "Excel file contains no worksheets" });
            return res.end();
        }

        // Extract headers
        const headers = [];
        worksheet.getRow(1).eachCell((cell, colNumber) => {
            headers[colNumber - 1] = cell.value
                ? cell.value.toString().trim()
                : "";
        });

        // Parse data rows
        const rawData = [];
        for (let i = 2; i <= worksheet.rowCount; i++) {
            const row = worksheet.getRow(i);
            const rowData = {};
            let isEmpty = true;

            row.eachCell((cell, colNumber) => {
                const header = headers[colNumber - 1];
                if (header) {
                    const value = cell.value?.result ?? cell.value ?? "";
                    if (value !== "") isEmpty = false;
                    rowData[header] = value;
                }
            });

            if (!isEmpty) rawData.push(rowData);
        }

        const total = rawData.length;
        let generated = 0;
        let failed = 0;

        // Initialize tracking array for all employees
        const tracking = rawData.map((row) => ({
            employeeName: row["Name"] || "contact HR office",
            punchCode: row["User_ID"] || "contact HR office",
            phoneNo: row["Mobile_No"] || "contact HR office",
            status: "pending",
            reason: "",
        }));

        // Send initial progress event - simplified to match expected format
        sendEvent("progress", {
            total,
            generated,
            failed,
            pending: total,
        });

        const outputFolders = new Set();

        // Process each row and generate PDFs
        for (let i = 0; i < rawData.length; i++) {
            if (isConnectionClosed) {
                console.log("Connection closed, stopping processing");
                break;
            }

            const row = rawData[i];
            const data = mapExcelRowToPayslipData(row);
            const trackItem = tracking[i];

            try {
                // Generate payslip PDF
                const folderPath = await editPayslip(data);

                if (!folderPath)
                    throw new Error("No output folder path returned");

                outputFolders.add(path.dirname(folderPath));
                trackItem.status = "success";
                generated++;
            } catch (err) {
                trackItem.status = "failed";
                trackItem.reason = err.message || "Unknown error";
                failed++;
            }

            // Send progress update after each item or periodically for larger datasets
            // Simplify the output to match expected format
            const pending = total - generated - failed;
            const percentage = Math.round(((i + 1) / total) * 100);

            // Only send progress updates periodically or after processing each item
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

        // All PDFs processed, create ZIP if any were generated successfully
        if (generated > 0 && outputFolders.size > 0 && !isConnectionClosed) {
            const zipFilename = `payslips-${Date.now()}.zip`;
            const zipPath = path.join(TEMP_DIR, zipFilename);
            const output = fs.createWriteStream(zipPath);
            const archive = archiver("zip", { zlib: { level: 9 } });

            // Set up event handlers for archiver
            output.on("close", () => {
                const zipSize = archive.pointer();

                // Simplified done event to match expected format
                sendEvent("done", {
                    zipPath: zipPath.replace(/\\/g, "/"),
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

            archive.on("error", (err) => {
                sendEvent("error", {
                    error: `ZIP creation error: ${err.message}`,
                });
                if (!isConnectionClosed) {
                    res.end();
                }
            });

            archive.pipe(output);

            // Add all generated PDFs to the ZIP
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

            // Create and add summary Excel with all employee statuses
            const summaryExcelPath = await createSummaryExcel(tracking);
            if (fs.existsSync(summaryExcelPath)) {
                archive.file(summaryExcelPath, { name: "contact.xlsx" });
            }

            // Finalize the ZIP
            archive.finalize();
        } else {
            // No successful payslips were generated
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
// Route: GET /download-zip?filePath=...
// This route is used to download the generated ZIP file
// It is assumed that the filePath is passed as a query parameter
// and that the file is located in the TEMP_DIR
const downloadZip = async (req, res) => {
    console.log("Download ZIP request received");
    console.log(req.query);

    try {
        const filePath = req.query.filePath;

        // Basic validation
        if (!filePath) {
            return res
                .status(400)
                .json({ success: false, error: "Missing file path" });
        }

        const tempDir = path.resolve(
            process.env.TEMP_DIR || "../../uploads/temp"
        );

        // Resolve the absolute path relative to the tempDir
        const resolvedPath = path.resolve(tempDir, filePath);

        // Security check: Make sure the resolved path is still under tempDir
        if (!resolvedPath.startsWith(tempDir + path.sep)) {
            return res.status(403).json({
                success: false,
                error: "Access denied to the requested file",
            });
        }

        // Check if the file exists
        if (!fs.existsSync(resolvedPath)) {
            return res
                .status(404)
                .json({ success: false, error: "ZIP file not found" });
        }

        // Send the file
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

// Helper: Create summary Excel with status
async function createSummaryExcel(trackingData) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Summary");

    worksheet.columns = [
        { header: "Sr No", key: "srNo", width: 10 },
        { header: "Punch Code", key: "punchCode", width: 20 },
        { header: "Name", key: "name", width: 30 },
        { header: "Phone No", key: "phoneNo", width: 20 },
        { header: "Status", key: "status", width: 15 },
        { header: "Reason (if failed)", key: "reason", width: 30 },
    ];

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

    const excelFilePath = path.join(TEMP_DIR, "contact.xlsx");
    await workbook.xlsx.writeFile(excelFilePath);
    return excelFilePath;
}

// Helper: Map Excel row to data
function mapExcelRowToPayslipData(row) {
    return {
        phoneNo: row["Mobile_No"] || "contact HR office",
        punchCode: row["User_ID"] || "contact HR office",
        employeeName: row["Name"] || "contact HR office",
        UANno: row["UAN_No"] || "contact HR office",
        month: row["month"] || "contact HR office",
        workingHrCmd: safeRound(row["Expected_Hours"]),
        payableHr: safeRound(row["Net_Work_Hours"]),
        presentHr: safeRound(row["Net_Work_Hours"]),
        presentSalary: safeRound(row["Net_Work_Hours_Salary"]),
        otHr: safeRound(row["Overtime"]),
        otSalary: safeRound(row["Overtime_Salary"]),
        festivalHr: safeRound(row["Festival_Hours"]),
        festivalSalary: safeRound(row["Festival_Hours_Salary"]),
        pendingHr: safeRound(row["Pending_Hours"]),
        pendingSalary: safeRound(row["Pending_Hours_Salary"]),
        otExHr: safeRound(row["OT_Hrs_Exp"]),
        otExSalary: safeRound(row["OT_Hrs_Total"]),
        nightExHr: safeRound(row["Night_Hrs_Exp"]),
        nightExSalary: safeRound(row["Night_Hrs_Exp_Total"]),
        vehicleEx: safeRound(row["Vehicle_Day"]),
        vehicleExSalary: safeRound(row["Vehicel_Exp_Total"]),
        shoesAddSalary: safeRound(row["Shoes_Add"]),
        zink3Ex: safeRound(row["Zink_3_Total"]),
        cholEx: safeRound(row["Chhol_Total"]),
        unit5zinkEx: safeRound(row["Zink_5_Total"]),
        fabEx: safeRound(row["Fabrication_Total"]),
        outdoorEx: safeRound(row["Outdoor_Exp"]),
        rollFormEx: safeRound(row["RollForming_Total"]),
        transportEx: safeRound(row["Transportation_Total"]),
        pendingEx: safeRound(row["Pending_Expense"]),
        totalEarning: safeRound(row["Total_Earning"]),
        CanDed: safeRound(row["Canteen"]),
        PfDed: safeRound(row["PF"]),
        PtDed: safeRound(row["PT"]),
        tShirtDed: safeRound(row["TShirt_Less"]),
        LoneDed: safeRound(row["Loan"]),
        fineDed: safeRound(row["Fine"]),
        ShoesDed: safeRound(row["Shoes_Less"]),
        otherDed: safeRound(row["Other_Deduction"]),
        totalDed: safeRound(row["Total_Deduction"]),
        netSalary: safeRound(row["Net_Pay"]),
    };
}

// Helper function for safe rounding
function safeRound(value) {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : Math.round(num);
}

module.exports = {
    uploadAndGenerateSlips,
    streamSlipProgress,
    downloadZip,
};

// the result of the stream of prossess is like this.
// event: info
// data: {"message":"Processing started"}

// event: progress
// data: {"total":2,"generated":0,"failed":0,"pending":2}

// event: progress
// data: {"total":2,"generated":1,"failed":0,"pending":1,"processed":1,"percentage":50,"tracking":[{"employeeName":"Khuman Prafulkumar Virjibhai","punchCode":"k6","phoneNo":9725319972,"status":"success","reason":""},{"employeeName":"Pansuriya Pradip Ratilal","punchCode":"S10","phoneNo":9870013371,"status":"pending","reason":""}]}

// event: progress
// data: {"total":2,"generated":2,"failed":0,"pending":0,"processed":2,"percentage":100,"tracking":[{"employeeName":"Khuman Prafulkumar Virjibhai","punchCode":"k6","phoneNo":9725319972,"status":"success","reason":""},{"employeeName":"Pansuriya Pradip Ratilal","punchCode":"S10","phoneNo":9870013371,"status":"success","reason":""}]}

// event: done
// data: {"zipPath":"/home/ayush-rayani/Desktop/Aysuh Raiyani/Ayush Raiyani/website/HRCentral/server/api/uploads/temp/payslips-1747108780804.zip","zipFilename":"payslips-1747108780804.zip","total":2,"generated":2,"failed":0}

// the result is send to the client in the form of event stream.
