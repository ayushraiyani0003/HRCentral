const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const ShoesAddLess = sequelize.define(
        "ShoesAddLess",
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
            shoes_add: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            shoes_less: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            tshirt_less: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            month_year: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    is: /^\d{4}-\d{2}$/i, // Format: YYYY-MM
                },
            },
            issue_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            tableName: "shoes_add_less",
            timestamps: true,
            underscored: true,
        }
    );

    return ShoesAddLess;
};
