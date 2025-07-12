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
const ApplicantEducation = require("./ApplicantEducation.model");
const ApplicantTracking = require("./ApplicantTracking.model");
const ApplicantWorkHistory = require("./ApplicantWorkHistory.model");
const RolesList = require("./RolesList.model");
const UserList = require("./UserList.model");
const Employee = require("./Employee.model");
const Country = require("./Country.model");
const AssetType = require("./AssetType.model");
const LoanType = require("./LoanType.model");
const Language = require("./Language.model");
const Salutation = require("./Salutation.model");
const BankList = require("./BankList.model");
const Documents = require("./Documents.model");
const Interview = require("./Interview.model");
const Management = require("./Management.model");
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
models.ApplicantEducation = ApplicantEducation(sequelize, Sequelize.DataTypes);
models.ApplicantTracking = ApplicantTracking(sequelize, Sequelize.DataTypes);
models.ApplicantWorkHistory = ApplicantWorkHistory(
    sequelize,
    Sequelize.DataTypes
);
models.RolesList = RolesList(sequelize, Sequelize.DataTypes);
models.UserList = UserList(sequelize, Sequelize.DataTypes);
models.Employee = Employee(sequelize, Sequelize.DataTypes);
models.Country = Country(sequelize, Sequelize.DataTypes);
models.AssetType = AssetType(sequelize, Sequelize.DataTypes);
models.LoanType = LoanType(sequelize, Sequelize.DataTypes);
models.Language = Language(sequelize, Sequelize.DataTypes);
models.Salutation = Salutation(sequelize, Sequelize.DataTypes);
models.BankList = BankList(sequelize, Sequelize.DataTypes);
models.Documents = Documents(sequelize, Sequelize.DataTypes);
models.Interview = Interview(sequelize, Sequelize.DataTypes);
models.Management = Management(sequelize, Sequelize.DataTypes);
// models.Employee = EmployeeModel(sequelize, Sequelize.DataTypes); // Add when ready

// Setup associations after all models are loaded
Object.values(models)
    .filter((model) => typeof model.associate === "function")
    .forEach((model) => model.associate(models));

// Add sequelize instance and constructor to models object
models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
