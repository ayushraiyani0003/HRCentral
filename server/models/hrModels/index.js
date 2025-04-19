const { hrDb } = require("../../config/db");

// Import HR models
const GrossSalary = require("./grossSalary")(hrDb);
const NetOtHrSalary = require("./netOtHrSalary")(hrDb);
const FestivalTourHrSalary = require("./festivalTourHrSalary")(hrDb);
const PendingHrSalary = require("./pendingHrSalary")(hrDb);
const TotalHrSalary = require("./totalHrSalary")(hrDb);
const Expense = require("./expense")(hrDb);
const AllDeduction = require("./allDeduction")(hrDb);
const TotalEarningDeduct = require("./totalEarningDeduct")(hrDb);
const NetTotalPay = require("./netTotalPay")(hrDb);
const SlipInfo = require("./slipInfo")(hrDb);
const ExpenseAdd = require("./expenseAdd")(hrDb);
const DeductionAdd = require("./deductionAdd")(hrDb);

// Export the HR models
module.exports = {
    GrossSalary,
    NetOtHrSalary,
    FestivalTourHrSalary,
    PendingHrSalary,
    TotalHrSalary,
    Expense,
    AllDeduction,
    TotalEarningDeduct,
    NetTotalPay,
    SlipInfo,
    ExpenseAdd,
    DeductionAdd,
};
