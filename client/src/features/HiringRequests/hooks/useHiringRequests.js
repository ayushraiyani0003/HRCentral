import React, { useState } from "react";

const useHiringRequests = () => {
    // User role state - manually change this to switch between views
    // Options: 'level_1', 'level_2', 'level_3' 1 is low and 3 is high
    // in 1 department
    // in 2 recruiters
    // in 3 HR managers
    // above 3 is admin, super admin etc
    // TODO: use the setUserRole and dynamically change the columns
    const [userRole, setUserRole] = useState("level_3");

    const data = [
        {
            id: 1,
            requestId: "REQ001",
            requestedByName: "John Smith",
            RequestedDate: "2024-01-15",
            RequestedByDepartment: "Engineering",
            RequestedByDesignation: "Senior Software Engineer",
            RequirementForDepartment: "Engineering",
            RequirementForDesignation: "Software Engineer",
            RequirementForCategory: "Technical",
            requirementType: "Replacement",
            requestReceivedDate: "2024-01-15",
            requestCompletedDate: "2024-01-20",
            source: "Internal Referral",
            recruiterName: "Sarah Johnson",
            dateOfJoining: "2024-02-01",
            Designation: "Software Engineer",
            CTCOffered: "50000",
            approvalStatus: "Pending",
            approvalDate: "2024-01-20",
            status: "Completed",
        },
        {
            id: 2,
            requestId: "REQ002",
            requestedByName: "Emily Davis",
            RequestedDate: "2024-02-10",
            RequestedByDepartment: "Marketing",
            RequestedByDesignation: "Marketing Manager",
            RequirementForDepartment: "Marketing",
            RequirementForDesignation: "Content Strategist",
            RequirementForCategory: "Fixed Term",
            requirementType: "Additional",
            requestReceivedDate: "2024-02-11",
            requestCompletedDate: "2024-02-28",
            source: "Online Portal",
            recruiterName: "Michael Lee",
            dateOfJoining: "2024-03-05",
            Designation: "Content Strategist",
            CTCOffered: "45000",
            approvalStatus: "Approved",
            approvalDate: "2024-02-15",
            status: "Completed",
        },
        {
            id: 3,
            requestId: "REQ003",
            requestedByName: "David Brown",
            RequestedDate: "2024-03-01",
            RequestedByDepartment: "Finance",
            RequestedByDesignation: "Finance Director",
            RequirementForDepartment: "Finance",
            RequirementForDesignation: "Financial Analyst",
            RequirementForCategory: "Technical",
            requirementType: "Budgeted",
            requestReceivedDate: "2024-03-02",
            requestCompletedDate: "2024-03-20",
            source: "Consultant",
            recruiterName: "Nina Patel",
            dateOfJoining: "2024-04-01",
            Designation: "Financial Analyst",
            CTCOffered: "60000",
            approvalStatus: "Approved",
            approvalDate: "2024-03-05",
            status: "Completed",
        },
        {
            id: 4,
            requestId: "REQ004",
            requestedByName: "Lisa Turner",
            RequestedDate: "2024-04-05",
            RequestedByDepartment: "Operations",
            RequestedByDesignation: "Operations Head",
            RequirementForDepartment: "Operations",
            RequirementForDesignation: "Logistics Coordinator",
            RequirementForCategory: "Fixed Term",
            requirementType: "Non-budgeted",
            requestReceivedDate: "2024-04-06",
            requestCompletedDate: "2024-04-15",
            source: "Database",
            recruiterName: "James Carter",
            dateOfJoining: "2024-04-25",
            Designation: "Logistics Coordinator",
            CTCOffered: "40000",
            approvalStatus: "Pending",
            approvalDate: "2024-04-10",
            status: "Processing",
        },
        {
            id: 5,
            requestId: "REQ005",
            requestedByName: "Andrew Wilson",
            RequestedDate: "2024-05-10",
            RequestedByDepartment: "Human Resources",
            RequestedByDesignation: "HR Manager",
            RequirementForDepartment: "Human Resources",
            RequirementForDesignation: "Recruitment Specialist",
            RequirementForCategory: "Technical",
            requirementType: "Additional",
            requestReceivedDate: "2024-05-11",
            requestCompletedDate: "2024-05-25",
            source: "Advertisement",
            recruiterName: "Olivia Martin",
            dateOfJoining: "2024-06-01",
            Designation: "Recruitment Specialist",
            CTCOffered: "47000",
            approvalStatus: "Approved",
            approvalDate: "2024-05-15",
            status: "Completed",
        },
    ];

    // Action handlers
    const handleViewDetails = (row) => {
        console.log("View details for record:", row);
        // Implement view details logic
    };

    const handleEdit = (row) => {
        console.log("Edit record:", row);
        // Implement edit logic
    };

    const handleDelete = (id) => {
        console.log("Delete record with ID:", id);
        // Implement delete logic with confirmation
        if (window.confirm("Are you sure you want to delete this record?")) {
            // Delete logic here
        }
    };

    const handleRowClick = (row) => {
        console.log("Row clicked:", row);
        // Optional: Handle row click if needed
    };

    return {
        data,
        userRole,
        handleViewDetails,
        handleEdit,
        handleDelete,
        handleRowClick,
    };
};

export default useHiringRequests;
