const EducationLevelService = require("../../services/api/EducationLevel.service");

class EducationLevelController {
    async create(req, res) {
        const result = await EducationLevelService.createEducationLevel(
            req.body
        );
        if (result.success) {
            return res.status(201).json(result.data);
        }
        return res.status(400).json({ error: result.error });
    }

    async getAll(req, res) {
        const { page, limit } = req.query;
        const result = await EducationLevelService.getAllEducationLevels({
            page: parseInt(page),
            limit: parseInt(limit),
        });
        if (result.success) {
            return res.json(result.data);
        }
        return res.status(500).json({ error: result.error });
    }

    async getById(req, res) {
        const { id } = req.params;
        const result = await EducationLevelService.getEducationLevelById(id);
        if (result.success) {
            return res.json(result.data);
        }
        return res.status(404).json({ error: result.error });
    }

    async update(req, res) {
        const { id } = req.params;
        const result = await EducationLevelService.updateEducationLevel(
            id,
            req.body
        );
        if (result.success) {
            return res.json(result.data);
        }
        return res.status(400).json({ error: result.error });
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await EducationLevelService.deleteEducationLevel(id);
        if (result.success) {
            return res.json({ message: result.message });
        }
        return res.status(404).json({ error: result.error });
    }

    async search(req, res) {
        const { q } = req.query;

        const result = await EducationLevelService.searchEducationLevels(
            q || ""
        );
        if (result.success) {
            return res.json(result.data);
        }
        return res.status(500).json({ error: result.error });
    }
}

module.exports = new EducationLevelController();
