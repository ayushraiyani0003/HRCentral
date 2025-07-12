/**
 * @fileoverview Express routes for AssetTypeController
 * @version 1.0.0
 */

const express = require("express");
const router = express.Router();
const AssetTypeController = require("../controllers/AssetType.controller"); // Adjust path as necessary

// ==============================
// Routes for Asset Type Management
// ==============================

// the base route is /api/asset-type

/**
 * @route POST /api/asset-type
 * @desc Create a new asset type
 */
router.post("/", AssetTypeController.createAssetType);

/**
 * @route GET /api/asset-type
 * @desc Get all asset type (supports pagination, filtering, search)
 * @query {number} limit - Number of records to return (default: 10)
 * @query {number} offset - Number of records to skip (default: 0)
 * @query {string} orderBy - Field to order by (default: createdAt)
 * @query {string} orderDirection - Order direction ASC/DESC (default: DESC)
 */
router.get("/", AssetTypeController.getAllAssetTypes);

/**
 * @route GET /api/asset-type/:id
 * @desc Get a specific asset type by ID
 */
router.get("/:id", AssetTypeController.getAssetTypeById);

/**
 * @route PUT /api/asset-type/:id
 * @desc Update an asset type by ID
 */
router.put("/:id", AssetTypeController.updateAssetType);

/**
 * @route DELETE /api/asset-type/:id
 * @desc Delete an asset type by ID
 */
router.delete("/:id", AssetTypeController.deleteAssetType);

module.exports = router;
