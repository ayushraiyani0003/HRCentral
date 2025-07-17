module.exports = (sequelize, DataTypes) => {
  const Language = sequelize.define(
    "Language",
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
      tableName: "Language",
      timestamps: true,
      underscored: true,
    }
  );

  return Language;
};
