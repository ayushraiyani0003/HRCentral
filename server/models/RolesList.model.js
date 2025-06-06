// =================== models/RolesList.model.js ===================
module.exports = (sequelize, DataTypes) => {
    const RolesList = sequelize.define(
        "RolesList",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(200),
                allowNull: false,
                unique: true,
            },
            permissions: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: {},
            },
        },
        {
            tableName: "RolesList",
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

    RolesList.associate = (models) => {
        // Add associations here when needed
    };

    return RolesList;
};
