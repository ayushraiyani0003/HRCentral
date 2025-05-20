import React, { useState } from "react";
import { CustomContainer } from "../../../../../components";
import {EditIcon} from "../../../../../utils/SvgIcon";

function EmployeeDetailsInfo({ selectedEmployee }) {
    const [activeTab, setActiveTab] = useState("basicInfo");

    // Mock employee data if no selected employee is provided
    const employee = selectedEmployee || {
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
    };

    // Edit button component for card header actions
    const EditButton = () => (
        <button className="px-3 py-1 flex flex-row items-center rounded-md text-blue-600 bg-blue-50 text-xs font-medium border border-blue-600">
            <EditIcon className="mr-1 h-3.5 w-3.5" />
            <span>Edit</span>
        </button>
    );

    return (
        <div className="bg-gray-50 p-6">
            {/* Tab Headers */}
            <div className="flex border-b mb-6">
                <button
                    className={`pb-2 px-4 font-medium ${
                        activeTab === "basicInfo"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("basicInfo")}
                >
                    Basic Information
                </button>
                <button
                    className={`pb-2 px-4 font-medium ${
                        activeTab === "qualifications"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("qualifications")}
                >
                    Qualifications
                </button>
            </div>

            {/* Basic Information Tab */}
            {activeTab === "basicInfo" && (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {/* Personal Information Card */}
                    <CustomContainer
                        title="Personal Information"
                        elevation="low"
                        padding="medium"
                        border={true}
                        rounded="medium"
                        headerActions={<EditButton />}
                        className={"!mb-0"}
                    >
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">
                                    Date of Birth : 
                                </p>
                                <p className="font-medium">
                                    {employee.dateOfBirth}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">Gender</p>
                                <p className="font-medium">{employee.gender}</p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">
                                    Nationality :
                                </p>
                                <p className="font-medium">
                                    {employee.nationality}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">
                                    Marital Status :
                                </p>
                                <p className="font-medium">
                                    {employee.maritalStatus}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">
                                    Joined Date :
                                </p>
                                <p className="font-medium">
                                    {employee.joinedDate}
                                </p>
                            </div>
                        </div>
                    </CustomContainer>

                    {/* Identification Card */}
                    <CustomContainer
                        title="Identification"
                        elevation="low"
                        padding="medium"
                        border={true}
                        rounded="medium"
                        headerActions={<EditButton />}

                        className={"!mb-0"}
                    >
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">
                                    National ID :
                                </p>
                                <p className="font-medium">
                                    {employee.nationalId}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">
                                    Social Insurance Number :
                                </p>
                                <p className="font-medium">
                                    {employee.socialInsuranceNumber}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">
                                    Personal Tax ID :
                                </p>
                                <p className="font-medium">
                                    {employee.personalTaxId}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">
                                    Health Insurance Number :
                                </p>
                                <p className="font-medium">
                                    {employee.healthInsuranceNumber}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">
                                    Driving License : 
                                </p>
                                <p className="font-medium">
                                    {employee.drivingLicense}
                                </p>
                            </div>
                        </div>
                    </CustomContainer>

                    {/* Contact Information Card */}
                    <CustomContainer
                        title="Contact Information"
                        elevation="low"
                        padding="medium"
                        border={true}
                        rounded="medium"
                        headerActions={<EditButton />}

                        className={"!mb-0"}
                    >
                        <div className="grid grid-cols-1 gap-4 mb-4 text-sm">
                            <div className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">Address :</p>
                                <p className="font-medium">
                                    {employee.address}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">City : </p>
                                <p className="font-medium">{employee.city}</p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">Country :</p>
                                <p className="font-medium">
                                    {employee.country}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">
                                    Postal/Zip Code :
                                </p>
                                <p className="font-medium">
                                    {employee.postalCode}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">
                                    Home Phone :
                                </p>
                                <p className="font-medium">
                                    {employee.homePhone}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">
                                    Work Phone :
                                </p>
                                <p className="font-medium">
                                    {employee.workPhone}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">
                                    Private Email :
                                </p>
                                <p className="font-medium">
                                    {employee.privateEmail}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">
                                    Mobile Number :
                                </p>
                                <p className="font-medium">
                                    {employee.mobileNumber}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">
                                    WhatsApp :
                                </p>
                                <p className="font-medium">
                                    {employee.whatsappNumber}
                                </p>
                            </div>
                        </div>
                    </CustomContainer>

                    {/* Job Details Card */}
                    <CustomContainer
                        title="Job Details"
                        elevation="low"
                        padding="medium"
                        border={true}
                        rounded="medium"
                        headerActions={<EditButton />}

                        className={"!mb-0"}
                    >
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div  className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">
                                    Job Title :
                                </p>
                                <p className="font-medium">
                                    {employee.designation}
                                </p>
                            </div>
                            <div  className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">
                                    Employee Status :
                                </p>
                                <p className="font-medium">
                                    {employee.employmentStatus}
                                </p>
                            </div>
                            <div  className="flex flex-row wrap-normal gap-1">
                                <p className="text-sm text-gray-500">
                                    Department :
                                </p>
                                <p className="font-medium">
                                    {employee.department}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1" >
                                <p className="text-sm text-gray-500">Manager :</p>
                                <p className="font-medium">
                                    {employee.manager}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1" >
                                <p className="text-sm text-gray-500">Company :</p>
                                <p className="font-medium">
                                    {employee.company}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1" >
                                <p className="text-sm text-gray-500">
                                    Reporting Group :
                                </p> 
                                <p className="font-medium">
                                    {employee.reportingGroup}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1" >
                                <p className="text-sm text-gray-500">
                                    Location :
                                </p>
                                <p className="font-medium">
                                    {employee.location}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1" >
                                <p className="text-sm text-gray-500">
                                    Net Hours :
                                </p>
                                <p className="font-medium">
                                    {employee.netHours}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1" >
                                <p className="text-sm text-gray-500">
                                    Week Off :
                                </p>
                                <p className="font-medium">
                                    {employee.weekOff.join(", ")}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1" >
                                <p className="text-sm text-gray-500">
                                    Shift Timing :
                                </p>
                                <p className="font-medium">
                                    {employee.shiftTiming}
                                </p>
                            </div>
                        </div>
                    </CustomContainer>

                    {/* Emergency Contact Card */}
                    <CustomContainer
                        title="Emergency Contact"
                        elevation="low"
                        padding="medium"
                        border={true}
                        rounded="medium"
                        headerActions={<EditButton />}

                        className={"!mb-0"}
                    >
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-row wrap-normal gap-1" >
                                <p className="text-sm text-gray-500">Name :</p>
                                <p className="font-medium">
                                    {employee.emergencyContact.name}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1" >
                                <p className="text-sm text-gray-500">
                                    Relationship :
                                </p>
                                <p className="font-medium">
                                    {employee.emergencyContact.relationship}
                                </p>
                            </div>
                            <div className="flex flex-row wrap-normal gap-1" >
                                <p className="text-sm text-gray-500">Phone :</p>
                                <p className="font-medium">
                                    {employee.emergencyContact.phone}
                                </p>
                            </div>
                        </div>
                    </CustomContainer>
                </div>
            )}

            {/* Qualifications Tab */}
            {activeTab === "qualifications" && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Skills Card */}
                    <CustomContainer
                        title="Skills"
                        elevation="low"
                        padding="medium"
                        border={true}
                        rounded="medium"
                        headerActions={<EditButton />}

                        className={"!mb-0"}
                    >
                        <div className="flex flex-wrap">
                            {employee.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-50 text-blue-800 rounded-md px-3 py-1 text-sm m-2 border border-blue-200"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </CustomContainer>

                    {/* Education Card */}
                    <CustomContainer
                        title="Education"
                        elevation="low"
                        padding="medium"
                        border={true}
                        rounded="medium"
                        headerActions={<EditButton />}

                        className={"!mb-0"}
                    >
                        {employee.education.map((edu, index) => (
                            <div key={index} className="mb-4 last:mb-0">
                                <div className="font-medium">{edu.degree}</div>
                                <div className="text-sm text-gray-600">
                                    {edu.institution} • {edu.year}
                                </div>
                            </div>
                        ))}
                    </CustomContainer>

                    {/* Certifications Card */}
                    <CustomContainer
                        title="Certifications"
                        elevation="low"
                        padding="medium"
                        border={true}
                        rounded="medium"
                        headerActions={<EditButton />}

                        className={"!mb-0"}
                    >
                        <div className="flex flex-wrap">
                            {employee.certifications.map((cert, index) => (
                                <span
                                    key={index}
                                    className="bg-green-50 text-green-800 rounded-md px-3 py-1 text-sm m-2 border border-green-200"
                                >
                                    {cert}
                                </span>
                            ))}
                        </div>
                    </CustomContainer>

                    {/* Languages Card */}
                    <CustomContainer
                        title="Languages"
                        elevation="low"
                        padding="medium"
                        border={true}
                        rounded="medium"
                        headerActions={<EditButton />}

                        className={"!mb-0"}
                    >
                        <div className="flex flex-wrap">
                            {employee.languages.map((language, index) => (
                                <span
                                    key={index}
                                    className="bg-purple-50 text-purple-800 rounded-md px-3 py-1 text-sm m-2 border border-purple-200"
                                >
                                    {language}
                                </span>
                            ))}
                        </div>
                    </CustomContainer>
                </div>
            )}
        </div>
    );
}

export default EmployeeDetailsInfo;
