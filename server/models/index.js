// Task 1: Use the two databases - one for getting employee details and another for handling other HR-related tasks.
// gross_salary : employee_id {int forain key from employee on employee db. }
//              : gross_salary (int)
//              : month_year {varchar 2025-04}
//              : time stamp {using the serilize.}

// table2 : net_ot_hr_Salary:
//                             employee_id {int forain key from employee on employee db. }
//                             expected_hours : int
//                             net_hr : {float }
//                             net_hr_salary: {float}
//                              month_year {varchar 2025-04}
//                             time stamp {using the serilize.}
// table 3 : festival_tour_hr_Salary
//                         employee_id {int forain key from employee on employee db. }
//                         Festival_Hours {float }
//                         festival_hours_salary {float}
//                         tour_hours {float }
//                          month_year {varchar 2025-04}
//                         tour_hours_salary  {float }
//                         time stamp {using the serilize.}
// table 4: pending_hr_Salary:
//                         employee_id {int forain key from employee on employee db}
//                         pending_hr {float}
//                         pending_hr_Salary {float}
//                         month_year {varchar 2025-04}
//                         time stamp {using the serilize.}
//  table 5: total_hr_Salary:
//                         employee_id {int forain key from employee on employee db}
//                         total_hr {float}
//                         total_hr_salary {float}
//                         month_year {varchar 2025-04}
//                         time stamp {using the serilize.}

// table 6: expence
// employee_id {int forain key from employee on employee }
// Vehicel_count, Vehicel_Exp_Total , OT_Hrs_Total, OT_Hrs_Exp, Fabrication_Total, Fabrication_Exp, Zink_5_Total, Zink_5_Exp, Night_Hrs_Exp_Total, outdoor_count_Exp, outdoor_count_Exp_total, rollforming_day_count, Zink_3_Exp, Zink_3_Total, Pending_Expense, Total_Expanse, Chhol_Exp, Chhol_Total, Vehicle_Day_count, Vehicel_Exp_Total, Night_Hrs_Exp, rollforming_total, month,  time stamp {using the serilize.}
//  month_year {varchar 2025-04}

//  table 7: shoes_add_less
//     employee_id {int forain key from employee on employee }
//     shoss add {true , false}
//     shoss less {true , false}
//     TShirt_Less {true , false}
//      month_year {varchar 2025-04}
//     issue_date
//     time stamp {using the serilize.}

// table 8:  all_Deduction
//     employee_id {int forain key from employee on employee }
//     fine
//     Canteen
//     PT_amount
//     PF_amount
//     Loan_amount
//     Other_Deduction
//      month_year {varchar 2025-04}
//      time stamp {using the serilize.}
// table 9: total_Earning_deduct
//     employee_id {int forain key from employee on employee }
//     Total_Earning
//     Total_Deduction
//     month_year {varchar 2025-04}
//     time stamp {using the serilize.}

// table 10:    net_total_pay
//     employee_id {int forain key from employee on employee }
//     net_pay
//     actual_pay
//     recovery
//     month_year {varchar 2025-04}
//     time stamp {using the serilize.}

// table 11:  slip_info
//             employee_id {int forain key from employee on employee }
//             slip_file_location
//             month_year {varchar 2025-04}
//             time stamp {using the serilize.}

// table 12:   pf_info
//             employee_id {int forain key from employee on employee }
//             is_pf
//             time stamp {using the serilize.}

// can you tell how i create the models for this only make first 5 table at onece then next, all table model in seperate File, make one index file for index all models.
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
    ShoesAddLess: hrModels.ShoesAddLess,
    AllDeduction: hrModels.AllDeduction,
    TotalEarningDeduct: hrModels.TotalEarningDeduct,
    NetTotalPay: hrModels.NetTotalPay,
    SlipInfo: hrModels.SlipInfo,
    PfInfo: hrModels.PfInfo,

    // Employee models
    Employee: employeeModels.Employee,
};

module.exports = {
    ...models,
    hrDb,
    employeeDb,
};
