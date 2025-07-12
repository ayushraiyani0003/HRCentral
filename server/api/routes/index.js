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
const EmployeeTypeRoutes = require("./employeeType.routes");
const AssetTypeRoutes = require("./assetType.routes");
const BankListRoutes = require("./bankList.routes");
const LanguageRoutes = require("./language.routes");
const LoanTypeRoutes = require("./loanType.routes");
const SalutationRoutes = require("./salutation.routes");
const DesignationRoutes = require("./designation.routes");
const ExperienceLevelRoutes = require("./experienceLevel.routes");
const SkillRoutes = require("./skill.routes");
const EducationLevelRoutes = require("./educationLevel.routes");
const HiringSourceRoutes = require("./hiringSource.routes");
const WorkShiftRoutes = require("./workShift.routes");
const JobLocationRoutes = require("./jobLocation.routes");
const ApplicantTrackingRoutes = require("./applicantTracking.routes");
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
router.use("/employee-type", EmployeeTypeRoutes);
router.use("/asset-type", AssetTypeRoutes);
router.use("/bank-list", BankListRoutes);
router.use("/language", LanguageRoutes);
router.use("/loan-type", LoanTypeRoutes);
router.use("/salutation", SalutationRoutes);
router.use("/designation", DesignationRoutes);
router.use("/experience-level", ExperienceLevelRoutes);
router.use("/skill", SkillRoutes);
router.use("/education-level", EducationLevelRoutes);
router.use("/hiring-source", HiringSourceRoutes);
router.use("/work-shift", WorkShiftRoutes);
router.use("/job-location", JobLocationRoutes);
router.use("/applicant-tracking", ApplicantTrackingRoutes);

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
            employeeType: "/api/employee-type",
            assetType: "/api/asset-type",
            bankList: "/api/bank-list",
            language: "/api/language",
            loanType: "/api/loan-type",
            salutation: "/api/salutation",
            designation: "/api/designation",
            experienceLevel: "/api/experience-level",
            skill: "/api/skill",
            educationLevel: "/api/education-level",
            hiringSource: "/api/hiring-source",
            workShift: "/api/work-shift",
            jobLocation: "/api/job-location",
            applicantTracking: "/api/applicant-tracking",

            // Uncomment when ready to use
            // salary: '/api/salary',
            // employee: '/api/employee',tu
            health: "/api/health",
        },
        version: "1.0.0",
    });
});

module.exports = router;
// todo: i add this to over network