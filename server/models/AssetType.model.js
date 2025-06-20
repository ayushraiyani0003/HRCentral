module.exports = (sequelize, DataTypes) => {
    const AssetType = sequelize.define(
        "AssetType",
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
            },
        },
        {
            tableName: "AssetType",
            timestamps: true,
            underscored: true,
        }
    );

    return AssetType;
};
