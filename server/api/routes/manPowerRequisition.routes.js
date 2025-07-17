/**
 * @fileoverview ManPowerRequisition Routes - Defines API routes for manpower requisition operations
 * @version 1.0.0
 */

const express = require("express");
const router = express.Router();
const ManPowerRequisitionController = require("../controllers/ManPowerRequisition.controller");

/**
 * @route POST /api/manpower-requisitions
 * @description Create a new manpower requisition
 * @access Private (requires authentication)
 */
router.post("/", ManPowerRequisitionController.createManPowerRequisition);

/**
 * @route GET /api/manpower-requisitions
 * @description Get all manpower requisitions with optional filtering and pagination
 * @query {string} [requisition_status] - Filter by requisition status
 * @query {string} [approval_status] - Filter by approval status
 * @query {string} [requirement_category] - Filter by requirement category
 * @query {string} [requirement_type] - Filter by requirement type
 * @query {string} [department_id] - Filter by department ID
 * @query {string} [designation_id] - Filter by designation ID
 * @query {number} [page] - Page number for pagination
 * @query {number} [limit] - Number of records per page
 * @access Private (requires authentication)
 */
router.get("/", ManPowerRequisitionController.getAllManPowerRequisitions);

/**
 * @route GET /api/manpower-requisitions/:id
 * @description Get a specific manpower requisition by ID
 * @param {string} id - Requisition ID
 * @access Private (requires authentication)
 */
router.get("/:id", ManPowerRequisitionController.getManPowerRequisitionById);

/**
 * @route PUT /api/manpower-requisitions/:id
 * @description Update a manpower requisition by ID
 * @param {string} id - Requisition ID
 * @access Private (requires authentication)
 */
router.put("/:id", ManPowerRequisitionController.updateManPowerRequisition);

/**
 * @route DELETE /api/manpower-requisitions/:id
 * @description Delete a manpower requisition by ID
 * @param {string} id - Requisition ID
 * @access Private (requires authentication)
 */
router.delete("/:id", ManPowerRequisitionController.deleteManPowerRequisition);

module.exports = router;
