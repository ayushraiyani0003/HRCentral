const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const PfInfo = sequelize.define(
        "PfInfo",
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
            is_pf: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            tableName: "pf_info",
            timestamps: true,
            underscored: true,
        }
    );

    return PfInfo;
};
