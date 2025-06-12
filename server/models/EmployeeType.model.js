// =================== models/EmployeeType.model.js ===================
module.exports = (sequelize, DataTypes) => {
    const EmployeeType = sequelize.define(
        "EmployeeType",
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
            tableName: "EmployeeTypes",
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

    EmployeeType.associate = (models) => {
        // Add associations here when needed
    };

    return EmployeeType;
};
