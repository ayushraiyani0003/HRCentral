const WorkShiftService = require("../../services/api/WorkShift.service");

class WorkShiftController {
    /**
     * Create a new work shift.
     * @param {import('express').Request} req - Express request object (expects shift data in req.body).
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<Response>} HTTP 201 on success, 400 on failure.
     */
    async create(req, res) {
        const result = await WorkShiftService.create(req.body);
        return res.status(result.success ? 201 : 400).json(result);
    }

    /**
     * Get all work shifts with optional pagination and search.
     * @param {import('express').Request} req - Express request object (query: limit, offset, search).
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<Response>} HTTP 200 on success, 500 on error.
     */
    async getAll(req, res) {
        const { limit, offset, search } = req.query;
        const result = await WorkShiftService.getAll({ limit, offset, search });
        return res.status(result.success ? 200 : 500).json(result);
    }

    /**
     * Get a specific work shift by ID.
     * @param {import('express').Request} req - Express request object (params: id).
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<Response>} HTTP 200 if found, 404 if not found.
     */
    async getById(req, res) {
        const { id } = req.params;
        const result = await WorkShiftService.getById(id);
        return res.status(result.success ? 200 : 404).json(result);
    }

    /**
     * Update a work shift by ID.
     * @param {import('express').Request} req - Express request object (params: id, body: updated data).
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<Response>} HTTP 200 on success, 400 on failure.
     */
    async update(req, res) {
        const { id } = req.params;
        const result = await WorkShiftService.update(id, req.body);
        return res.status(result.success ? 200 : 400).json(result);
    }

    /**
     * Delete a work shift by ID.
     * @param {import('express').Request} req - Express request object (params: id).
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<Response>} HTTP 200 on success, 404 if not found.
     */
    async delete(req, res) {
        const { id } = req.params;
        const result = await WorkShiftService.delete(id);
        return res.status(result.success ? 200 : 404).json(result);
    }

    /**
     * Check for overlapping work shifts based on start and end time.
     * @param {import('express').Request} req - Express request object (query: start_time, end_time, exclude_id).
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<Response>} HTTP 200 if processed, 500 on error.
     */
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
