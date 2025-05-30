// =================== models/JobLocation.model.js ===================
module.exports = (sequelize, DataTypes) => {
    const JobLocation = sequelize.define(
        "JobLocation",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
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
            tableName: "JobLocations",
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
