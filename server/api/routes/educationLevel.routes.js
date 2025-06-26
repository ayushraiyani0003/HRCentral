const express = require("express");
const router = express.Router();
const EducationLevelController = require("../controllers/EducationLevel.controller");

// POST /api/education-level
router.post("/", EducationLevelController.create);

// GET /api/education-level
router.get("/", EducationLevelController.getAll);

// GET /api/education-level/search?q=term
router.get("/search", EducationLevelController.search);

// GET /api/education-level/:id
router.get("/:id", EducationLevelController.getById);

// PUT /api/education-level/:id
router.put("/:id", EducationLevelController.update);

// DELETE /api/education-level/:id
router.delete("/:id", EducationLevelController.delete);

module.exports = router;
