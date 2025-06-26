// =================== models/HiringSource.model.js ===================
module.exports = (sequelize, DataTypes) => {
    const HiringSource = sequelize.define(
        "HiringSource",
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
            tableName: "HiringSource",
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

    HiringSource.associate = (models) => {
        // Add associations here when needed
    };

    return HiringSource;
};
