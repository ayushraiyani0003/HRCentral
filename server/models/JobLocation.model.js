// =================== models/JobLocation.model.js ===================
module.exports = (sequelize, DataTypes) => {
    const JobLocation = sequelize.define(
        "JobLocation",
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
        },
        {
            tableName: "JobLocation",
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

    JobLocation.associate = (models) => {
        // Add associations here when needed
    };

    return JobLocation;
};
