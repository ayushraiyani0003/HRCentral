module.exports = (sequelize, DataTypes) => {
    const BankList = sequelize.define(
        "BankList",
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
            tableName: "BankList",
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

    return BankList;
};
