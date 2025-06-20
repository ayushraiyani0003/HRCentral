module.exports = (sequelize, DataTypes) => {
    const LoanType = sequelize.define(
        "LoanType",
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
            tableName: "LoanType", // Changed to snake_case plural
            timestamps: true,
            underscored: true,
        }
    );

    return LoanType;
};
