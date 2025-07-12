/**
 * Documents Model
 * Represents employee documents and file uploads in the system
 *
 * @param {Object} sequelize - Sequelize instance
 * @param {Object} DataTypes - Sequelize data types
 * @returns {Object} Documents model
 */
module.exports = (sequelize, DataTypes) => {
    const Documents = sequelize.define(
        "Documents",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            // Identity Documents
            pan_card: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: "PAN card document file path/URL",
            },
            aadhar_card: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: "Aadhar card document file path/URL",
            },
            passport: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: "Passport document file path/URL",
            },
            voter_id: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: "Voter ID document file path/URL",
            },
            driving_license: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: "Driving license document file path/URL",
            },
            // Banking Documents
            bank_passbook: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: "Bank passbook document file path/URL",
            },
            bank_statement: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: "Bank statement document file path/URL",
            },
            cancelled_cheque: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: "Cancelled cheque document file path/URL",
            },
            // Educational Documents
            education_certificate: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: "Graduation certificate file path/URL",
            },
            other_certificates: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment:
                    "Other educational certificates (JSON array of file paths)",
            },
            // Employment Documents
            previous_salary_slip: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: "Previous salary slip document file path/URL",
            },
            experience_letter: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: "Experience letter document file path/URL",
            },
            relieving_letter: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: "Relieving letter document file path/URL",
            },
            offer_letter: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: "Current offer letter document file path/URL",
            },
            // Personal Documents
            photo: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: "Employee photo file path/URL",
            },
            resume: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: "Employee resume file path/URL",
            },
            // Additional Documents
            medical_certificate: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: "Medical certificate file path/URL",
            },
            other_documents: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment:
                    "Other miscellaneous documents (JSON array of objects with name and file path)",
            },
            remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: "Remarks or notes about the documents",
            },
        },
        {
            tableName: "Documents",
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    name: "bank_passbook_idx",
                    fields: ["bank_passbook"],
                },
            ],
        }
    );

    // /**
    //  * Instance methods
    //  */
    // Documents.prototype.getUploadedDocuments = function () {
    //     const uploadedDocs = [];
    //     const documentFields = [
    //         "pan_card",
    //         "aadhar_card",
    //         "passport",
    //         "voter_id",
    //         "driving_license",
    //         "bank_passbook",
    //         "bank_statement",
    //         "cancelled_cheque",
    //         "tenth_certificate",
    //         "twelfth_certificate",
    //         "graduation_certificate",
    //         "previous_salary_slip",
    //         "experience_letter",
    //         "relieving_letter",
    //         "offer_letter",
    //         "photo",
    //         "resume",
    //         "medical_certificate",
    //     ];

    //     documentFields.forEach((field) => {
    //         if (this[field]) {
    //             uploadedDocs.push({
    //                 type: field,
    //                 path: this[field],
    //             });
    //         }
    //     });

    //     return uploadedDocs;
    // };

    // Documents.prototype.getDocumentCompletionPercentage = function () {
    //     const totalFields = 21; // Total document fields
    //     const uploadedDocs = this.getUploadedDocuments();
    //     return Math.round((uploadedDocs.length / totalFields) * 100);
    // };

    return Documents;
};
