// =================== routes/EmployeeType.routes.js ===================

const express = require("express");
const router = express.Router();
const employeeTypeController = require("../controllers/EmployeeType.controller"); // Adjust path as needed

/**
 * @route   POST /api/employee-types
 * @desc    Create a new employee type
 * @access  Private (add authentication middleware as needed)
 * @body    { name: string }
 */
router.post("/", employeeTypeController.createEmployeeType);

/**
 * @route   GET /api/employee-types
 * @desc    Get all employee types
 * @access  Private (add authentication middleware as needed)
 */
router.get("/", employeeTypeController.getAllEmployeeTypes);

/**
 * @route   GET /api/employee-types/:id
 * @desc    Get employee type by ID
 * @access  Private (add authentication middleware as needed)
 * @param   id - UUID of the employee type
 */
router.get("/:id", employeeTypeController.getEmployeeTypeById);

/**
 * @route   PUT /api/employee-types/:id
 * @desc    Update employee type by ID
 * @access  Private (add authentication middleware as needed)
 * @param   id - UUID of the employee type
 * @body    { name: string }
 */
router.put("/:id", employeeTypeController.updateEmployeeType);

/**
 * @route   DELETE /api/employee-types/:id
 * @desc    Delete employee type by ID
 * @access  Private (add authentication middleware as needed)
 * @param   id - UUID of the employee type
 */
router.delete("/:id", employeeTypeController.deleteEmployeeType);

module.exports = router;
