/**
 * WorkShiftRoutes - Express router for managing employee work shifts.
 * Supports CRUD operations and shift overlap checking.
 */

const express = require("express");
const router = express.Router();
const WorkShiftController = require("../controllers/WorkShift.controller");

/**
 * @route POST /api/work-shifts
 * @desc Create a new work shift
 * @access Public
 * @param {Object} req.body - Work shift details
 * @param {string} req.body.name - Name of the work shift
 * @param {string} req.body.start_time - Start time in HH:mm format
 * @param {string} req.body.end_time - End time in HH:mm format
 * @returns {Object} 201 - Created shift data
 * @returns {Object} 400 - Validation error
 * @returns {Object} 500 - Internal server error
 * @example
 * {
 *   "name": "Morning Shift",
 *   "start_time": "09:00",
 *   "end_time": "17:00"
 * }
 */
router.post("/", WorkShiftController.create);

/**
 * @route GET /api/work-shifts
 * @desc Get all work shifts with optional pagination and search
 * @access Public
 * @param {number} [req.query.limit=10] - Max number of records
 * @param {number} [req.query.offset=0] - Records to skip
 * @param {string} [req.query.search] - Keyword to search by name
 * @returns {Object} 200 - List of work shifts
 * @returns {Object} 500 - Internal server error
 */
router.get("/", WorkShiftController.getAll);

/**
 * @route GET /api/work-shifts/:id
 * @desc Get a specific work shift by ID
 * @access Public
 * @param {string} req.params.id - Shift ID
 * @returns {Object} 200 - Shift data
 * @returns {Object} 404 - Shift not found
 * @returns {Object} 500 - Internal server error
 */
router.get("/:id", WorkShiftController.getById);

/**
 * @route PUT /api/work-shifts/:id
 * @desc Update a work shift by ID
 * @access Public
 * @param {string} req.params.id - Shift ID
 * @param {Object} req.body - Updated shift data
 * @returns {Object} 200 - Updated shift data
 * @returns {Object} 400 - Bad request
 * @returns {Object} 404 - Shift not found
 * @returns {Object} 500 - Internal server error
 */
router.put("/:id", WorkShiftController.update);

/**
 * @route DELETE /api/work-shifts/:id
 * @desc Delete a work shift by ID
 * @access Public
 * @param {string} req.params.id - Shift ID
 * @returns {Object} 200 - Deletion success message
 * @returns {Object} 404 - Shift not found
 * @returns {Object} 500 - Internal server error
 */
router.delete("/:id", WorkShiftController.delete);

/**
 * @route GET /api/work-shifts/check/overlap
 * @desc Check if the given start and end time overlaps with any existing shift
 * @access Public
 * @param {string} req.query.start_time - Start time in HH:mm
 * @param {string} req.query.end_time - End time in HH:mm
 * @param {string} [req.query.exclude_id] - Shift ID to exclude from overlap check (e.g., during update)
 * @returns {Object} 200 - Overlap status
 * @returns {Object} 500 - Internal server error
 * @example
 * // Request: /api/work-shifts/check/overlap?start_time=08:00&end_time=12:00&exclude_id=123
 *
 * // Response:
 * {
 *   "success": true,
 *   "isOverlapping": false
 * }
 */
router.get("/check/overlap", WorkShiftController.checkOverlap);

module.exports = router;
