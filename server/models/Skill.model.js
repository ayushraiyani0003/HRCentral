// =================== models/Skill.model.js ===================
module.exports = (sequelize, DataTypes) => {
    const Skill = sequelize.define(
        "Skill",
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
            tableName: "Skills",
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

    Skill.associate = (models) => {
        // Add associations here when needed
    };

    return Skill;
};
