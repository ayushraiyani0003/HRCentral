// =================== models/CompanyStructure.model.js ===================
module.exports = (sequelize, DataTypes) => {
    const CompanyStructure = sequelize.define(
        "CompanyStructure",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            structure_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                unique: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            details: {
                type: DataTypes.TEXT, // rich text input
                allowNull: false,
            },
            address: {
                type: DataTypes.TEXT, // optional rich text
                allowNull: true,
            },
            type: {
                type: DataTypes.ENUM(
                    "company",
                    "head office",
                    "branch",
                    "department",
                    "unit",
                    "subUnit",
                    "division",
                    "other"
                ),
                allowNull: false,
            },
            country_id: {
                type: DataTypes.UUID,
                allowNull: false,
                // Remove references - will be handled in associations
            },
            parent_id: {
                type: DataTypes.UUID,
                allowNull: true,
                // Remove references - will be handled in associations
            },
            head: {
                type: DataTypes.INTEGER,
                allowNull: true,
                // Remove references - will be handled in associations or when Employee model exists
            },
        },
        {
            tableName: "CompanyStructures",
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    name: "name_type_idx",
                    fields: ["name", "type"],
                },
                {
                    name: "structure_id_unique_idx",
                    unique: true,
                    fields: ["structure_id"],
                },
                {
                    name: "parent_id_idx",
                    fields: ["parent_id"],
                },
                {
                    name: "country_id_idx",
                    fields: ["country_id"],
                },
            ],
        }
    );

    // Define associations
    CompanyStructure.associate = (models) => {
        // Self-referencing relationship for parent-child hierarchy
        CompanyStructure.belongsTo(models.CompanyStructure, {
            foreignKey: "parent_id",
            as: "parent",
            constraints: false, // Disable foreign key constraint for self-reference
        });

        CompanyStructure.hasMany(models.CompanyStructure, {
            foreignKey: "parent_id",
            as: "children",
            constraints: false, // Disable foreign key constraint for self-reference
        });

        // Country association
        // id is in character two later, like "IN", "US" etc.
        if (models.Country) {
            CompanyStructure.belongsTo(models.Country, {
                foreignKey: "country_id",
                as: "country",
                constraints: false, // Disable until Country table is created
            });
        }

        // Only define Employee association if Employee model exists
        if (models.Employee) {
            CompanyStructure.belongsTo(models.Employee, {
                foreignKey: "head",
                as: "head_employee",
                constraints: false, // Disable until Employee table is created
            });
        }
    };

    return CompanyStructure;
};
