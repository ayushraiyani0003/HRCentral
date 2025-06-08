// companyStructure.routes.js;

/**
 * @fileoverview Express routes for CompanyStructureController
 * @version 1.0.0
 */

const express = require("express");
const router = express.Router();
const CompanyStructureController = require("../controllers/companyStructure.controller"); // Adjust path as necessary

// ==============================
// Routes for Company Structure Management
// ==============================

/**
 * @route POST /api/company-structure
 * @desc Create a new company structure entity
 */
router.post("/", CompanyStructureController.createCompanyStructure);

/**
 * @route GET /api/company-structure
 * @desc Get all company structure entities (supports pagination, filtering, search)
 */
router.get("/", CompanyStructureController.getAllCompanyStructures);

/**
 * @route GET /api/company-structure/:id
 * @desc Get a specific company structure entity by ID
 */
router.get("/:id", CompanyStructureController.getCompanyStructureById);

/**
 * @route PUT /api/company-structure/:id
 * @desc Update a company structure entity by ID
 */
router.put("/:id", CompanyStructureController.updateCompanyStructure);

/**
 * @route DELETE /api/company-structure/:id
 * @desc Delete a company structure entity by ID
 */
router.delete("/:id", CompanyStructureController.deleteCompanyStructure);

// ==============================
// Additional Company Structure Routes
// ==============================

/**
 * @route GET /api/company-structure/hierarchy/:id
 * @desc Get hierarchical structure for a specific entity
 */
router.get("/hierarchy/:id", CompanyStructureController.getHierarchy);

module.exports = router;
