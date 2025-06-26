const WorkShiftService = require("../../services/api/WorkShift.service");

class WorkShiftController {
    async create(req, res) {
        const result = await WorkShiftService.create(req.body);
        return res.status(result.success ? 201 : 400).json(result);
    }

    async getAll(req, res) {
        const { limit, offset, search } = req.query;
        const result = await WorkShiftService.getAll({ limit, offset, search });
        return res.status(result.success ? 200 : 500).json(result);
    }

    async getById(req, res) {
        const { id } = req.params;
        const result = await WorkShiftService.getById(id);
        return res.status(result.success ? 200 : 404).json(result);
    }

    async update(req, res) {
        const { id } = req.params;
        const result = await WorkShiftService.update(id, req.body);
        return res.status(result.success ? 200 : 400).json(result);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await WorkShiftService.delete(id);
        return res.status(result.success ? 200 : 404).json(result);
    }

    async checkOverlap(req, res) {
        const { start_time, end_time, exclude_id } = req.query;
        const result = await WorkShiftService.checkOverlap(
            start_time,
            end_time,
            exclude_id
        );
        return res.status(result.success ? 200 : 500).json(result);
    }
}

module.exports = new WorkShiftController();
