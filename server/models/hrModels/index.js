const { hrDb } = require("../../config/db");

// Import HR models
const GrossSalary = require("./grossSalary")(hrDb);
const NetOtHrSalary = require("./netOtHrSalary")(hrDb);
const FestivalTourHrSalary = require("./festivalTourHrSalary")(hrDb);
const PendingHrSalary = require("./pendingHrSalary")(hrDb);
const TotalHrSalary = require("./totalHrSalary")(hrDb);
const Expense = require("./expense")(hrDb);
const ShoesAddLess = require("./shoesAddLess")(hrDb);
const AllDeduction = require("./allDeduction")(hrDb);
const TotalEarningDeduct = require("./totalEarningDeduct")(hrDb);
const NetTotalPay = require("./netTotalPay")(hrDb);
const SlipInfo = require("./slipInfo")(hrDb);
const PfInfo = require("./pfInfo")(hrDb);

// Define associations between HR models if needed
// For example:
// TotalHrSalary.hasOne(TotalEarningDeduct, { foreignKey: 'employee_id' });
// TotalEarningDeduct.belongsTo(TotalHrSalary, { foreignKey: 'employee_id' });

// Export the HR models
module.exports = {
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
};
