const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const DeductionAdd = sequelize.define(
        "DeductionAdd",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            deduction_name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            type: {
                type: DataTypes.ENUM("add_and_less", "less"),
                allowNull: false,
            },
            amount: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            tableName: "deduction_add",
            timestamps: true,
            underscored: true,
            hooks: {
                afterCreate: async (deduction, options) => {
                    try {
                        // Add column for deduction to AllDeduction table
                        if (deduction.type === "add_and_less") {
                            // Add both _add and _less columns if type is 'add_and_less'
                            await sequelize
                                .getQueryInterface()
                                .addColumn(
                                    "expense",
                                    `${deduction.deduction_name}_add`,
                                    {
                                        type: DataTypes.FLOAT,
                                        allowNull: true,
                                        defaultValue: 0,
                                    }
                                );
                            await sequelize
                                .getQueryInterface()
                                .addColumn(
                                    "all_deduction",
                                    `${deduction.deduction_name}_less`,
                                    {
                                        type: DataTypes.FLOAT,
                                        allowNull: true,
                                        defaultValue: 0,
                                    }
                                );
                        } else {
                            // Only add _less column if type is 'less'
                            await sequelize
                                .getQueryInterface()
                                .addColumn(
                                    "all_deduction",
                                    `${deduction.deduction_name}_less`,
                                    {
                                        type: DataTypes.FLOAT,
                                        allowNull: true,
                                        defaultValue: 0,
                                    }
                                );
                        }
                    } catch (error) {
                        console.error("Error adding column:", error);
                    }
                },
            },
        }
    );

    return DeductionAdd;
};
