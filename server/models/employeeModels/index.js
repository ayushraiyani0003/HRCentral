const { employeeDb } = require("../../config/db");

// Import Employee model
const Employee = require("./employee")(employeeDb);

// Export the Employee model
module.exports = {
    Employee,
};
