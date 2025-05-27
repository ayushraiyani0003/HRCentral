// =================== models/index.js ===================
const { Sequelize } = require("sequelize");
const { sequelize } = require("../config/db");

const models = {};

// Import model definitions
const CompanyStructureModel = require("./CompanyStructure.model");
// const EmployeeModel = require("./Employee.model"); // Add when ready

// Initialize models - pass sequelize instance and DataTypes
models.CompanyStructure = CompanyStructureModel(sequelize, Sequelize.DataTypes);
// models.Employee = EmployeeModel(sequelize, Sequelize.DataTypes); // Add when ready

// Setup associations after all models are loaded
Object.values(models)
    .filter((model) => typeof model.associate === "function")
    .forEach((model) => model.associate(models));

// Add sequelize instance and constructor to models object
models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
