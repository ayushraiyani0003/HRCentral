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
 * @returns {Object} 200 - List of banks with pagination info
 * @returns {Object} 500 - Internal server error
 */
router.get("/", BankListController.getAllBanks);

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
