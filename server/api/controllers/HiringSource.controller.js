const HiringSourceService = require("../../services/api/HiringSource.service");

class HiringSourceController {
    async create(req, res) {
        const result = await HiringSourceService.create(req.body);
        if (result.success) {
            return res.status(201).json(result);
        }
        return res.status(400).json(result);
    }

    async getAll(req, res) {
        const { limit, offset, search } = req.query;
        const result = await HiringSourceService.getAll({
            limit,
            offset,
            search,
        });
        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(500).json(result);
    }

    async getById(req, res) {
        const { id } = req.params;
        const result = await HiringSourceService.getById(id);
        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(404).json(result);
    }

    async update(req, res) {
        const { id } = req.params;
        const result = await HiringSourceService.update(id, req.body);
        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await HiringSourceService.delete(id);
        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(404).json(result);
    }
}

module.exports = new HiringSourceController();
