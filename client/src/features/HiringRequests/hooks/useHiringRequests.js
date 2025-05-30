import React, { useState } from "react";

const useHiringRequests = (
    setOpenDeleteModel = () => {},
    setRequisitionData = () => {},
    setRequisitionModel = () => {},
    setModelType = () => {} // 'view', 'add', 'edit'
) => {
    // User role state - manually change this to switch between views
    // Options: 'level_1', 'level_2', 'level_3' 1 is low and 3 is high
    // in 1 department
    // in 2 recruiters
    // in 3 HR managers
    // above 3 is admin, super admin etc
    // TODO: use the setUserRole and dynamically change the columns
    // TODO: change the role level base on the user role
    // TODO: level 2 not work, because of data missing
    const [userRole, setUserRole] = useState("level_1");

    //TODO: add employees list, allDepartments, allDesignations, also add other dates.

    // Requirement category options
    const requirementCategories = [
        { label: "Technical", value: "technical" },
        { label: "Permanent", value: "permanent" },
        {
            label: "Fixed Term (Contract/Casuals/Retainer)",
            value: "fixed_term",
        },
    ];

    // Requirement type options
    const requirementTypes = [
        { label: "Replacement", value: "replacement" },
        { label: "Additional", value: "additional" },
        { label: "Budgeted", value: "budgeted" },
        { label: "Non-budgeted", value: "non_budgeted" },
    ];

    const requisitionStatusOptions = [
        { label: "Pending", value: "pending" },
        { label: "In Process", value: "process" },
        { label: "On Hold", value: "on_hold" },
        { label: "Completed", value: "completed" },
    ];

    const approvedStatusOptions = [
        { label: "Approved", value: "approved" },
        { label: "Pending", value: "pending" },
        { label: "Rejected", value: "rejected" },
        { label: "On Hold", value: "on_hold" },
    ];

    const allDepartments = [
        { name: "Company", id: "company" },
        { name: "Head Office", id: "head_office" },
        { name: "Regional Office", id: "regional_office" },
        { name: "Department", id: "department" },
        { name: "Unit", id: "unit" },
        { name: "Sub Unit", id: "sub_unit" },
        { name: "Eng", id: "eng" },
    ]; // Array of existing structures for parent dropdown

    const allDesignations = [
        { name: "John Smith", id: "john_smith" },
        { name: "Emily Davis", id: "emily_davis" },
        { name: "David Brown", id: "david_brown" },
        { name: "Lisa Turner", id: "lisa_turner" },
        { name: "Andrew Wilson", id: "andrew_wilson" },
        { name: "It", id: "it" },
    ]; // Array of department heads

    const employees = [
        { name: "John Smith", id: "john_smith" },
        { name: "Emily Davis", id: "emily_davis" },
        { name: "David Brown", id: "david_brown" },
        { name: "Lisa Turner", id: "lisa_turner" },
        { name: "Andrew Wilson", id: "andrew_wilson" },
    ]; // Array of department heads

    const data = [
        {
            id: 1,
            requestId: "REQ001",
            requestedBy: "david_brown",
            requirementForDepartment: "head_office",
            requirementForDesignation: "it",
            numberOfPositions: "5",
            requirementType: "replacement",
            requirementForCategory: "permanent",
            expectedJoiningDate: new Date("2024-03-01"),
            experienceRequired: "2",
            jobDescription: "Develop and maintain software applications",
            approvalStatus: "pending",
            status: "process",
            isAgreedByDifferent: true,
            agreedBy: "lisa_turner",
        },
    ];

    // Action handlers
    const handleViewDetails = (row) => {
        console.log("View details for record:", row);
        setRequisitionData(row);
        setModelType("view");
        setRequisitionModel(true);
    };

    const handleEdit = (row) => {
        console.log("Edit record:", row);
        setRequisitionData(row);
        setModelType("edit");
        setRequisitionModel(true);
    };

    const handleDelete = (id) => {
        console.log("Delete record with ID:", id);
        // Find the record to pass complete data to delete modal
        const recordToDelete = data.find((item) => item.id === id);
        setRequisitionData(recordToDelete);
        setOpenDeleteModel(true);
    };

    const handleRowClick = (row) => {
        console.log("Row clicked:", row);
        // Optional: Handle row click if needed
        // You can open view modal on row click if desired
        // handleViewDetails(row);
    };

    const handleAddNew = () => {
        console.log("Add new record");
        setRequisitionData({}); // Empty data for new record
        setModelType("add");
        setRequisitionModel(true);
    };

    return {
        data,
        userRole,
        requirementCategories,
        requirementTypes,
        requisitionStatusOptions,
        approvedStatusOptions,
        allDepartments,
        allDesignations,
        employees,
        setUserRole,
        handleViewDetails,
        handleEdit,
        handleDelete,
        handleRowClick,
        handleAddNew,
    };
};

export default useHiringRequests;
