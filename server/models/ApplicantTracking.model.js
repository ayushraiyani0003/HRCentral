// =================== models/ApplicantTracking.model.js ===================
module.exports = (sequelize, DataTypes) => {
  const ApplicantTracking = sequelize.define(
    "ApplicantTracking",
    {
      id: {
        //required
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      application_date: {
        //required
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      position_applied: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      first_name: {
        //required
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      father_name: {
        //required
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      surname: {
        //required
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      mobile_no: {
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
        allowNull: false,
      },
      major_surgery_or_alergy_or_illness: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: "true = Yes, false = No",
      },
      work_with_sunchesar: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: "true = Yes, false = No",
      },

      family_work_with_sunchaser: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: "true = Yes, false = No",
      },
      //reference from language model, add multiple records as well
      language_id: {
        type: DataTypes.TEXT,
        allowNull: false,
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
      expected_date_of_joining: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      is_shift_residence: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: "true = Yes, false = No",
      },
      previous_salary_slip: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: "true = Yes, false = No",
      },
      // reference from education model, add multiple records as well
      education_id: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Reference to applicant education table",
      },
      //reference from work model,add multiple records as well
      work_id: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Reference to applicant work history table",
      },
      //reference from employee list model
      reference_employee_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment:
          "Employee who referred this applicant reference to employee list table",
      },
      reference_relation: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      //reference for hiring source model
      hiring_source_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      // interview ids (same as the work history models),add multiple records as well
      interview_id: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Reference to interview records table",
      },
      // Final Remarks
      final_remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Final remarks/comments about the applicant",
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "shortlisted",
          "selected",
          "rejected",
          "hired"
        ),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      tableName: "ApplicantTracking",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: "mobile_no_idx",
          fields: ["mobile_no"],
        },
        {
          name: "position_applied_idx",
          fields: ["position_applied"],
        },
        {
          name: "status_idx",
          fields: ["status"],
        },
        {
          name: "email_id_idx",
          fields: ["email_id"],
        },
        {
          name: "reference_employee_id_idx",
          fields: ["reference_employee_id"],
        },
        {
          name: "hiring_source_id_idx",
          fields: ["hiring_source_id"],
        },
        {
          name: "language_id_idx",
          fields: ["language_id"],
        },
        {
          name: "interview_ids_idx",
          fields: ["interview_id"],
        },
      ],
    }
  );

  ApplicantTracking.associate = (models) => {
    // this comments we made for remove the relational key, because use array of UUID
    // // Association with Education model
    // if (models.ApplicantEducation) {
    //     ApplicantTracking.belongsTo(models.ApplicantEducation, {
    //         foreignKey: "education_id",
    //         as: "education",
    //         onDelete: "CASCADE",
    //     });
    // }

    // // Association with Work History model
    // if (models.ApplicantWorkHistory) {
    //     ApplicantTracking.belongsTo(models.ApplicantWorkHistory, {
    //         foreignKey: "work_id",
    //         as: "workHistory",
    //         onDelete: "CASCADE",
    //     });
    // }

    // // Association with Language model
    // if (models.Language) {
    //     ApplicantTracking.belongsTo(models.Language, {
    //         foreignKey: "language_id",
    //         as: "language",
    //         constraints: false,
    //     });
    // }

    // // Association with Interview model
    // if (models.Interview) {
    //     ApplicantTracking.belongsTo(models.Interview, {
    //         foreignKey: "interview_id",
    //         as: "interviews",
    //         constraints: false,
    //     });
    // }

    // Association with Employee model (reference employee)
    if (models.Employee) {
      ApplicantTracking.belongsTo(models.Employee, {
        foreignKey: "reference_employee_id",
        as: "referenceEmployee",
        constraints: false,
      });
    }

    // Association with HiringSource model
    if (models.HiringSource) {
      ApplicantTracking.belongsTo(models.HiringSource, {
        foreignKey: "hiring_source_id",
        as: "hiringSource",
        constraints: false,
      });
    }
  };

  return ApplicantTracking;
};
