const path = require("path");
const fs = require("fs");
const fsp = require("fs").promises;
const ExcelJS = require("exceljs");
const archiver = require("archiver");
const multer = require("multer");
const { editPayslip } = require("../../services/slipGenerate.service");

const TEMP_DIR = path.join(__dirname, "../uploads/temp");

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
                return res.status(400).json({ success: false, error: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ success: false, error: "No file uploaded." });
            }

            const filePath = req.file.path;
            const sessionId = path.basename(filePath).split("-")[0];

            res.status(200).json({
                success: true,
                filePath,
                sessionId,
                message: "File uploaded successfully. You can now stream the processing progress.",
            });
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ success: false, error: "Server error during upload." });
    }
};

// Route: GET /stream-slip-progress?filePath=...
const streamSlipProgress = async (req, res) => {
    let isConnectionClosed = false;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    req.on("close", () => {
        isConnectionClosed = true;
    });

    const sendEvent = (eventType, data) => {
        if (!isConnectionClosed) {
            res.write(`event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`);
        }
    };

    try {
        const filePath = req.query.filePath;

        if (!filePath || !fs.existsSync(filePath)) {
            sendEvent("error", { error: "Missing or invalid filePath" });
            return res.end();
        }

        sendEvent("info", { message: "Processing started" });

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0];

        if (!worksheet) {
            sendEvent("error", { error: "Excel file contains no worksheets" });
            return res.end();
        }

        const headers = [];
        worksheet.getRow(1).eachCell((cell, colNumber) => {
            headers[colNumber - 1] = cell.value ? cell.value.toString().trim() : "";
        });

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
        const tracking = rawData.map((row) => ({
            employeeName: row["Name"] || "contact HR office",
            punchCode: row["User_ID"] || "contact HR office",
            phoneNo: row["Mobile_No"] || "contact HR office",
            status: "pending",
            reason: "",
        }));

        const outputFolders = new Set();
        sendEvent("progress", { total, generated, failed, pending: total });

        for (let i = 0; i < rawData.length; i++) {
            if (isConnectionClosed) break;

            const row = rawData[i];
            const data = mapExcelRowToPayslipData(row);
            const trackItem = tracking[i];
            trackItem.status = "processing";

            try {
                const folderPath = await editPayslip(data);

                if (!folderPath) throw new Error("No output folder path returned");

                outputFolders.add(path.dirname(folderPath));
                trackItem.status = "success";
                generated++;
            } catch (err) {
                trackItem.status = "failed";
                trackItem.reason = err.message || "Unknown error";
                failed++;
            }

            if (i % Math.max(1, Math.floor(total / 20)) === 0 || i === total - 1) {
                const pending = total - generated - failed;
                sendEvent("progress", {
                    total,
                    generated,
                    failed,
                    pending,
                    processed: i + 1,
                    percentage: Math.round(((i + 1) / total) * 100),
                    tracking,
                });
            }
        }

        if (generated > 0 && outputFolders.size > 0 && !isConnectionClosed) {
            const zipFilename = `payslips-${Date.now()}.zip`;
            const zipPath = path.join(TEMP_DIR, zipFilename);
            const output = fs.createWriteStream(zipPath);
            const archive = archiver("zip", { zlib: { level: 9 } });

            archive.pipe(output);

            for (const folder of outputFolders) {
                if (fs.existsSync(folder)) {
                    const files = fs.readdirSync(folder);
                    files.forEach((file) => {
                        const filePath = path.join(folder, file);
                        if (fs.statSync(filePath).isFile()) {
                            archive.file(filePath, { name: file });
                        }
                    });
                }
            }

            // ➕ Create and add summary Excel
            const summaryExcelPath = await createSummaryExcel(tracking);
            if (fs.existsSync(summaryExcelPath)) {
                archive.file(summaryExcelPath, { name: "summary.xlsx" });
            }

            await new Promise((resolve, reject) => {
                output.on("close", resolve);
                archive.on("error", reject);
                archive.finalize();
            });

            if (!isConnectionClosed) {
                sendEvent("done", {
                    zipPath: zipPath.replace(/\\/g, "/"),
                    zipFilename,
                    total,
                    generated,
                    failed,
                });
            }
        } else {
            sendEvent("error", {
                error: generated === 0
                    ? "No payslips were successfully generated"
                    : "Processing completed but ZIP was not created",
            });
        }
    } catch (error) {
        console.error("Stream error:", error);
        if (!isConnectionClosed) {
            sendEvent("error", { error: error.message || "Server error during processing" });
        }
    } finally {
        if (!isConnectionClosed) {
            res.end();
        }
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

    const excelFilePath = path.join(TEMP_DIR, "summary.xlsx");
    await workbook.xlsx.writeFile(excelFilePath);
    return excelFilePath;
}

// Helper: Map Excel row to data
function mapExcelRowToPayslipData(row) {
    return {
        phoneNo: row["Mobile_No"] || "contact HR office",
        punchCode: row["User_ID"] || "contact HR office",
        employeeName: row["Name"] || "contact HR office",
        month: row["Department"] || "contact HR office",
        workingHrCmd: parseFloat(row["Expected_Hours"]) || 0,
        payableHr: parseFloat(row["Net_Work_Hours"]) || 0,
        presentHr: parseFloat(row["Net_Work_Hours"]) || 0,
        presentSalary: parseFloat(row["Net_Work_Hours_Salary"]) || 0,
        otHr: parseFloat(row["Overtime"]) || 0,
        otSalary: parseFloat(row["Overtime_Salary"]) || 0,
        festivalHr: parseFloat(row["Festival_Hours"]) || 0,
        festivalSalary: parseFloat(row["Festival_Hours_Salary"]) || 0,
        pendingHr: parseFloat(row["Pending_Hours"]) || 0,
        pendingSalary: parseFloat(row["Pending_Hours_Salary"]) || 0,
        otExHr: parseFloat(row["OT_Hrs_Exp"]) || 0,
        otExSalary: parseFloat(row["OT_Hrs_Total"]) || 0,
        nightExHr: parseFloat(row["Night_Hrs_Exp"]) || 0,
        nightExSalary: parseFloat(row["Night_Hrs_Exp_Total"]) || 0,
        vehicleEx: parseFloat(row["Vehicle_Day"]) || 0,
        vehicleExSalary: parseFloat(row["Vehicel_Exp_Total"]) || 0,
        shoesAddSalary: parseFloat(row["Shoes_Add"]) || 0,
        zink3Ex: parseFloat(row["Zink_3_Total"]) || 0,
        cholEx: parseFloat(row["Chhol_Total"]) || 0,
        unit5zinkEx: parseFloat(row["Zink_5_Total"]) || 0,
        fabEx: parseFloat(row["Fabrication_Total"]) || 0,
        outdoorEx: parseFloat(row["Outdoor_Exp"]) || 0,
        rollFormEx: parseFloat(row["RollForming_Total"]) || 0,
        transportEx: parseFloat(row["Transportation_Total"]) || 0,
        pendingEx: parseFloat(row["Pending_Expense"]) || 0,
        totalEarning: parseFloat(row["Total_Earning"]) || 0,
        CanDed: parseFloat(row["Canteen"]) || 0,
        PfDed: parseFloat(row["PF"]) || 0,
        PtDed: parseFloat(row["PT"]) || 0,
        tShirtDed: parseFloat(row["TShirt_Less"]) || 0,
        LoneDed: parseFloat(row["Loan"]) || 0,
        fineDed: parseFloat(row["Fine"]) || 0,
        ShoesDed: parseFloat(row["Shoes_Less"]) || 0,
        otherDed: parseFloat(row["Other_Deduction"]) || 0,
        totalDed: parseFloat(row["Total_Deduction"]) || 0,
        netSalary: parseFloat(row["Net_Pay"]) || 0,
    };
}

module.exports = {
    uploadAndGenerateSlips,
    streamSlipProgress,
};
