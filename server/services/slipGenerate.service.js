const fs = require("fs");
const path = require("path");
const os = require("os");
const puppeteer = require("puppeteer");

// Optimized configuration
const MAX_CONCURRENT_BROWSERS = Math.max(2, Math.min(os.cpus().length, 4)); // Limit browser instances
const PAGES_PER_BROWSER = 5; // Multiple pages per browser for efficiency
const MAX_CONCURRENT_PDFS = MAX_CONCURRENT_BROWSERS * PAGES_PER_BROWSER;

// Global template cache
let htmlTemplate = null;

/**
 * Load HTML template once and cache it
 */
function loadTemplate() {
    if (!htmlTemplate) {
        try {
            htmlTemplate = fs.readFileSync(
                path.resolve(__dirname, "../assets/template/slipTemplate.html"),
                "utf-8"
            );
            console.log("Template loaded successfully");
        } catch (err) {
            console.error("Failed to load template:", err);
            throw err;
        }
    }
    return htmlTemplate;
}

/**
 * Inject data into HTML template
 */
function injectData(template, data) {
    let html = template;
    for (const key in data) {
        const value = data[key] != null ? data[key] : "";
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
        html = html.replace(regex, value);
    }
    return html;
}


/**
 * Generate a single PDF
 */
async function generatePDF(page, data, outputDir) {
    console.time(`PDF:${data.punchCode}`);

    try {
        const html = injectData(htmlTemplate, data);
        const outputPath = path.join(outputDir, `${data.punchCode}.pdf`);

        // Set content with optimized settings
        await page.setContent(html, {
            waitUntil: "domcontentloaded", // Faster than networkidle0
        });

        // Get content height for PDF sizing
        const bodyHandle = await page.$("body");
        const { height } = await bodyHandle.boundingBox();
        await bodyHandle.dispose();

        // Generate PDF with optimized settings
        await page.pdf({
            path: outputPath,
            printBackground: true,
            width: "210mm",
            height: `${Math.ceil(height) + 40}px`,
            omitBackground: false,
        });

        console.timeEnd(`PDF:${data.punchCode}`);
        return outputPath;
    } catch (error) {
        console.error(`Error generating PDF for ${data.punchCode}:`, error);
        throw error;
    }
}

/**
 * Process a batch of PDFs using a pool of browser instances
 */
async function processMultiplePayslips(dataArray) {
    console.time("TOTAL_PROCESSING_TIME");

    // Load template once
    htmlTemplate = loadTemplate();

    // Create output directory
    const dateFolder = new Date().toISOString().split("T")[0];
    const outputDir = path.resolve(__dirname, "../uploads", dateFolder);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Launch browser pool
    console.log(`Launching ${MAX_CONCURRENT_BROWSERS} browser instances...`);
    const browsers = await Promise.all(
        Array(MAX_CONCURRENT_BROWSERS)
            .fill()
            .map(() =>
                puppeteer.launch({
                    headless: "new",
                    args: [
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--disable-dev-shm-usage",
                        "--disable-gpu",
                        "--disable-extensions",
                    ],
                })
            )
    );

    try {
        // Create page pool (multiple pages per browser)
        const pagePool = [];
        for (const browser of browsers) {
            const pages = await Promise.all(
                Array(PAGES_PER_BROWSER)
                    .fill()
                    .map(() => browser.newPage())
            );
            // Optimize each page
            for (const page of pages) {
                await page.setRequestInterception(true);
                page.on("request", (request) => {
                    if (
                        ["image", "stylesheet", "font", "script"].includes(
                            request.resourceType()
                        )
                    ) {
                        request.continue();
                    } else {
                        request.continue();
                    }
                });
                await page.setViewport({ width: 800, height: 1200 });
            }
            pagePool.push(...pages);
        }

        console.log(`Created pool of ${pagePool.length} pages`);

        // Process PDFs in batches
        const results = [];
        const totalPDFs = dataArray.length;

        console.log(`Processing ${totalPDFs} PDFs...`);

        // Process PDFs in batches of MAX_CONCURRENT_PDFS
        for (let i = 0; i < totalPDFs; i += MAX_CONCURRENT_PDFS) {
            const batch = dataArray.slice(i, i + MAX_CONCURRENT_PDFS);
            console.log(
                `Processing batch ${i / MAX_CONCURRENT_PDFS + 1}: ${
                    batch.length
                } PDFs`
            );

            const batchPromises = batch.map((data, index) => {
                const page = pagePool[index % pagePool.length];
                return generatePDF(page, data, outputDir);
            });

            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
        }

        console.log(`Successfully generated ${results.length} PDFs`);
        return results;
    } finally {
        // Close all browsers
        console.log("Closing browser instances...");
        await Promise.all(browsers.map((browser) => browser.close()));
        console.timeEnd("TOTAL_PROCESSING_TIME");
    }
}

/**
 * Edit a single payslip
 */
async function editPayslip(data) {
    // console.log(data);
    
    // Load template
    htmlTemplate = loadTemplate();

    // Create output directory
    const dateFolder = new Date().toISOString().split("T")[0];
    const outputDir = path.resolve(__dirname, "../uploads", dateFolder);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.time("Single PDF Generation");

    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
        const page = await browser.newPage();
        const result = await generatePDF(page, data, outputDir);
        console.timeEnd("Single PDF Generation");
        return result;
    } finally {
        await browser.close();
    }
}

module.exports = {
    editPayslip,
    processMultiplePayslips,
};
