/**
 * @fileoverview Express routes for RolesListController
 * @version 1.0.0
 */

const express = require("express");
const router = express.Router();
const RolesListController = require("../controllers/rolesList.controller"); // Adjust path as necessary

// ==============================
// Routes for Roles Management
// ==============================

/**
 * @route POST /api/roles
 * @desc Create a new role
 */
router.post("/", RolesListController.createRole);

/**
 * @route GET /api/roles
 * @desc Get all roles (supports pagination, filtering, search)
 */
router.get("/", RolesListController.getAllRoles);

/**
 * @route GET /api/roles/:id
 * @desc Get a specific role by ID
 */
router.get("/:id", RolesListController.getRoleById);

/**
 * @route PUT /api/roles/:id
 * @desc Update a role by ID
 */
router.put("/:id", RolesListController.updateRole);

/**
 * @route DELETE /api/roles/:id
 * @desc Delete a role by ID
 */
router.delete("/:id", RolesListController.deleteRole);

module.exports = router;
