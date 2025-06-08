// routes/index.js
const express = require("express");
const router = express.Router();

// Import route files
const uploadRoutes = require("./upload.routes");
const whatsappRoutes = require("./whatsapp.routes");
const slipGenerateRoutes = require("./slipGenerate.routes");
const rolesRoutes = require("./rolesList.routes");
const companyStructureRoutes = require("./companyStructure.routes");
const countryRoutes = require("./country.routes");

// Uncomment when ready to use
// const salaryRoutes = require('./salary.routes');
// const employeeRoutes = require('./employee.routes');

// Mount routes on their respective paths
router.use("/upload", uploadRoutes);
router.use("/whatsapp", whatsappRoutes);
router.use("/slip-generate", slipGenerateRoutes);
router.use("/roles", rolesRoutes);
router.use("/company-structure", companyStructureRoutes);
router.use("/country", countryRoutes);
// Uncomment when ready to use
// router.use('/salary', salaryRoutes);
// router.use('/employee', employeeRoutes);

// Route for API root to list available endpoints
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running",
        endpoints: {
            upload: "/api/upload",
            whatsapp: "/api/whatsapp",
            slipGenerate: "/api/slip-generate",
            roles: "/api/roles",
            companyStructure: "/api/company-structure",
            country: "/api/country",
            // Uncomment when ready to use
            // salary: '/api/salary',
            // employee: '/api/employee',
            health: "/api/health",
        },
        version: "1.0.0",
    });
});

module.exports = router;
