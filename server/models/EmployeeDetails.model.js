// =================== models/EmployeeDetails.model.js (Merged Model) ===================
/**
 * Employee Details Model - Merged from EmployeeDetails, EmployeePayroll, EmployeeDocuments, and EmployeeSystem
 * Contains all additional employee information in a single table
 */
module.exports = (sequelize, DataTypes) => {
  const EmployeeDetails = sequelize.define(
    "EmployeeDetails",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      punch_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
      },

      // ====================== PERSONAL DETAILS SECTION ======================
      middle_name: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      mother_name: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      spouse_name: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      height: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      weight: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      blood_group: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      nationality: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      // === ADDRESS DETAILS ===
      city: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      postal_code: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      country_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      residence_no: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      residence_name: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      // === LOCAL ADDRESS ===
      local_address_1: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      local_address_2: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      local_address_3: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      local_city: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      local_state: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      local_pincode: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      local_country: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      local_residence_no: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      local_residence_name: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      // === EMERGENCY CONTACT ===
      emergency_contact_name: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      emergency_contact_phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      emergency_contact_relation: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      // === NOMINEE DETAILS ===
      nominee: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      nominee_relation: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      // === MISCELLANEOUS ===
      medical_history: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      previous_experience: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      resign_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      reason_for_leaving: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      // ====================== PAYROLL SECTION ======================
      // === SALARY DETAILS ===
      salary_calculate_from: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      salary_structure: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      attendance: {
        type: DataTypes.ENUM("Daily", "Monthly"),
        allowNull: true,
      },

      // === BANK DETAILS ===
      // reference from bank table
      Bank_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        comment: "Reference from bank list table",
      },
      employee_name_as_per_bank: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      account_number: {
        type: DataTypes.BIGINT, // integer is not working
        allowNull: true,
      },
      ifsc_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      bank_account_status: {
        type: DataTypes.ENUM("Old", "New"),
        allowNull: true,
      },

      // === PF DETAILS ===
      pf_applicable: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: "true = Yes, false = No",
      },
      pf_no: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      pf_no_for_department_file: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      uan_no: {
        type: DataTypes.BIGINT, // integer is not working
        allowNull: true,
      },
      restrict_pf: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      zero_pension: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      zero_pt: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      // === ESI DETAILS ===
      esi_applicable: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      esi_no: {
        type: DataTypes.BIGINT, // integer is not working
        allowNull: true,
      },
      esi_dispensary: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      // === FACILITIES ===
      canteen: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: "true = Yes, false = No",
      },
      bike_bus_quarter: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      bus_name: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      quarter_no: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      // ====================== DOCUMENTS SECTION ======================
      // === GOVERNMENT IDs ===
      adhaar_number: {
        type: DataTypes.BIGINT, // integer is not working
        allowNull: true,
      },
      pan_number: {
        type: DataTypes.BIGINT, // integer is not working
        allowNull: true,
      },
      voter_id: {
        type: DataTypes.BIGINT, // integer is not working
      },

      // === PASSPORT & VISA ===
      passport_no: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      passport_expiry: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      visa_no: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      visa_expiry: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      // === DRIVING LICENSE ===
      driving_license_expiry: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      // ====================== SYSTEM SECTION ======================
      // === SYSTEM FIELDS ===
      Rejoinee: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      previous_employee_id: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      salutation_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: "reference from salutation table",
      },
      employee_user_name: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      short_name: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      // === ORGANIZATIONAL STRUCTURE ===
      module_flag: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      occupation: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      grade: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      division: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      organization: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      organization_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      section: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      section_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      grade_matrix: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      grade_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      branch: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      // === SCHEDULE & GROUPS ===
      schedule_group: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      schedule_group_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      start_shift: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      report_group: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      report_group_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      leave_group: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      leave_group_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      week_off_group: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      week_off_group_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      // === CUSTOM GROUPS ===
      custom_group_id_1: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      custom_group_id_2: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      custom_group_id_3: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      // === CONTACT & COMMUNICATION ===
      official_phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      official_email_id: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      std_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      // === SYSTEM CONFIGS ===
      integration_reference: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      approval_policy_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      pin: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      card_1: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      card_2: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      ward_circle: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      director: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      vehicle_registration_no: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },

      // === CUSTOM FIELDS ===
      field_1: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      field_2: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      field_3: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      field_4: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      field_5: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      field_6: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      field_7: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      field_8: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      field_9: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      field_10: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "EmployeeDetails",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: "adhaar_number_idx",
          fields: ["adhaar_number"],
        },
        {
          name: "pan_number_idx",
          fields: ["pan_number"],
        },
        {
          name: "account_number_idx",
          fields: ["account_number"],
        },
        {
          name: "pf_no_idx",
          fields: ["pf_no"],
        },
        {
          name: "esi_no_idx",
          fields: ["esi_no"],
        },
        {
          name: "organization_id_idx",
          fields: ["organization_id"],
        },
        {
          name: "branch_id_idx",
          fields: ["branch_id"],
        },
        {
          name: "schedule_group_id_idx",
          fields: ["schedule_group_id"],
        },
      ],
    }
  );

  EmployeeDetails.associate = (models) => {
    // reference from Country table
    EmployeeDetails.belongsTo(models.Country, {
      foreignKey: "country_id",
      as: "countryName",
      constraints: false,
    });
  };
  EmployeeDetails.associate = (models) => {
    // reference from BankList table
    EmployeeDetails.belongsTo(models.BankList, {
      foreignKey: "bank_id",
      as: "bankName",
      constraints: false,
    });
  };
  EmployeeDetails.associate = (models) => {
    // Self-referencing association for reference employee
    EmployeeDetails.belongsTo(models.Salutation, {
      foreignKey: "salutation_id",
      as: "salutationName",
      constraints: false,
    });
  };
  return EmployeeDetails;
};
