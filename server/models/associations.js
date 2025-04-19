/**
 * Setup for cross-database associations
 * This file configures the virtual associations between models from different databases
 */

const { Employee } = require("./employeeModels");
const {
    GrossSalary,
    NetOtHrSalary,
    FestivalTourHrSalary,
    PendingHrSalary,
    TotalHrSalary,
    Expense,
    ShoesAddLess,
    AllDeduction,
    TotalEarningDeduct,
    NetTotalPay,
    SlipInfo,
    PfInfo,
} = require("./hrModels");
const logger = require("../utils/logger");

// Setup cross-database associations
const setupAssociations = () => {
    try {
        // Set up Employee associations
        Employee.hasMany(GrossSalary, {
            foreignKey: "employee_id",
            sourceKey: "employee_id",
            constraints: false, // Important: This prevents actual foreign key creation
        });

        Employee.hasMany(NetOtHrSalary, {
            foreignKey: "employee_id",
            sourceKey: "employee_id",
            constraints: false,
        });

        Employee.hasMany(FestivalTourHrSalary, {
            foreignKey: "employee_id",
            sourceKey: "employee_id",
            constraints: false,
        });

        Employee.hasMany(PendingHrSalary, {
            foreignKey: "employee_id",
            sourceKey: "employee_id",
            constraints: false,
        });

        Employee.hasMany(TotalHrSalary, {
            foreignKey: "employee_id",
            sourceKey: "employee_id",
            constraints: false,
        });

        Employee.hasMany(Expense, {
            foreignKey: "employee_id",
            sourceKey: "employee_id",
            constraints: false,
        });

        Employee.hasMany(ShoesAddLess, {
            foreignKey: "employee_id",
            sourceKey: "employee_id",
            constraints: false,
        });

        Employee.hasMany(AllDeduction, {
            foreignKey: "employee_id",
            sourceKey: "employee_id",
            constraints: false,
        });

        Employee.hasMany(TotalEarningDeduct, {
            foreignKey: "employee_id",
            sourceKey: "employee_id",
            constraints: false,
        });

        Employee.hasMany(NetTotalPay, {
            foreignKey: "employee_id",
            sourceKey: "employee_id",
            constraints: false,
        });

        Employee.hasMany(SlipInfo, {
            foreignKey: "employee_id",
            sourceKey: "employee_id",
            constraints: false,
        });

        Employee.hasMany(PfInfo, {
            foreignKey: "employee_id",
            sourceKey: "employee_id",
            constraints: false,
        });

        // Set up HR model belongsTo associations
        GrossSalary.belongsTo(Employee, {
            foreignKey: "employee_id",
            targetKey: "employee_id",
            constraints: false,
        });

        NetOtHrSalary.belongsTo(Employee, {
            foreignKey: "employee_id",
            targetKey: "employee_id",
            constraints: false,
        });

        FestivalTourHrSalary.belongsTo(Employee, {
            foreignKey: "employee_id",
            targetKey: "employee_id",
            constraints: false,
        });

        PendingHrSalary.belongsTo(Employee, {
            foreignKey: "employee_id",
            targetKey: "employee_id",
            constraints: false,
        });

        TotalHrSalary.belongsTo(Employee, {
            foreignKey: "employee_id",
            targetKey: "employee_id",
            constraints: false,
        });

        Expense.belongsTo(Employee, {
            foreignKey: "employee_id",
            targetKey: "employee_id",
            constraints: false,
        });

        ShoesAddLess.belongsTo(Employee, {
            foreignKey: "employee_id",
            targetKey: "employee_id",
            constraints: false,
        });

        AllDeduction.belongsTo(Employee, {
            foreignKey: "employee_id",
            targetKey: "employee_id",
            constraints: false,
        });

        TotalEarningDeduct.belongsTo(Employee, {
            foreignKey: "employee_id",
            targetKey: "employee_id",
            constraints: false,
        });

        NetTotalPay.belongsTo(Employee, {
            foreignKey: "employee_id",
            targetKey: "employee_id",
            constraints: false,
        });

        SlipInfo.belongsTo(Employee, {
            foreignKey: "employee_id",
            targetKey: "employee_id",
            constraints: false,
        });

        PfInfo.belongsTo(Employee, {
            foreignKey: "employee_id",
            targetKey: "employee_id",
            constraints: false,
        });

        logger.info("Cross-database associations set up successfully");
    } catch (error) {
        logger.error("Error setting up cross-database associations", {
            error: error.message,
            stack: error.stack,
        });
    }
};

module.exports = setupAssociations;
