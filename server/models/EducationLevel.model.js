// =================== models/EducationLevel.model.js ===================
module.exports = (sequelize, DataTypes) => {
    const EducationLevel = sequelize.define(
        "EducationLevel",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
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
            tableName: "EducationLevels",
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

    EducationLevel.associate = (models) => {
        // Add associations here when needed
    };

    return EducationLevel;
};
