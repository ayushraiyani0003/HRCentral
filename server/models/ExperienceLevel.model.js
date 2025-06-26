// =================== models/ExperienceLevel.model.js ===================
module.exports = (sequelize, DataTypes) => {
    const ExperienceLevel = sequelize.define(
        "ExperienceLevel",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
        },
        {
            tableName: "ExperienceLevels",
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    name: "name_unique_idx",
                    unique: true,
                    fields: ["name"],
                },
            ],
        }
    );

    ExperienceLevel.associate = (models) => {
        // Add associations here when needed
    };

    return ExperienceLevel;
};
