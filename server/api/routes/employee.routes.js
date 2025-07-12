/**
 * @fileoverview Express router for Employee Management System
 * @module routes/employee
 * @requires express
 * @requires ../controllers/Employee.controller
 */

const express = require("express");
const router = express.Router();
const EmployeeController = require("../controllers/Employee.controller");

/**
 * @route POST /
 * @description Create a new employee
 * @access Public/Private (depends on your auth middleware)
 * @param {Object} req.body - Employee data
 * @param {string} req.body.name - Employee's full name
 * @param {string} req.body.email - Employee's email address
 * @param {string} req.body.phone - Employee's phone number
 * @param {string} req.body.position - Employee's position
 * @param {string} [req.body.department] - Employee's department
 * @param {Object} [req.body.languageData] - Language data object
 * @param {Object} [req.body.educationData] - Education data object
 * @param {Object} [req.body.workHistoryData] - Work history data object
 * @param {Object} [req.body.referenceEmployeeData] - Reference employee data object
 * @param {string} [req.body.hiring_source_id] - Hiring source ID
 * @returns {Object} 201 - Created employee object
 * @returns {Object} 400 - Bad request error
 * @returns {Object} 500 - Internal server error
 */
router.post("/", EmployeeController.createEmployee);

/**
 * @route GET /
 * @description Get all employees with optional filtering and pagination
 * @access Public/Private (depends on your auth middleware)
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of records per page
 * @param {string} [req.query.status] - Filter by employee status
 * @param {string} [req.query.position] - Filter by position
 * @param {string} [req.query.department] - Filter by department
 * @param {string} [req.query.search] - Search term for name or email
 * @returns {Object} 200 - Array of employee objects with pagination info
 * @returns {Object} 500 - Internal server error
 */
router.get("/", EmployeeController.getAllEmployees);

/**
 * @route GET /:id
 * @description Get a single employee by ID
 * @access Public/Private (depends on your auth middleware)
 * @param {string} req.params.id - Employee ID
 * @returns {Object} 200 - Employee object
 * @returns {Object} 404 - Employee not found
 * @returns {Object} 500 - Internal server error
 */
router.get("/:id", EmployeeController.getEmployeeById);

/**
 * @route PUT /:id
 * @description Update an employee's information completely
 * @access Public/Private (depends on your auth middleware)
 * @param {string} req.params.id - Employee ID
 * @param {Object} req.body - Updated employee data
 * @param {string} req.body.name - Employee's full name
 * @param {string} req.body.email - Employee's email address
 * @param {string} req.body.phone - Employee's phone number
 * @param {string} req.body.position - Employee's position
 * @param {string} [req.body.department] - Employee's department
 * @param {Object} [req.body.languageData] - Language data object
 * @param {Object} [req.body.educationData] - Education data object
 * @param {Object} [req.body.workHistoryData] - Work history data object
 * @param {Object} [req.body.referenceEmployeeData] - Reference employee data object
 * @param {string} [req.body.hiring_source_id] - Hiring source ID
 * @returns {Object} 200 - Updated employee object
 * @returns {Object} 400 - Bad request error
 * @returns {Object} 404 - Employee not found
 * @returns {Object} 500 - Internal server error
 */
router.put("/:id", EmployeeController.updateEmployee);

/**
 * @route DELETE /:id
 * @description Delete an employee
 * @access Public/Private (depends on your auth middleware)
 * @param {string} req.params.id - Employee ID
 * @returns {Object} 200 - Success message
 * @returns {Object} 404 - Employee not found
 * @returns {Object} 500 - Internal server error
 */
router.delete("/:id", EmployeeController.deleteEmployee);

module.exports = router;

// Todo: one routes for make a employee from the applicant.
// Todo: applicant data transfer into the employee table.
//
