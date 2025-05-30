// =================== models/index.js ===================
const { Sequelize } = require("sequelize");
const { sequelize } = require("../config/db");

const models = {};

// Import model definitions
const CompanyStructureModel = require("./CompanyStructure.model");
const ManPowerRequisitionModel = require("./ManPowerRequisition.model");
const EmployeeTypeModel = require("./EmployeeType.model");
const ExperienceLevelModel = require("./ExperienceLevel.model");
const DesignationModel = require("./Designation.model");
const EducationLevelModel = require("./EducationLevel.model");
const JobLocationModel = require("./JobLocation.model");
const HiringSourceModel = require("./HiringSource.model");
const WorkShiftModel = require("./WorkShift.model");
const SkillModel = require("./Skill.model");

// const EmployeeModel = require("./Employee.model"); // Add when ready

// Initialize models - pass sequelize instance and DataTypes
models.CompanyStructure = CompanyStructureModel(sequelize, Sequelize.DataTypes);
models.ManPowerRequisition = ManPowerRequisitionModel(
    sequelize,
    Sequelize.DataTypes
);

models.EmployeeType = EmployeeTypeModel(sequelize, Sequelize.DataTypes);
models.ExperienceLevel = ExperienceLevelModel(sequelize, Sequelize.DataTypes);
models.Designation = DesignationModel(sequelize, Sequelize.DataTypes);
models.EducationLevel = EducationLevelModel(sequelize, Sequelize.DataTypes);
models.JobLocation = JobLocationModel(sequelize, Sequelize.DataTypes);
models.HiringSource = HiringSourceModel(sequelize, Sequelize.DataTypes);
models.WorkShift = WorkShiftModel(sequelize, Sequelize.DataTypes);
models.Skill = SkillModel(sequelize, Sequelize.DataTypes);

// models.Employee = EmployeeModel(sequelize, Sequelize.DataTypes); // Add when ready

// Setup associations after all models are loaded
Object.values(models)
    .filter((model) => typeof model.associate === "function")
    .forEach((model) => model.associate(models));

// Add sequelize instance and constructor to models object
models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
