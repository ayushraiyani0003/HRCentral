/**
 * @fileoverview Express routes for LoanTypeController
 * @version 1.0.0
 */

const express = require("express");
const router = express.Router();
const LoanTypeController = require("../controllers/LoanType.controller"); // Adjust path as necessary

// ==============================
// Routes for Loan Type Management
// ==============================

// the base route is /api/loan-type

/**
 * @route POST /api/loan-type
 * @desc Create a new loan type
 * @body {Object} loanType - Loan type object with name property
 * @body {string} loanType.name - Loan type name (required, max 100 characters)
 * @returns {Object} 201 - Created loan type object
 * @returns {Object} 400 - Bad request (validation error)
 */
router.post("/", LoanTypeController.createLoanType);

/**
 * @route GET /api/loan-type
 * @desc Get all loan types (supports pagination, filtering, search)
 * @query {number} limit - Number of records to return (default: 10, max: 100)
 * @query {number} offset - Number of records to skip (default: 0)
 * @query {string} orderBy - Field to order by: id, name, created_at, updated_at (default: created_at)
 * @query {string} orderDirection - Order direction ASC/DESC (default: DESC)
 * @returns {Object} 200 - List of loan types with pagination info
 * @returns {Object} 500 - Internal server error
 */
router.get("/", LoanTypeController.getAllLoanTypes);

/**
 * @route GET /api/loan-type/search
 * @desc Search loan types by name (partial match, case-insensitive)
 * @query {string} q - Search term for loan type name (required)
 * @query {number} limit - Number of records to return (default: 10, max: 100)
 * @query {number} offset - Number of records to skip (default: 0)
 * @returns {Object} 200 - List of matching loan types with pagination info
 * @returns {Object} 400 - Bad request (search term required)
 * @returns {Object} 500 - Internal server error
 */
router.get("/search", LoanTypeController.searchLoanTypes);

/**
 * @route GET /api/loan-type/sorted
 * @desc Get all loan types sorted by name (for dropdown lists)
 * @returns {Object} 200 - List of loan types sorted by name
 * @returns {Object} 500 - Internal server error
 */
router.get("/sorted", LoanTypeController.getAllLoanTypesSorted);

/**
 * @route GET /api/loan-type/count
 * @desc Get total count of loan types
 * @returns {Object} 200 - Loan types count
 * @returns {Object} 500 - Internal server error
 */
router.get("/count", LoanTypeController.getLoanTypesCount);

/**
 * @route POST /api/loan-type/bulk
 * @desc Bulk create loan types
 * @body {Array} loanTypes - Array of loan type objects
 * @body {string} loanTypes[].name - Loan type name (required, max 100 characters)
 * @returns {Object} 201 - Created loan types array
 * @returns {Object} 400 - Bad request (validation error)
 * @returns {Object} 409 - Conflict (duplicate names)
 * @returns {Object} 500 - Internal server error
 */
router.post("/bulk", LoanTypeController.bulkCreateLoanTypes);

/**
 * @route GET /api/loan-type/exists/name/:name
 * @desc Check if loan type exists by name
 * @param {string} name - Loan type name to check
 * @returns {Object} 200 - Existence status
 * @returns {Object} 500 - Internal server error
 */
router.get("/exists/name/:name", LoanTypeController.checkLoanTypeExistsByName);

/**
 * @route GET /api/loan-type/exists/id/:id
 * @desc Check if loan type exists by ID
 * @param {string} id - Loan type UUID to check
 * @returns {Object} 200 - Existence status
 * @returns {Object} 500 - Internal server error
 */
router.get("/exists/id/:id", LoanTypeController.checkLoanTypeExistsById);

/**
 * @route GET /api/loan-type/name/:name
 * @desc Get loan type by name (case-insensitive)
 * @param {string} name - Loan type name
 * @returns {Object} 200 - Loan type object
 * @returns {Object} 400 - Bad request (name required)
 * @returns {Object} 404 - Loan type not found
 * @returns {Object} 500 - Internal server error
 */
router.get("/name/:name", LoanTypeController.getLoanTypeByName);

/**
 * @route GET /api/loan-type/:id
 * @desc Get a specific loan type by ID
 * @param {string} id - Loan type UUID
 * @returns {Object} 200 - Loan type object
 * @returns {Object} 400 - Bad request (invalid UUID)
 * @returns {Object} 404 - Loan type not found
 * @returns {Object} 500 - Internal server error
 */
router.get("/:id", LoanTypeController.getLoanTypeById);

/**
 * @route PUT /api/loan-type/:id
 * @desc Update a loan type by ID
 * @param {string} id - Loan type UUID
 * @body {Object} loanType - Loan type object with updated data
 * @body {string} loanType.name - Loan type name (required, max 100 characters)
 * @returns {Object} 200 - Updated loan type object
 * @returns {Object} 400 - Bad request (validation error or invalid UUID)
 * @returns {Object} 404 - Loan type not found
 * @returns {Object} 409 - Conflict (name already exists)
 * @returns {Object} 500 - Internal server error
 */
router.put("/:id", LoanTypeController.updateLoanType);

/**
 * @route DELETE /api/loan-type/:id
 * @desc Delete a loan type by ID
 * @param {string} id - Loan type UUID
 * @returns {Object} 200 - Deletion success message
 * @returns {Object} 400 - Bad request (invalid UUID)
 * @returns {Object} 404 - Loan type not found
 * @returns {Object} 500 - Internal server error
 */
router.delete("/:id", LoanTypeController.deleteLoanType);

module.exports = router;
