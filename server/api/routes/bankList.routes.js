/**
 * @fileoverview Express routes for BankListController
 * @version 1.0.0
 */

const express = require("express");
const router = express.Router();
const BankListController = require("../controllers/BankList.controller"); // Adjust path as necessary

// ==============================
// Routes for Bank List Management
// ==============================

// the base route is /api/bank-list

/**
 * @route POST /api/bank-list
 * @desc Create a new bank
 * @body {Object} bank - Bank object with name property
 * @body {string} bank.name - Bank name (required, max 100 characters)
 * @returns {Object} 201 - Created bank object
 * @returns {Object} 400 - Bad request (validation error)
 */
router.post("/", BankListController.createBank);

/**
 * @route GET /api/bank-list
 * @desc Get all banks (supports pagination, filtering, search)
 * @query {number} limit - Number of records to return (default: 10, max: 100)
 * @query {number} offset - Number of records to skip (default: 0)
 * @query {string} orderBy - Field to order by: id, name, created_at, updated_at (default: created_at)
 * @query {string} orderDirection - Order direction ASC/DESC (default: DESC)
 * @returns {Object} 200 - List of banks with pagination info
 * @returns {Object} 500 - Internal server error
 */
router.get("/", BankListController.getAllBanks);

/**
 * @route GET /api/bank-list/search
 * @desc Search banks by name (partial match, case-insensitive)
 * @query {string} q - Search term for bank name (required)
 * @query {number} limit - Number of records to return (default: 10, max: 100)
 * @query {number} offset - Number of records to skip (default: 0)
 * @returns {Object} 200 - List of matching banks with pagination info
 * @returns {Object} 400 - Bad request (search term required)
 * @returns {Object} 500 - Internal server error
 */
router.get("/search", BankListController.searchBanks);

/**
 * @route GET /api/bank-list/sorted
 * @desc Get all banks sorted by name (for dropdown lists)
 * @returns {Object} 200 - List of banks sorted by name
 * @returns {Object} 500 - Internal server error
 */
router.get("/sorted", BankListController.getAllBanksSorted);

/**
 * @route GET /api/bank-list/count
 * @desc Get total count of banks
 * @returns {Object} 200 - Banks count
 * @returns {Object} 500 - Internal server error
 */
router.get("/count", BankListController.getBanksCount);

/**
 * @route POST /api/bank-list/bulk
 * @desc Bulk create banks
 * @body {Array} banks - Array of bank objects
 * @body {string} banks[].name - Bank name (required, max 100 characters)
 * @returns {Object} 201 - Created banks array
 * @returns {Object} 400 - Bad request (validation error)
 * @returns {Object} 409 - Conflict (duplicate names)
 * @returns {Object} 500 - Internal server error
 */
router.post("/bulk", BankListController.bulkCreateBanks);

/**
 * @route GET /api/bank-list/exists/name/:name
 * @desc Check if bank exists by name
 * @param {string} name - Bank name to check
 * @returns {Object} 200 - Existence status
 * @returns {Object} 500 - Internal server error
 */
router.get("/exists/name/:name", BankListController.checkBankExistsByName);

/**
 * @route GET /api/bank-list/exists/id/:id
 * @desc Check if bank exists by ID
 * @param {string} id - Bank UUID to check
 * @returns {Object} 200 - Existence status
 * @returns {Object} 500 - Internal server error
 */
router.get("/exists/id/:id", BankListController.checkBankExistsById);

/**
 * @route GET /api/bank-list/name/:name
 * @desc Get bank by name (case-insensitive)
 * @param {string} name - Bank name
 * @returns {Object} 200 - Bank object
 * @returns {Object} 400 - Bad request (name required)
 * @returns {Object} 404 - Bank not found
 * @returns {Object} 500 - Internal server error
 */
router.get("/name/:name", BankListController.getBankByName);

/**
 * @route GET /api/bank-list/:id
 * @desc Get a specific bank by ID
 * @param {string} id - Bank UUID
 * @returns {Object} 200 - Bank object
 * @returns {Object} 400 - Bad request (invalid UUID)
 * @returns {Object} 404 - Bank not found
 * @returns {Object} 500 - Internal server error
 */
router.get("/:id", BankListController.getBankById);

/**
 * @route PUT /api/bank-list/:id
 * @desc Update a bank by ID
 * @param {string} id - Bank UUID
 * @body {Object} bank - Bank object with updated data
 * @body {string} bank.name - Bank name (required, max 100 characters)
 * @returns {Object} 200 - Updated bank object
 * @returns {Object} 400 - Bad request (validation error or invalid UUID)
 * @returns {Object} 404 - Bank not found
 * @returns {Object} 409 - Conflict (name already exists)
 * @returns {Object} 500 - Internal server error
 */
router.put("/:id", BankListController.updateBank);

/**
 * @route DELETE /api/bank-list/:id
 * @desc Delete a bank by ID
 * @param {string} id - Bank UUID
 * @returns {Object} 200 - Deletion success message
 * @returns {Object} 400 - Bad request (invalid UUID)
 * @returns {Object} 404 - Bank not found
 * @returns {Object} 500 - Internal server error
 */
router.delete("/:id", BankListController.deleteBank);

module.exports = router;
