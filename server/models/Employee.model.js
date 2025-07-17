// =================== models/Employee.model.js (Main Model - Unchanged) ===================
/**
 * Main Employee Model - Core fields from ApplicantTracking + essential employee fields
 */
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "Employee",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      // reference from ApplicantTracking table
      applicant_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: "Reference to ApplicantTracking table",
      },
      employee_id: {
        type: DataTypes.INTEGER(50),
        allowNull: true,
        unique: true,
      },
      // reference from EmployeeDetails table
      employeeDetails_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        comment: "Reference to EmployeeDetails table",
      },

      // === CORE FIELDS FROM APPLICANT TRACKING ===
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      father_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      surname: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: [0, 100],
        },
      },
      address_1: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      address_2: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      address_3: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      mobile_no_1: {
        type: DataTypes.STRING(15),
        allowNull: false,
        validate: {
          isNumeric: true,
          len: [10, 15],
        },
      },
      mobile_no_2: {
        type: DataTypes.STRING(15),
        allowNull: false,
        validate: {
          isNumeric: true,
          len: [10, 15],
        },
      },
      whatsapp_no: {
        type: DataTypes.STRING(15),
        allowNull: true,
        validate: {
          isNumeric: true,
          len: [10, 15],
        },
      },
      email_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: false,
      },
      driving_license: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: "true = Yes, false = No",
      },
      cast: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      marital_status: {
        type: DataTypes.ENUM("married", "unmarried"),
        allowNull: true,
      },
      major_surgery_or_allergy_or_illness: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: "true = Yes, false = No",
      },
      work_with_sunchaser: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: "true = Yes, false = No",
      },

      family_work_with_sunchaser: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: "true = Yes, false = No",
      },
      language_id: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Reference to Language table",
      },
      strength: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      weakness: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      notice_period: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      probation_period: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      expected_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      offered_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      date_of_joining: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      is_shift_residence: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: "true = Yes, false = No",
      },
      education_id: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Reference to applicant education table",
      },
      work_id: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Reference to applicant work history table",
      },
      reference_employee_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: "Employee who referred this applicant",
      },
      hiring_source_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      previous_salary_slip: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: "true = Yes, false = No",
      },

      // === ESSENTIAL EMPLOYEE FIELDS ===
      date_of_joining: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      designation: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      employment_status: {
        type: DataTypes.ENUM(
          "Active",
          "Inactive",
          "On Leave",
          "Terminated",
          "Resigned"
        ),
        allowNull: false,
        defaultValue: "Active",
      },
    },
    {
      tableName: "Employee",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: "employee_id_unique_idx",
          unique: true,
          fields: ["employee_id"],
        },
        {
          name: "applicant_id_idx",
          fields: ["applicant_id"],
        },
        {
          name: "email_unique_idx",
          unique: true,
          fields: ["email_id"],
        },
        {
          name: "department_idx",
          fields: ["department"],
        },
        {
          name: "designation_idx",
          fields: ["designation"],
        },
        {
          name: "employment_status_idx",
          fields: ["employment_status"],
        },
      ],
    }
  );

  Employee.associate = (models) => {
    // Association with ApplicantTracking
    Employee.belongsTo(models.ApplicantTracking, {
      foreignKey: "applicant_id",
      as: "applicant",
      onDelete: "CASCADE",
    });

    // Association with merged EmployeeDetails
    Employee.hasOne(models.EmployeeDetails, {
      foreignKey: "employeeDetails_id",
      as: "employeeDetails",
      onDelete: "CASCADE",
    });

    // Self-referencing association for reference employee
    Employee.belongsTo(models.Employee, {
      foreignKey: "reference_employee_id",
      as: "referenceEmployee",
      constraints: false,
    });

    // if (models.Language) {
    //   Employee.belongsTo(models.Language, {
    //     foreignKey: "language_id",
    //     as: "language",
    //     constraints: false,
    //   });
    // }
  };

  return Employee;
};
