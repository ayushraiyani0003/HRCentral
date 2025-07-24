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
 * @returns {Object} 201 - Created employee object
 * @returns {Object} 400 - Bad request error
 * @returns {Object} 500 - Internal server error
 */
router.post("/", EmployeeController.createEmployee);

/**
 * @route GET /
 * @description Get all employees with optional filtering and pagination
 * @access Public/Private (depends on your auth middleware)
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
