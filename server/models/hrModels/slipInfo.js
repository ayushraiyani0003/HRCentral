const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const SlipInfo = sequelize.define(
        "SlipInfo",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            employee_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            slip_file_location: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            month_year: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    is: /^\d{4}-\d{2}$/i, // Format: YYYY-MM
                },
            },
        },
        {
            tableName: "slip_info",
            timestamps: true,
            underscored: true,
        }
    );

    return SlipInfo;
};
