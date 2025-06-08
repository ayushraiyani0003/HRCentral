// =================== models/Country.model.js ===================
module.exports = (sequelize, DataTypes) => {
    const Country = sequelize.define(
        "Country",
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
            code: {
                type: DataTypes.STRING(2),
                allowNull: false,
                unique: true,
                validate: {
                    len: [2, 2], // ISO 3166-1 alpha-2 code (2 characters)
                    isUppercase: true,
                },
            },
            phone_code: {
                type: DataTypes.STRING(10),
                allowNull: false,
                validate: {
                    is: /^\+\d{1,4}$/, // Format: +1, +91, +971, etc.
                },
            },
            region: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
        },
        {
            tableName: "Countries",
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    name: "country_code_unique_idx",
                    unique: true,
                    fields: ["code"],
                },
                {
                    name: "country_name_idx",
                    fields: ["name"],
                },
                {
                    name: "region_idx",
                    fields: ["region"],
                },
            ],
        }
    );

    // Define associations
    Country.associate = (models) => {
        // Add associations here when needed
        // Example: Country.hasMany(models.CompanyStructure, { foreignKey: 'country_code', sourceKey: 'code' });
    };

    return Country;
};
