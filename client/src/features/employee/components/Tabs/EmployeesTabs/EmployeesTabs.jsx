import React, { useState } from "react";
import HeaderButtons from "./HeaderButtons";
import EmployeeList from "./EmployeeList";
import EmployeeInfo from "./EmployeeInfo";

// Mock employee data for demonstration
const mockEmployees = [
   {
        id: 1,
        punchCode: "EMP001",
        name: "John Doe",
        avatar: "https://ui-avatars.com/api/?name=John+Doe&size=40",

        // Basic Info
        designation: "Software Engineer",
        department: "Engineering",
        company: "TechNova Inc.",
        reportingGroup: "Backend Team",
        employmentStatus: "Full Time Permanent",
        status: "active", // active | inactive | resigned
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

        // Optional Extensions (consider)
        employeeType: "Permanent", // Permanent, Contract, Intern
        shiftTiming: "09:00 AM - 06:00 PM",
        emergencyContact: {
            name: "Mary Doe",
            relationship: "Sister",
            phone: "+1-202-555-7890"
        },
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
            phone: "+1-202-555-0123",
        },
    }
];

function EmployeesTabs() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEmployee, setSelectedEmployee] = useState(mockEmployees[0]);
    const pageSize = 12;

    // Filter employees based on search query
    const filteredEmployees = mockEmployees.filter(
        (employee) =>
            employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.punchCode
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            employee.department
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            employee.designation
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            employee.id.toString().includes(searchQuery.toLowerCase()) ||
            employee.reportingGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.mobileNumber.toString().includes(searchQuery.toLowerCase()) ||
            employee.whatsappNumber.toString().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredEmployees.length / pageSize);
    const displayedEmployees = filteredEmployees.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleSearch = (value) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleEmployeeSelect = (employee) => {
        setSelectedEmployee(employee);
    };

    return (
        <div className="flex flex-col w-full h-full">
            {/* Buttons and info section */}
            <HeaderButtons />

            {/* Main content with 3:8 flex ratio */}
            <div className="flex flex-row h-full p-2">
                {/* Left column - 3 parts of flex ratio */}
                <EmployeeList
                    searchQuery={searchQuery}
                    handleSearch={handleSearch}
                    handleEmployeeSelect={handleEmployeeSelect}
                    selectedEmployee={selectedEmployee}
                    displayedEmployees={displayedEmployees}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    filteredEmployees={filteredEmployees}
                />

                {/* Right column - 8 parts of flex ratio */}
                <div className="w-8/11 pl-6">
                    {selectedEmployee ? (
                        <EmployeeInfo selectedEmployee={selectedEmployee} />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-gray-500">
                                <div className="text-xl mb-2">
                                    No Employee Selected
                                </div>
                                <p>
                                    Select an employee from the list to view
                                    details
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EmployeesTabs;
