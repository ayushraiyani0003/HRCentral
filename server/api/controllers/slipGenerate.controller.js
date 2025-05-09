const path = require("path");
const fs = require("fs");
const fsp = require("fs").promises;
const ExcelJS = require("exceljs");
const archiver = require("archiver");
const multer = require("multer");
const { editPayslip } = require("../../services/slipGenerate.service");

const TEMP_DIR = path.join(__dirname, "../../uploads/temp");

// 1️⃣ Route: POST /upload
const uploadAndGenerateSlips = async (req, res) => {
    try {
        const uploadDir = path.join(TEMP_DIR, "uploads");
        await fsp.mkdir(uploadDir, { recursive: true });

        const storage = multer.diskStorage({
            destination: (req, file, cb) => cb(null, uploadDir),
            filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
        });

        const upload = multer({ storage }).single("file");

        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ success: false, error: "No file uploaded." });
            }

            const filePath = req.file.path;
            res.json({ success: true, filePath });
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ success: false, error: "Server error during upload." });
    }
};

// 2️⃣ Route: GET /stream-slip-progress?filePath=...
const streamSlipProgress = async (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const filePath = req.query.filePath;
    if (!filePath || !fs.existsSync(filePath)) {
        res.write(`event: error\ndata: Missing or invalid filePath\n\n`);
        return res.end();
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];

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
    const tracking = [];
    const slipRows = [];

    for (const row of rawData) {
        const data = mapExcelRowToPayslipData(row);
        const trackItem = {
            employeeName: data.employeeName,
            punchCode: data.punchCode,
            phoneNo: data.phoneNo,
            status: "pending",
            reason: ""
        };

        try {
            const folderPath = await editPayslip(data);
            if (!folderPath) throw new Error("No folder path returned");

            trackItem.status = "success";
            generated++;
            slipRows.push(data); // Optional: return full data if needed
        } catch (err) {
            trackItem.status = "failed";
            trackItem.reason = err.message;
            failed++;
        }

        tracking.push(trackItem);
        const pending = total - generated - failed;

        res.write(`event: progress\ndata: ${JSON.stringify({ total, generated, failed, pending, tracking, slipRows })}\n\n`);
    }

    // Archive generated files
    const zipFilename = `slips-${Date.now()}.zip`;
    const zipPath = path.join(TEMP_DIR, zipFilename);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
        res.write(`event: done\ndata: ${JSON.stringify({ zipPath })}\n\n`);
        res.end();
    });

    archive.on("error", (err) => {
        res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
    });

    const exampleFolder = await editPayslip(rawData[0]); // use first one again (not ideal but okay for now)
    archive.pipe(output);
    archive.directory(path.dirname(exampleFolder), false);
    archive.finalize();
};

// Helper
function mapExcelRowToPayslipData(row) {
    return {
        phoneNo: row["Mobile_No"] || "contact not Hr office",
        punchCode: row["User_ID"] || "contact not Hr office",
        employeeName: row["Name"] || "contact not Hr office",
        month: row["Department"] || "contact not Hr office",
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
