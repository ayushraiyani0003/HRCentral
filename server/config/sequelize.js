const { Sequelize } = require("sequelize");
const dbConfig = require("./database");

// Create Sequelize instances for both databases
const hrSequelize = new Sequelize(
    dbConfig.hrDatabase.database,
    dbConfig.hrDatabase.username,
    dbConfig.hrDatabase.password,
    {
        host: dbConfig.hrDatabase.host,
        dialect: dbConfig.hrDatabase.dialect,
        port: dbConfig.hrDatabase.port,
        logging: dbConfig.hrDatabase.logging,
        pool: dbConfig.hrDatabase.pool,
    }
);

const employeeSequelize = new Sequelize(
    dbConfig.employeeDatabase.database,
    dbConfig.employeeDatabase.username,
    dbConfig.employeeDatabase.password,
    {
        host: dbConfig.employeeDatabase.host,
        dialect: dbConfig.employeeDatabase.dialect,
        port: dbConfig.employeeDatabase.port,
        logging: dbConfig.employeeDatabase.logging,
        pool: dbConfig.employeeDatabase.pool,
    }
);

// Test the connections
const testConnections = async () => {
    try {
        await hrSequelize.authenticate();
        console.log(
            "HR Database connection has been established successfully."
        );

        await employeeSequelize.authenticate();
        console.log(
            "Employee Database connection has been established successfully."
        );
    } catch (error) {
        console.error("Unable to connect to the databases:", error);
    }
};

// Export the sequelize instances and test connection function
module.exports = {
    hrSequelize,
    employeeSequelize,
    testConnections,
};
