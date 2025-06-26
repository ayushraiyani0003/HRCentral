const express = require("express");
const router = express.Router();
const skillController = require("../controllers/Skill.controller"); // Adjust the path if needed

/**
 * @route POST /api/skills
 * @desc Create a new skill
 */
router.post("/", skillController.createSkill);

/**
 * @route GET /api/skills
 * @desc Get all skills
 * @query limit, offset, search
 */
router.get("/", skillController.getAllSkills);

/**
 * @route GET /api/skills/:id
 * @desc Get a specific skill by ID
 */
router.get("/:id", skillController.getSkillById);

/**
 * @route PUT /api/skills/:id
 * @desc Update a skill by ID
 */
router.put("/:id", skillController.updateSkill);

/**
 * @route DELETE /api/skills/:id
 * @desc Delete a skill by ID
 */
router.delete("/:id", skillController.deleteSkill);

/**
 * @route POST /api/skills/bulk
 * @desc Bulk create skills
 * @body [{ name: "HTML" }, { name: "CSS" }]
 */
router.post("/bulk", skillController.bulkCreateSkills);

module.exports = router;
