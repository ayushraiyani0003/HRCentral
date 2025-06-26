// =================== services/Skill.service.js ===================
const { Skill } = require("../../models");
const { Op } = require("sequelize");

class SkillService {
    /**
     * Create a new skill
     * @param {Object} skillData - Skill data
     * @returns {Promise<Object>} Created skill
     */
    async create(skillData) {
        try {
            const skill = await Skill.create(skillData);
            return {
                success: true,
                data: skill,
                message: "Skill created successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to create skill",
            };
        }
    }

    /**
     * Get all skills
     * @param {Object} options - Query options (limit, offset, search)
     * @returns {Promise<Object>} List of skills
     */
    async getAll(options = {}) {
        try {
            const { limit = 10, offset = 0, search = "" } = options;

            const whereClause = search
                ? {
                      name: { [Op.like]: `%${search}%` },
                  }
                : {};

            const { count, rows } = await Skill.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [["name", "ASC"]],
            });

            return {
                success: true,
                data: {
                    skills: rows,
                    pagination: {
                        total: count,
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                        pages: Math.ceil(count / limit),
                    },
                },
                message: "Skills retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve skills",
            };
        }
    }

    /**
     * Get skill by ID
     * @param {number} id - Skill ID
     * @returns {Promise<Object>} Skill data
     */
    async getById(id) {
        try {
            const skill = await Skill.findByPk(id);

            if (!skill) {
                return {
                    success: false,
                    message: "Skill not found",
                };
            }

            return {
                success: true,
                data: skill,
                message: "Skill retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve skill",
            };
        }
    }

    /**
     * Update skill
     * @param {number} id - Skill ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated skill
     */
    async update(id, updateData) {
        try {
            const skill = await Skill.findByPk(id);

            if (!skill) {
                return {
                    success: false,
                    message: "Skill not found",
                };
            }

            await skill.update(updateData);

            return {
                success: true,
                data: skill,
                message: "Skill updated successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to update skill",
            };
        }
    }

    /**
     * Delete skill
     * @param {number} id - Skill ID
     * @returns {Promise<Object>} Deletion result
     */
    async delete(id) {
        try {
            const skill = await Skill.findByPk(id);

            if (!skill) {
                return {
                    success: false,
                    message: "Skill not found",
                };
            }

            await skill.destroy();

            return {
                success: true,
                message: "Skill deleted successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to delete skill",
            };
        }
    }

    /**
     * Bulk create skills
     * @param {Array} skillsData - Array of skill data
     * @returns {Promise<Object>} Created skills
     */
    async bulkCreate(skillsData) {
        try {
            const skills = await Skill.bulkCreate(skillsData, {
                ignoreDuplicates: true,
                returning: true,
            });

            return {
                success: true,
                data: skills,
                message: "Skills created successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to create skills",
            };
        }
    }
}

module.exports = new SkillService();
