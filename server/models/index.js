// server/models/index.js
const { hrDb, employeeDb } = require("../config/db");

// Import HR models
const hrModels = require("./hrModels");

// Import Employee models
const employeeModels = require("./employeeModels");

// Define associations between HR models and Employee models
// For example:
// hrModels.GrossSalary.belongsTo(employeeModels.Employee, {
//   foreignKey: 'employee_id',
//   targetKey: 'employee_id',
//   constraints: false // To allow cross-database relationship without foreign key constraint
// });

// Setup all models and their relationships for both databases
const models = {
    // HR models
    GrossSalary: hrModels.GrossSalary,
    NetOtHrSalary: hrModels.NetOtHrSalary,
    FestivalTourHrSalary: hrModels.FestivalTourHrSalary,
    PendingHrSalary: hrModels.PendingHrSalary,
    TotalHrSalary: hrModels.TotalHrSalary,
    Expense: hrModels.Expense,
    AllDeduction: hrModels.AllDeduction,
    TotalEarningDeduct: hrModels.TotalEarningDeduct,
    NetTotalPay: hrModels.NetTotalPay,
    SlipInfo: hrModels.SlipInfo,

    // Employee models
    Employee: employeeModels.Employee,
};

module.exports = {
    ...models,
    hrDb,
    employeeDb,
};
