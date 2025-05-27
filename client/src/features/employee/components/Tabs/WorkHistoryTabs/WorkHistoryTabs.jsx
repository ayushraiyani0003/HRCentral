import React from "react";
import { CustomTable, CustomButton } from "../../../../../components";
import { DeleteIcon, EditIcon, ViewIcon } from "../../../../../utils/SvgIcon";

function WorkHistoryTabs() {
    // Define the columns structure
    const columns = [
        {
            key: "punchCode",
            header: "Punch Code",
            sortable: true,
            width: "100px",
        },
        {
            key: "name",
            header: "Name",
            sortable: true,
            width: "200px",
            render: (value, row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                        {row.name}
                    </span>
                    <span className="text-sm text-gray-500">
                        ({row.punchCode})
                    </span>
                </div>
            ),
        },
        {
            key: "jobTitle",
            header: "Job Title",
            sortable: true,
            width: "180px",
        },
        {
            key: "startDate",
            header: "Start Date",
            sortable: true,
            width: "120px",
            render: (value) => new Date(value).toLocaleDateString(),
        },
        {
            key: "endDate",
            header: "End Date",
            sortable: true,
            width: "120px",
            render: (value) =>
                value ? new Date(value).toLocaleDateString() : "Current",
        },
        {
            key: "department",
            header: "Department",
            sortable: true,
            width: "150px",
        },
        {
            key: "manager",
            header: "Manager",
            sortable: true,
            width: "150px",
        },
        {
            key: "designation",
            header: "Designation",
            sortable: true,
            width: "150px",
        },
        {
            key: "reasonOfChange",
            header: "Reason of Change",
            sortable: true,
            width: "180px",
            render: (value) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        value === "Promotion"
                            ? "bg-green-100 text-green-800"
                            : value === "Transfer"
                            ? "bg-blue-100 text-blue-800"
                            : value === "Resignation"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                >
                    {value}
                </span>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            sortable: false,
            width: "120px",
            cell: (row) => {
                return (
                    <div className="flex space-x-3">
                        {/* View Details Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(row); // Pass the entire row object
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit Details"
                        >
                            <EditIcon />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(row); // Pass the entire row object
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                        >
                            <ViewIcon />
                        </button>

                        {/* Delete Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(row.id);
                            }}
                            className="text-red-600 hover:text-red-800"
                            title="Delete User"
                        >
                            <DeleteIcon />
                        </button>
                    </div>
                );
            },
        },
    ];

    // Sample data - replace with actual data from your API/state
    const data = [
        {
            id: 1,
            name: "John Smith Sunilbhai fdgahjsfd",
            punchCode: "EMP001",
            jobTitle: "Senior Software Engineer",
            startDate: "2022-01-15",
            endDate: null,
            department: "Engineering",
            manager: "Sarah Johnson",
            designation: "Senior Engineer",
            reasonOfChange: "Promotion",
            status: "Active",
        },
        {
            id: 2,
            name: "Emily Davis",
            punchCode: "EMP002",
            jobTitle: "Product Manager",
            startDate: "2021-06-10",
            endDate: "2023-12-31",
            department: "Product",
            manager: "Michael Brown",
            designation: "Manager",
            reasonOfChange: "Transfer",
            status: "Inactive",
        },
        {
            id: 3,
            name: "Robert Wilson",
            punchCode: "EMP003",
            jobTitle: "UI/UX Designer",
            startDate: "2020-03-20",
            endDate: "2022-08-15",
            department: "Design",
            manager: "Lisa Anderson",
            designation: "Senior Designer",
            reasonOfChange: "Resignation",
            status: "Inactive",
        },
        {
            id: 4,
            name: "Maria Garcia",
            punchCode: "EMP004",
            jobTitle: "Data Analyst",
            startDate: "2023-02-01",
            endDate: null,
            department: "Analytics",
            manager: "David Lee",
            designation: "Analyst",
            reasonOfChange: "New Hire",
            status: "Active",
        },
        {
            id: 5,
            name: "James Thompson",
            punchCode: "EMP005",
            jobTitle: "DevOps Engineer",
            startDate: "2021-11-12",
            endDate: null,
            department: "Infrastructure",
            manager: "Jennifer White",
            designation: "Engineer",
            reasonOfChange: "Promotion",
            status: "Active",
        },
    ];

    // Action handlers
    const handleViewDetails = (row) => {
        console.log("View details for employee:", row);
        // Implement view details logic
    };

    const handleEdit = (row) => {
        console.log("Edit employee:", row);
        // Implement edit logic
    };

    const handleDelete = (id) => {
        console.log("Delete employee with ID:", id);
        // Implement delete logic with confirmation
        if (window.confirm("Are you sure you want to delete this employee?")) {
            // Delete logic here
        }
    };

    const handleToggleStatus = (id, currentStatus) => {
        console.log(
            "Toggle status for employee ID:",
            id,
            "Current status:",
            currentStatus
        );
        // Implement status toggle logic
    };

    const handleRowClick = (row) => {
        console.log("Row clicked:", row);
        // Optional: Handle row click if needed
    };

    const extraHeaderContent = (
        <div className="flex items-center justify-end space-x-2">
            <CustomButton
                label="Add Work History"
                onClick={() => {}}
                variant="primary"
                size="small" // Use 'small' for a slim button
                className="px-3 py-2 text-sm rounded-md font-medium transition-all shadow-sm hover:shadow-md"
                ariaLabel="Add Work History Button"
                testId="add-work-history-btn"
                bgColor="bg-blue-600"
                hoverColor="hover:bg-blue-500"
                color="text-white"
                borderRadius="rounded"
            >
                Add Work History
            </CustomButton>
        </div>
    );

    return (
        <div className="w-full pt-3">
            <CustomTable
                columns={columns}
                data={data}
                itemsPerPageOptions={[10, 25, 50, 100]}
                defaultItemsPerPage={25}
                searchable={true}
                extraHeaderContent={extraHeaderContent}
                filterable={true}
                filterableColumns={["department", "designation"]}
                sortable={true}
                pagination={true}
                className="work-history-table"
                emptyMessage="No work history records available"
                loading={false}
                onRowClick={handleRowClick}
                tableHeight="620px"
                tableWidth="100%"
                rowHeight="38px"
                tdClassName="!py-2 !px-1"
                thCustomStyles="!px-1 !py-2"
                // Enable horizontal scroll for table overflow
                style={{
                    overflowX: "auto",
                    minWidth: "1200px", // Minimum width to ensure all columns are visible
                }}
            />
        </div>
    );
}

export default WorkHistoryTabs;
