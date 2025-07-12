/**
 * Management Model
 * Represents interview information and details in the system
 *
 * @param {Object} sequelize - Sequelize instance
 * @param {Object} DataTypes - Sequelize data types
 * @returns {Object} Management model
 */

module.exports = (sequelize, DataTypes) => {
    const Management = sequelize.define(
        "Management",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
        },
        {
            tableName: "Management",
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    name: "name_idx",
                    fields: ["name"],
                },
            ],
        }
    );

    return Management;
};
