const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

function editPayslip(data) {
    console.log("Generating payslip...");

    // Load the DOCX template
    const content = fs.readFileSync(
        path.resolve(__dirname, "../assets/template/Slip.docx"),
        "binary"
    );
    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    // Inject data into template
    doc.render(data);

    const buffer = doc.getZip().generate({ type: "nodebuffer" });

    // Temporary .docx path
    const tempDocxPath = path.resolve(__dirname, "temp_Slip.docx");
    fs.writeFileSync(tempDocxPath, buffer);

    // Output directory based on date
    const dateFolder = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const outputDir = path.resolve(__dirname, "../uploads", dateFolder);
    fs.mkdirSync(outputDir, { recursive: true });

    // Final PDF output path
    const outputPdfPath = path.join(outputDir, `${data.punchCode}.pdf`);

    // Convert DOCX to PDF using LibreOffice
    execSync(`soffice --headless --convert-to pdf --outdir "${outputDir}" "${tempDocxPath}"`);

    // LibreOffice might output a generic name; rename it to match punchCode
    const convertedPdfPath = path.join(outputDir, "temp_Slip.pdf");
    if (fs.existsSync(convertedPdfPath)) {
        fs.renameSync(convertedPdfPath, outputPdfPath);
    }

    // Clean up temp file
    fs.unlinkSync(tempDocxPath);

    console.log(`Payslip generated and saved as PDF: ${outputPdfPath}`);

    // ✅ Return the actual PDF file path
    return outputPdfPath;
}

module.exports = {
    editPayslip,
};
