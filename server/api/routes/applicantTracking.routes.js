/**
 * @fileoverview Express router for Applicant Tracking System
 * @module routes/applicantTracking
 * @requires express
 * @requires ../controllers/ApplicantTracking.controller
 */

const express = require("express");
const router = express.Router();
const ApplicantTrackingController = require("../controllers/ApplicantTracking.controller");

/**
 * @route POST /
 * @description Create a new applicant with all related records (education, work history, interviews, languages, management)
 * @access Public/Private (depends on your auth middleware)
 * @param {Object} req.body - Complete applicant data with related records
 * @returns {Object} 201 - Created applicant object with related records count
 * @returns {Object} 400 - Bad request error (validation failed or related record creation failed)
 * @returns {Object} 500 - Internal server error
 * @example

 */
router.post("/", ApplicantTrackingController.createApplicant);

/**
 * @route GET /
 * @description Get all applicants with optional filtering and pagination
 * @access Public/Private (depends on your auth middleware)
 * @returns {Object} 200 - Object containing applicants array and pagination info
 * @returns {Object} 500 - Internal server error
 * @example
 * // GET /api/applicant-tracking?page=1&limit=20&status=active
 */
router.get("/", ApplicantTrackingController.getAllApplicants);

/**
 * @route GET /:id
 * @description Get a single applicant by ID with all related data
 * @access Public/Private (depends on your auth middleware)
 * @param {string} req.params.id - Applicant ID
 * @returns {Object} 200 - Complete applicant object with related records
 * @returns {Object} 404 - Applicant not found
 * @returns {Object} 500 - Internal server error
 */
router.get("/:id", ApplicantTrackingController.getApplicantById);

/**
 * @route PUT /:id
 * @description Update an applicant's information
 * @access Public/Private (depends on your auth middleware)
 * @param {string} req.params.id - Applicant ID
 * @param {Object} req.body - Updated applicant data
 * @returns {Object} 200 - Updated applicant object
 * @returns {Object} 400 - Bad request error
 * @returns {Object} 404 - Applicant not found or update failed
 * @returns {Object} 500 - Internal server error
 * @note This endpoint updates only the main applicant record.
 *       Related records (education, work history, etc.) should be updated through separate endpoints.
 */
router.put("/:id", ApplicantTrackingController.updateApplicant);

/**
 * @route DELETE /:id
 * @description Delete an applicant and all related records
 * @access Public/Private (depends on your auth middleware)
 * @param {string} req.params.id - Applicant ID
 * @returns {Object} 200 - Success message
 * @returns {Object} 404 - Applicant not found
 * @returns {Object} 500 - Internal server error
 * @note This will cascade delete all related records (education, work history, interviews, languages, management)
 */
router.delete("/:id", ApplicantTrackingController.deleteApplicant);

module.exports = router;
