import React, { useState } from "react";
import { EditIcon, CopyIcon } from "../../../../../utils/SvgIcon";

// Reusable components
const CustomContainer = ({ children, title, headerActions, className }) => (
    <div
        className={`bg-white rounded-md border border-gray-200 shadow-sm ${
            className || ""
        }`}
    >
        <div className="flex flex-wrap justify-between items-center px-3 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-800 mb-1 md:mb-0">{title}</h3>
            {headerActions && <div>{headerActions}</div>}
        </div>
        <div className="p-3 md:p-4">{children}</div>
    </div>
);

const InfoItem = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1 mb-2 sm:mb-0">
        <p className="text-sm text-gray-500">{label} :</p>
        <p className="font-medium">{value}</p>
    </div>
);

const CopyableText = ({ label, value }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1 mb-2 sm:mb-0">
            <p className="text-sm text-gray-500">{label} :</p>
            <div className="flex items-center">
                <p className="font-medium mr-1 break-all">{value}</p>
                <button
                    title={copied ? "Copied!" : "Copy to Clipboard"}
                    onClick={copyToClipboard}
                    className="text-gray-500 hover:text-blue-600 flex-shrink-0"
                    aria-label="Copy to clipboard"
                >
                    <CopyIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

const Badge = ({ text, color = "blue" }) => {
    const colorMap = {
        blue: "bg-blue-50 text-blue-800 border-blue-200",
        green: "bg-green-50 text-green-800 border-green-200",
        purple: "bg-purple-50 text-purple-800 border-purple-200",
    };

    return (
        <span
            className={`${colorMap[color]} rounded-md px-2 py-1 text-sm m-1 md:m-2 border inline-block`}
        >
            {text}
        </span>
    );
};

const EditButton = () => (
    <button className="px-2 py-1 flex flex-row items-center rounded-md text-blue-600 bg-blue-50 text-xs font-medium border border-blue-600">
        <EditIcon className="mr-1 h-3.5 w-3.5" />
        <span>Edit</span>
    </button>
);

// Tab sections
const PersonalInformationSection = ({ employee }) => (
    <CustomContainer
        title="Personal Information"
        headerActions={<EditButton />}
        className="mb-3"
    >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 text-sm">
            <CopyableText label="Date of Birth" value={employee.dateOfBirth} />
            <InfoItem label="Gender" value={employee.gender} />
            <InfoItem label="Nationality" value={employee.nationality} />
            <InfoItem label="Marital Status" value={employee.maritalStatus} />
            <InfoItem label="Joined Date" value={employee.joinedDate} />
        </div>
    </CustomContainer>
);

const IdentificationSection = ({ employee }) => (
    <CustomContainer
        title="Identification"
        headerActions={<EditButton />}
        className="mb-3"
    >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 text-sm">
            <CopyableText label="National ID" value={employee.nationalId} />
            <CopyableText
                label="Social Insurance Number"
                value={employee.socialInsuranceNumber}
            />
            <CopyableText
                label="Personal Tax ID"
                value={employee.personalTaxId}
            />
            <CopyableText
                label="Health Insurance Number"
                value={employee.healthInsuranceNumber}
            />
            <CopyableText
                label="Driving License"
                value={employee.drivingLicense}
            />
        </div>
    </CustomContainer>
);

const ContactInformationSection = ({ employee }) => (
    <CustomContainer
        title="Contact Information"
        headerActions={<EditButton />}
        className="mb-3"
    >
        <div className="grid grid-cols-1 gap-3 mb-3 md:mb-4 text-sm">
            <CopyableText label="Address" value={employee.address} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 text-sm">
            <InfoItem label="City" value={employee.city} />
            <InfoItem label="Country" value={employee.country} />
            <InfoItem label="Postal/Zip Code" value={employee.postalCode} />
            <CopyableText label="Home Phone" value={employee.homePhone} />
            <CopyableText label="Work Phone" value={employee.workPhone} />
            <CopyableText label="Private Email" value={employee.privateEmail} />
            <CopyableText label="Mobile Number" value={employee.mobileNumber} />
            <CopyableText label="WhatsApp" value={employee.whatsappNumber} />
        </div>
    </CustomContainer>
);

const JobDetailsSection = ({ employee }) => (
    <CustomContainer
        title="Job Details"
        headerActions={<EditButton />}
        className="mb-3"
    >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 text-sm">
            <InfoItem label="Job Title" value={employee.designation} />
            <InfoItem
                label="Employee Status"
                value={employee.employmentStatus}
            />
            <InfoItem label="Department" value={employee.department} />
            <InfoItem label="Manager" value={employee.manager} />
            <InfoItem label="Company" value={employee.company} />
            <InfoItem label="Reporting Group" value={employee.reportingGroup} />
            <InfoItem label="Location" value={employee.location} />
            <InfoItem label="Net Hours" value={employee.netHours} />
            <InfoItem label="Week Off" value={employee.weekOff.join(", ")} />
            <InfoItem label="Shift Timing" value={employee.shiftTiming} />
        </div>
    </CustomContainer>
);

const EmergencyContactSection = ({ emergencyContact }) => (
    <CustomContainer
        title="Emergency Contact"
        headerActions={<EditButton />}
        className="mb-3"
    >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 text-sm">
            <InfoItem label="Name" value={emergencyContact.name} />
            <InfoItem
                label="Relationship"
                value={emergencyContact.relationship}
            />
            <CopyableText label="Phone" value={emergencyContact.phone} />
        </div>
    </CustomContainer>
);

const ReferInformationSection = ({ referInformation }) => (
    <CustomContainer
        title="Refer Information"   
        headerActions={<EditButton />}
        className="mb-3"
    >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 text-sm">
            <CopyableText label="Punch code" value={referInformation.punchCode} />
            <InfoItem label="Name" value={referInformation.name} />
            <InfoItem label="Relationship" value={referInformation.relationship} />
            <CopyableText label="Phone" value={referInformation.phone} />
        </div>
    </CustomContainer>
)

const SkillsSection = ({ skills }) => (
    <CustomContainer
        title="Skills"
        headerActions={<EditButton />}
        className="mb-3"
    >
        <div className="flex flex-wrap -m-1">
            {skills.map((skill, index) => (
                <Badge key={index} text={skill} color="blue" />
            ))}
        </div>
    </CustomContainer>
);

const EducationSection = ({ education }) => (
    <CustomContainer
        title="Education"
        headerActions={<EditButton />}
        className="mb-3"
    >
        {education.map((edu, index) => (
            <div key={index} className="mb-4 last:mb-0">
                <div className="font-medium">{edu.degree}</div>
                <div className="text-sm text-gray-600">
                    {edu.institution} • {edu.year}
                </div>
            </div>
        ))}
    </CustomContainer>
);

const CertificationsSection = ({ certifications }) => (
    <CustomContainer
        title="Certifications"
        headerActions={<EditButton />}
        className="mb-3"
    >
        <div className="flex flex-wrap -m-1">
            {certifications.map((cert, index) => (
                <Badge key={index} text={cert} color="green" />
            ))}
        </div>
    </CustomContainer>
);

const LanguagesSection = ({ languages }) => (
    <CustomContainer
        title="Languages"
        headerActions={<EditButton />}
        className="mb-3"
    >
        <div className="flex flex-wrap -m-1">
            {languages.map((language, index) => (
                <Badge key={index} text={language} color="purple" />
            ))}
        </div>
    </CustomContainer>
);

// Main component
function EmployeeDetailsInfo({selectedEmployee}) {
    const [activeTab, setActiveTab] = useState("basicInfo");

    // Mock employee data
    const employee = selectedEmployee ? selectedEmployee :{
        // Basic Info
        designation: "Software Engineer",
        department: "Engineering",
        company: "TechNova Inc.",
        reportingGroup: "Backend Team",
        employmentStatus: "Full Time Permanent",
        status: "active",
        joinedDate: "2015-06-15",
        resignedDate: null,

        // Personal Information
        dateOfBirth: "1985-04-12",
        gender: "Male",
        nationality: "American",
        maritalStatus: "Single",

        // Identification
        nationalId: "123-45-6789",
        socialInsuranceNumber: "789-65-4321",
        personalTaxId: "PT-00012345",
        healthInsuranceNumber: "HI-4567890",
        additionalIds: ["DL-CA-987654321"],
        drivingLicense: "DL-CA-987654321",

        // Contact Information
        address: "123 Maple Street",
        city: "New York",
        state: "NY",
        country: "United States",
        postalCode: "10001",
        homePhone: "212-555-1234",
        workPhone: "212-555-5678",
        privateEmail: "john.doe@example.com",

        // Communication Numbers
        mobileNumber: "+1-202-555-0131",
        whatsappNumber: "+1-202-555-0131",

        // Work Details
        netHours: 40,
        weekOff: ["Saturday", "Sunday"],
        location: "New York",
        manager: "Jane Smith",

        // Optional Extensions
        employeeType: "Permanent",
        shiftTiming: "09:00 AM - 06:00 PM",
        emergencyContact: {
            name: "Mary Doe",
            relationship: "Sister",
            phone: "+1-202-555-7890",
        },

        // Qualifications
        skills: ["JavaScript", "React", "Node.js", "HTML", "CSS"],
        education: [
            {
                degree: "Bachelor of Science in Computer Science",
                institution: "MIT",
                year: "2010",
            },
            {
                degree: "Master of Science in Software Engineering",
                institution: "Stanford",
                year: "2012",
            },
        ],
        certifications: [
            "AWS Certified Developer",
            "Google Cloud Professional",
            "Scrum Master",
        ],
        languages: [
            "English (Native)",
            "Spanish (Intermediate)",
            "French (Basic)",
        ],
        referInformation: {
            punchCode: "EMP002",
            name: "John Doe",
            relationship: "Friend",
            phone: "+1-296602-555-0123",
        },
    };

    return (
        <div className="bg-gray-50 p-3 md:p-6 rounded-md">
            {/* Tab Headers */}
            <div className="flex flex-wrap border-b mb-4 md:mb-6">
                <button
                    className={`pb-2 px-2 md:px-4 font-medium ${
                        activeTab === "basicInfo"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("basicInfo")}
                >
                    Basic Information
                </button>
                <button
                    className={`pb-2 px-2 md:px-4 font-medium ${
                        activeTab === "qualifications"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("qualifications")}
                >
                    Qualifications
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "basicInfo" && (
                <div className="grid grid-cols-1 gap-3">
                    <PersonalInformationSection employee={employee} />
                    <IdentificationSection employee={employee} />
                    <ContactInformationSection employee={employee} />
                    <JobDetailsSection employee={employee} />
                    <EmergencyContactSection
                        emergencyContact={employee.emergencyContact}
                    />
                    <ReferInformationSection referInformation={employee.referInformation} />
                </div>
            )}

            {activeTab === "qualifications" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    <div className="sm:col-span-2 lg:col-span-4">
                        <SkillsSection skills={employee.skills} />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-2">
                        <EducationSection education={employee.education} />
                    </div>
                    <div className="sm:col-span-1 lg:col-span-1">
                        <CertificationsSection
                            certifications={employee.certifications}
                        />
                    </div>
                    <div className="sm:col-span-1 lg:col-span-1">
                        <LanguagesSection languages={employee.languages} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmployeeDetailsInfo;