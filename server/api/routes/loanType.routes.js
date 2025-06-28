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
