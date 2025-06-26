const skillService = require("../../services/api/Skill.service"); // Adjust the path if needed

class SkillController {
    // Create a new skill
    async createSkill(req, res) {
        try {
            const { name } = req.body;

            if (!name || name.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Skill name is required",
                });
            }

            const result = await skillService.create({ name: name.trim() });
            const status = result.success ? 201 : 400;
            res.status(status).json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Get all skills
    async getAllSkills(req, res) {
        try {
            const options = {
                limit: req.query.limit || 10,
                offset: req.query.offset || 0,
                search: req.query.search || "",
            };

            const result = await skillService.getAll(options);
            res.status(result.success ? 200 : 500).json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Get skill by ID
    async getSkillById(req, res) {
        try {
            const result = await skillService.getById(req.params.id);
            const status = result.success ? 200 : 404;
            res.status(status).json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Update skill by ID
    async updateSkill(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            if (!name || name.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Skill name is required",
                });
            }

            const result = await skillService.update(id, { name: name.trim() });
            const status = result.success ? 200 : 404;
            res.status(status).json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Delete skill by ID
    async deleteSkill(req, res) {
        try {
            const result = await skillService.delete(req.params.id);
            const status = result.success ? 200 : 404;
            res.status(status).json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Bulk create skills
    async bulkCreateSkills(req, res) {
        try {
            const skills = req.body; // Expected: [{ name: "Skill1" }, { name: "Skill2" }]
            if (!Array.isArray(skills) || skills.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "An array of skills is required",
                });
            }

            const result = await skillService.bulkCreate(skills);
            res.status(result.success ? 201 : 400).json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new SkillController();
