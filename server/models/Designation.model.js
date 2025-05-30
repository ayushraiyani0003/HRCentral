// =================== models/Designation.model.js ===================
module.exports = (sequelize, DataTypes) => {
    const Designation = sequelize.define(
        "Designation",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(150),
                allowNull: false,
                unique: true,
            },
        },
        {
            tableName: "Designations",
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

    Designation.associate = (models) => {
        // Add associations here when needed
    };

    return Designation;
};
