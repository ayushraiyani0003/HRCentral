/**
 * @fileoverview JobLocation Routes - Defines HTTP routes for job location operations
 * @version 1.0.0
 */

const express = require("express");
const router = express.Router();
const JobLocationController = require("../controllers/JobLocation.controller");

/**
 * @route POST /
 * @description Create a new job location
 * @access Public
 * @param {Object} req.body - Job location data
 * @param {string} req.body.name - Job location name
 * @returns {Object} 201 - Success response with created job location
 * @returns {Object} 400 - Bad request error
 */
router.post("/", JobLocationController.create);

/**
 * @route GET /
 * @description Get all job locations with pagination and search
 * @access Public
 * @param {number} req.query.limit - Limit of records to return
 * @param {number} req.query.offset - Number of records to skip
 * @param {string} req.query.search - Search term for filtering
 * @returns {Object} 200 - Success response with job locations list and pagination
 * @returns {Object} 500 - Internal server error
 */
router.get("/", JobLocationController.getAll);

/**
 * @route GET /:id
 * @description Get job location by ID
 * @access Public
 * @param {string} req.params.id - Job location UUID
 * @returns {Object} 200 - Success response with job location data
 * @returns {Object} 404 - Job location not found
 * @returns {Object} 500 - Internal server error
 */
router.get("/:id", JobLocationController.getById);

/**
 * @route PUT /:id
 * @description Update job location by ID
 * @access Public
 * @param {string} req.params.id - Job location UUID
 * @param {Object} req.body - Updated job location data
 * @returns {Object} 200 - Success response with updated job location
 * @returns {Object} 400 - Bad request error
 * @returns {Object} 404 - Job location not found
 */
router.put("/:id", JobLocationController.update);

/**
 * @route DELETE /:id
 * @description Delete job location by ID
 * @access Public
 * @param {string} req.params.id - Job location UUID
 * @returns {Object} 200 - Success response with deletion confirmation
 * @returns {Object} 404 - Job location not found
 * @returns {Object} 500 - Internal server error
 */
router.delete("/:id", JobLocationController.delete);

module.exports = router;
