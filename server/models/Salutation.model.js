module.exports = (sequelize, DataTypes) => {
    const Salutation = sequelize.define(
        "Salutation",
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
            tableName: "Salutation",
            timestamps: true,
            underscored: true,
        }
    );

    return Salutation;
};
