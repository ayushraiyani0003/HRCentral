import React, { useMemo } from "react";
import { CustomTable, CustomButton } from "../../../../components";
import {
    DeleteIcon,
    EditIcon,
    ViewIcon,
    MoreVerticalIcon,
} from "../../../../utils/SvgIcon";
import useHiringRequests from "../../hooks/useHiringRequests";

const badgeClass = (type, value) => {
    const classes = {
        category: {
            Permanent: "bg-blue-100 text-blue-800",
            "Fixed Term (Contract/Casuals/Retainer)":
                "bg-orange-100 text-orange-800",
        },
        requirementType: {
            Replacement: "bg-yellow-100 text-yellow-800",
            Additional: "bg-blue-100 text-blue-800",
            Budgeted: "bg-green-100 text-green-800",
            "Non-budgeted": "bg-red-100 text-red-800",
        },
        source: {
            "Internal Referral": "bg-green-100 text-green-800",
            "Job Portal": "bg-blue-100 text-blue-800",
            "Online Portal": "bg-blue-100 text-blue-800",
            LinkedIn: "bg-purple-100 text-purple-800",
            "Campus Hiring": "bg-orange-100 text-orange-800",
            Consultant: "bg-purple-100 text-purple-800",
            Database: "bg-gray-100 text-gray-800",
            Advertisement: "bg-yellow-100 text-yellow-800",
        },
        status: {
            Completed: "bg-green-100 text-green-800",
            Pending: "bg-yellow-100 text-yellow-800",
            "In Process": "bg-blue-100 text-blue-800",
            "On Hold": "bg-gray-100 text-gray-800",
        },
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${
        classes[type]?.[value] || "bg-gray-100 text-gray-800"
    }`;
};

const renderBadge = (type) => (value) => {
    if (!value) return "";
    return <span className={badgeClass(type, value)}>{value}</span>;
};

const actionButtons = (row, handlers) => (
    <div className="flex space-x-3">
        {[
            ["View", ViewIcon, handlers.handleViewDetails],
            ["Edit", EditIcon, handlers.handleEdit],
            ["Delete", DeleteIcon, () => handlers.handleDelete(row.id)],
        ].map(([title, Icon, onClick], i) => {
            const styleMap = {
                View: "text-blue-600 bg-blue-50 border-blue-600 hover:text-blue-800",
                Edit: "text-yellow-600 bg-yellow-50 border-yellow-600 hover:text-yellow-800",
                Delete: "text-red-600 bg-red-50 border-red-600 hover:text-red-800",
            };
            const buttonStyle =
                styleMap[title] ||
                "text-gray-600 bg-gray-50 border-gray-600 hover:text-gray-800";

            return (
                <button
                    key={i}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick(row);
                    }}
                    className={`px-3 py-1 flex flex-row items-center rounded-md text-xs font-medium border ${buttonStyle}`}
                    title={`${title} Details`}
                >
                    <Icon className="mr-1 h-3.5 w-3.5" />
                    {title}
                </button>
            );
        })}
    </div>
);

// Helper functions to map keys to labels
const getDepartmentName = (departmentId, allDepartments) => {
    if (!departmentId || !allDepartments) return "";
    const dept = allDepartments?.find((d) => d.id === departmentId);
    return dept ? dept.name : String(departmentId);
};

const getDesignationName = (designationId, allDesignations) => {
    if (!designationId || !allDesignations) return "";
    const designation = allDesignations?.find((d) => d.id === designationId);
    return designation ? designation.name : String(designationId);
};

const getEmployeeName = (employeeId, employees) => {
    if (!employeeId || !employees) return "";
    const employee = employees?.find((e) => e.id === employeeId);
    return employee ? employee.name : String(employeeId);
};

const getCategoryLabel = (categoryValue, requirementCategories) => {
    if (!categoryValue || !requirementCategories) return "";
    const category = requirementCategories?.find(
        (c) => c.value === categoryValue
    );
    return category ? category.label : String(categoryValue);
};

const getRequirementTypeLabel = (typeValue, requirementTypes) => {
    if (!typeValue || !requirementTypes) return "";
    const type = requirementTypes?.find((t) => t.value === typeValue);
    return type ? type.label : String(typeValue);
};

const getStatusLabel = (statusValue, requisitionStatusOptions) => {
    if (!statusValue || !requisitionStatusOptions) return "";
    const status = requisitionStatusOptions?.find(
        (s) => s.value === statusValue
    );
    return status ? status.label : String(statusValue);
};

// Robust helper function to safely format dates
const formatDate = (dateValue) => {
    if (!dateValue) return "";

    try {
        let date;
        if (dateValue instanceof Date) {
            date = dateValue;
        } else if (
            typeof dateValue === "string" ||
            typeof dateValue === "number"
        ) {
            date = new Date(dateValue);
        } else {
            return "";
        }

        if (isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleDateString();
    } catch (error) {
        console.error("Error formatting date:", error);
        return "";
    }
};

// Helper function to ensure safe string conversion
const safeStringValue = (value) => {
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    if (value === null || value === undefined) return "";
    if (value instanceof Date) return formatDate(value);
    if (typeof value === "object") return "";
    return String(value);
};

const columnTemplates = (handlers, dropdownData) => ({
    level_1: [
        {
            key: "requestedBy",
            header: "Requested By Name",
            sortable: true,
            width: "180px",
            render: (value) =>
                safeStringValue(getEmployeeName(value, dropdownData.employees)),
        },
        {
            key: "expectedJoiningDate",
            header: "Expected Joining Date",
            sortable: true,
            width: "120px",
            cell: (value) =>
                safeStringValue(formatDate(value.expectedJoiningDate)),
        },
        {
            key: "requirementForDepartment",
            header: "Department",
            sortable: true,
            width: "120px",
            cell: (value) =>
                safeStringValue(
                    getDepartmentName(
                        value.requirementForDepartment,
                        dropdownData.allDepartments
                    )
                ),
        },
        {
            key: "requirementForDesignation",
            header: "Designation",
            sortable: true,
            width: "120px",
            cell: (value) =>
                safeStringValue(
                    getDesignationName(
                        value.requirementForDesignation,
                        dropdownData.allDesignations
                    )
                ),
        },
        {
            key: "requirementForCategory",
            header: "Category",
            sortable: true,
            width: "120px",
            cell: (value) => {
                const label = getCategoryLabel(
                    value.requirementForCategory,
                    dropdownData.requirementCategories
                );
                return label ? renderBadge("category")(label) : "";
            },
        },
        {
            key: "requirementType",
            header: "Requirement Type",
            sortable: true,
            width: "150px",
            cell: (value) => {
                const label = getRequirementTypeLabel(
                    value.requirementType,
                    dropdownData.requirementTypes
                );
                return label ? renderBadge("requirementType")(label) : "";
            },
        },
        {
            key: "actions",
            header: "Actions",
            sortable: false,
            width: "200px",
            cell: (row) => actionButtons(row, handlers),
        },
    ],
    level_2: [
        {
            key: "requestedBy",
            header: "Requested By Name",
            sortable: true,
            width: "180px",
            cell: (value) =>
                safeStringValue(getEmployeeName(value, dropdownData.employees)),
        },
        {
            key: "requirementForDepartment",
            header: "Department",
            sortable: true,
            width: "100px",
            cell: (value) =>
                safeStringValue(
                    getDepartmentName(
                        value.requirementForDepartment,
                        dropdownData.allDepartments
                    )
                ),
        },
        {
            key: "requirementForDesignation",
            header: "Designation",
            sortable: true,
            width: "100px",
            cell: (value) =>
                safeStringValue(
                    getDesignationName(
                        value.requirementForDesignation,
                        dropdownData.allDesignations
                    )
                ),
        },
        {
            key: "requestReceivedDate",
            header: "Request Received Date",
            sortable: true,
            width: "110px",
            cell: (value) =>
                safeStringValue(formatDate(value.requestReceivedDate)),
        },
        {
            key: "source",
            header: "Source",
            sortable: true,
            width: "110px",
            cell: (value) => (value ? renderBadge("source")(value) : ""),
        },
        {
            key: "recruiterName",
            header: "Recruiter Name",
            sortable: true,
            width: "110px",
            cell: (value) => safeStringValue(value),
        },
        {
            key: "actions",
            header: "Actions",
            sortable: false,
            width: "200px",
            cell: (row) => actionButtons(row, handlers),
        },
    ],
    level_3: [
        {
            key: "requestedBy",
            header: "Requested By Name",
            sortable: true,
            width: "180px",
            cell: (value) =>
                safeStringValue(getEmployeeName(value, dropdownData.employees)),
        },
        {
            key: "requirementForDepartment",
            header: "Department",
            sortable: true,
            width: "100px",
            cell: (value) =>
                safeStringValue(
                    getDepartmentName(
                        value.requirementForDepartment,
                        dropdownData.allDepartments
                    )
                ),
        },
        {
            key: "requirementForDesignation",
            header: "Designation",
            sortable: true,
            width: "100px",
            cell: (value) =>
                safeStringValue(
                    getDesignationName(
                        value.requirementForDesignation,
                        dropdownData.allDesignations
                    )
                ),
        },
        {
            key: "requestCompletedDate",
            header: "Request Completed Date",
            sortable: true,
            width: "110px",
            cell: (value) =>
                value ? safeStringValue(formatDate(value)) : "Pending",
        },
        {
            key: "status",
            header: "Status",
            sortable: true,
            width: "120px",
            cell: (value) => {
                const label = getStatusLabel(
                    value.status,
                    dropdownData.requisitionStatusOptions
                );
                return label ? renderBadge("status")(label) : "";
            },
        },
        {
            key: "actions",
            header: "Actions",
            sortable: false,
            width: "180px",
            cell: (row) => actionButtons(row, handlers),
        },
    ],
});

const configByRole = {
    level_1: {
        columnsKey: "level_1",
        filters: [
            "requirementForDepartment",
            "requirementForCategory",
            "requirementType",
        ],
        buttonLabel: "Add New Request",
        emptyMessage: "No vacancy requests available",
    },
    level_2: {
        columnsKey: "level_2",
        filters: ["requirementForDepartment", "source"],
        buttonLabel: "Add Candidate",
        emptyMessage: "No recruitment records available",
    },
    level_3: {
        columnsKey: "level_3",
        filters: ["requirementForDepartment", "status"],
        buttonLabel: "Add Vacancy",
        emptyMessage: "No HR records available",
    },
};

function AllVacanciesTab({
    setOpenDeleteModel = () => {},
    setRequisitionData = () => {},
    setRequisitionModel = () => {},
    setModelType = () => {}, // 'view', 'add', 'edit'
}) {
    const {
        data,
        userRole,
        handleViewDetails,
        handleEdit,
        handleDelete,
        handleRowClick,
        handleAddNew,
        requirementCategories,
        requirementTypes,
        requisitionStatusOptions,
        approvedStatusOptions,
        allDepartments,
        allDesignations,
        employees,
    } = useHiringRequests(
        setOpenDeleteModel,
        setRequisitionData,
        setRequisitionModel,
        setModelType
    );

    const roleConfig = configByRole[userRole] || configByRole.level_1;

    // Prepare dropdown data for column rendering
    const dropdownData = {
        requirementCategories,
        requirementTypes,
        requisitionStatusOptions,
        allDepartments,
        allDesignations,
        employees,
    };

    // Transform data to ensure all Date objects are converted to strings
    const transformedData = useMemo(() => {
        if (!data || !Array.isArray(data)) return [];

        return data.map((row) => {
            const transformedRow = {};
            Object.keys(row).forEach((key) => {
                const value = row[key];
                // Convert Date objects to strings immediately
                if (value instanceof Date) {
                    transformedRow[key] = formatDate(value);
                } else if (
                    value &&
                    typeof value === "object" &&
                    !React.isValidElement(value)
                ) {
                    // Handle other objects that might cause issues
                    transformedRow[key] = JSON.stringify(value);
                } else {
                    transformedRow[key] = value;
                }
            });
            return transformedRow;
        });
    }, [data]);

    const columns = columnTemplates(
        {
            handleViewDetails,
            handleEdit,
            handleDelete,
        },
        dropdownData
    )[roleConfig.columnsKey];

    return (
        <div className="w-full pt-3">
            <CustomTable
                columns={columns}
                data={transformedData}
                defaultItemsPerPage={25}
                itemsPerPageOptions={[10, 25, 50, 100]}
                searchable
                filterable
                filterableColumns={roleConfig.filters}
                sortable
                pagination
                emptyMessage={roleConfig.emptyMessage}
                loading={false}
                onRowClick={handleRowClick}
                extraHeaderContent={
                    <div className="flex justify-end">
                        <CustomButton
                            onClick={handleAddNew}
                            variant="primary"
                            size="small"
                            className="px-3 py-2 text-sm rounded-md font-medium shadow-sm hover:shadow-md"
                            ariaLabel={`${roleConfig.buttonLabel} Button`}
                            testId="add-record-btn"
                            bgColor="bg-blue-600"
                            hoverColor="hover:bg-blue-500"
                            color="text-white"
                            borderRadius="rounded"
                        >
                            {roleConfig.buttonLabel}
                        </CustomButton>
                    </div>
                }
                tableHeight="620px"
                tableWidth="100%"
                rowHeight="38px"
                tdClassName="!py-2 !px-1"
                thCustomStyles="!px-1 !py-2"
                className="vacancy-table"
                style={{ overflowX: "auto", minWidth: "1200px" }}
            />
        </div>
    );
}

export default AllVacanciesTab;
