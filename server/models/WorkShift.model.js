// =================== models/WorkShift.model.js ===================
module.exports = (sequelize, DataTypes) => {
    const WorkShift = sequelize.define(
        "WorkShift",
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
            start_time: {
                type: DataTypes.TIME,
                allowNull: false,
            },
            end_time: {
                type: DataTypes.TIME,
                allowNull: false,
            },
        },
        {
            tableName: "WorkShift",
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

    WorkShift.associate = (models) => {
        // Add associations here when needed
    };

    return WorkShift;
};
