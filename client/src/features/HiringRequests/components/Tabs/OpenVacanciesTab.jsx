import React from "react";
import { CustomTable, CustomButton } from "../../../../components";
import { DeleteIcon, EditIcon, ViewIcon } from "../../../../utils/SvgIcon";
import useHiringRequests from "../../hooks/useHiringRequests";

const badgeClass = (type, value) => {
    const classes = {
        category: {
            Technical: "bg-blue-100 text-blue-800",
            Management: "bg-purple-100 text-purple-800",
            Creative: "bg-green-100 text-green-800",
        },
        requirementType: {
            Urgent: "bg-red-100 text-red-800",
            "New Position": "bg-green-100 text-green-800",
            Replacement: "bg-yellow-100 text-yellow-800",
        },
        source: {
            "Internal Referral": "bg-green-100 text-green-800",
            "Job Portal": "bg-blue-100 text-blue-800",
            LinkedIn: "bg-purple-100 text-purple-800",
            "Campus Hiring": "bg-orange-100 text-orange-800",
        },
        status: {
            Completed: "bg-green-100 text-green-800",
            Pending: "bg-yellow-100 text-yellow-800",
        },
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${
        classes[type]?.[value] || "bg-gray-100 text-gray-800"
    }`;
};

const renderBadge = (type) => (value) =>
    <span className={badgeClass(type, value)}>{value}</span>;

const actionButtons = (row, handlers) => (
    <div className="flex space-x-3">
        {[
            ["Edit", EditIcon, handlers.handleEdit],
            ["View", ViewIcon, handlers.handleViewDetails],
            ["Delete", DeleteIcon, () => handlers.handleDelete(row.id)],
        ].map(([title, Icon, onClick], i) => (
            <button
                key={i}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(row);
                }}
                className={`hover:text-${
                    title === "Delete" ? "red" : "blue"
                }-800 text-${title === "Delete" ? "red" : "blue"}-600`}
                title={`${title} Details`}
            >
                <Icon />
            </button>
        ))}
    </div>
);

const columnTemplates = (handlers) => ({
    level_1: [
        {
            key: "requestedByName",
            header: "Requested By Name",
            sortable: true,
            width: "180px",
        },
        {
            key: "RequestedDate",
            header: "Requested Date",
            sortable: true,
            width: "120px",
            render: (v) => new Date(v).toLocaleDateString(),
        },
        {
            key: "RequestedByDepartment",
            header: "Department",
            sortable: true,
            width: "150px",
        },
        {
            key: "Designation",
            header: "Designation",
            sortable: true,
            width: "180px",
        },
        {
            key: "RequirementForCategory",
            header: "Category",
            sortable: true,
            width: "120px",
            render: renderBadge("category"),
        },
        {
            key: "requirementType",
            header: "Requirement Type",
            sortable: true,
            width: "150px",
            render: renderBadge("requirementType"),
        },
        {
            key: "actions",
            header: "Actions",
            sortable: false,
            width: "120px",
            cell: (row) => actionButtons(row, handlers),
        },
    ],
    level_2: [
        {
            key: "requestedByName",
            header: "Requested By Name",
            sortable: true,
            width: "180px",
        },
        {
            key: "department",
            header: "Department",
            sortable: true,
            width: "150px",
        },
        {
            key: "designation",
            header: "Designation",
            sortable: true,
            width: "180px",
        },
        {
            key: "requestReceivedDate",
            header: "Request Received Date",
            sortable: true,
            width: "160px",
            render: (v) => new Date(v).toLocaleDateString(),
        },
        {
            key: "source",
            header: "Source",
            sortable: true,
            width: "140px",
            render: renderBadge("source"),
        },
        {
            key: "recruiterName",
            header: "Recruiter Name",
            sortable: true,
            width: "150px",
        },
        {
            key: "actions",
            header: "Actions",
            sortable: false,
            width: "120px",
            cell: (row) => actionButtons(row, handlers),
        },
    ],
    level_3: [
        {
            key: "requestedByName",
            header: "Requested By Name",
            sortable: true,
            width: "180px",
        },
        {
            key: "department",
            header: "Department",
            sortable: true,
            width: "150px",
        },
        {
            key: "designation",
            header: "Designation",
            sortable: true,
            width: "180px",
        },
        {
            key: "requestCompletedDate",
            header: "Request Completed Date",
            sortable: true,
            width: "170px",
            render: (v) => (v ? new Date(v).toLocaleDateString() : "Pending"),
        },
        {
            key: "status",
            header: "Status",
            sortable: true,
            width: "120px",
            render: renderBadge("status"),
        },
        {
            key: "actions",
            header: "Actions",
            sortable: false,
            width: "120px",
            cell: (row) => actionButtons(row, handlers),
        },
    ],
});

const configByRole = {
    level_1: {
        columnsKey: "level_1",
        filters: ["department", "category", "requirementType"],
        buttonLabel: "Add New Request",
        emptyMessage: "No vacancy requests available",
    },
    level_2: {
        columnsKey: "level_2",
        filters: ["department", "source"],
        buttonLabel: "Add Candidate",
        emptyMessage: "No recruitment records available",
    },
    level_3: {
        columnsKey: "level_3",
        filters: ["department", "status"],
        buttonLabel: "Add Vacancy",
        emptyMessage: "No HR records available",
    },
};

function OpenVacanciesTab() {
    const {
        data,
        userRole = "level_1",
        handleViewDetails,
        handleEdit,
        handleDelete,
        handleRowClick,
    } = useHiringRequests();

    const roleConfig = configByRole[userRole] || configByRole.level_1;
    const columns = columnTemplates({
        handleViewDetails,
        handleEdit,
        handleDelete,
    })[roleConfig.columnsKey];

    return (
        <div className="w-full pt-3">
            <CustomTable
                columns={columns}
                data={data}
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
                            onClick={() =>
                                console.log(
                                    `${roleConfig.buttonLabel} clicked for role: ${userRole}`
                                )
                            }
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

export default OpenVacanciesTab;
