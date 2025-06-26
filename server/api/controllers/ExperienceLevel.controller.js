const experienceLevelService = require("../../services/api/ExperienceLevel.service"); // Adjust path as needed

/**
 * ExperienceLevel Controller
 * Handles HTTP requests for ExperienceLevel operations
 */
class ExperienceLevelController {
    // Create a new experience level
    async createExperienceLevel(req, res) {
        const { name } = req.body;

        console.log(name);

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Experience level name is required",
            });
        }

        const result = await experienceLevelService.create({
            name: name.trim(),
        });

        return res.status(result.success ? 201 : 400).json(result);
    }

    // Get all experience levels with pagination & optional search
    async getAllExperienceLevels(req, res) {
        const { limit, offset, search } = req.query;

        const result = await experienceLevelService.getAll({
            limit,
            offset,
            search,
        });

        return res.status(result.success ? 200 : 500).json(result);
    }

    // Get experience level by ID
    async getExperienceLevelById(req, res) {
        const { id } = req.params;

        const result = await experienceLevelService.getById(id);

        return res.status(result.success ? 200 : 404).json(result);
    }

    // Update experience level by ID
    async updateExperienceLevel(req, res) {
        const { id } = req.params;
        const { name } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Experience level name is required",
            });
        }

        const result = await experienceLevelService.update(id, {
            name: name.trim(),
        });

        return res.status(result.success ? 200 : 404).json(result);
    }

    // Delete experience level by ID
    async deleteExperienceLevel(req, res) {
        const { id } = req.params;

        const result = await experienceLevelService.delete(id);

        return res.status(result.success ? 200 : 404).json(result);
    }
}

module.exports = new ExperienceLevelController();
