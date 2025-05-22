import React from "react";
import { CustomTable, CustomButton } from "../../../../../components";
import { DeleteIcon, EditIcon, PasswordHideIcon } from "../../../../../utils/SvgIcon";

function ExitedEmployeeTabs() {
    // Define the columns structure for exited employees
    const columns = [
        {
            key: "punchCode",
            header: "Punch Code",
            sortable: true,
            width: "100px",
        },
        {
            key: "name",
            header: "Employee Name",
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
            key: "exitReason",
            header: "Exit Reason",
            sortable: true,
            width: "150px",
            render: (value) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        value === "Resignation"
                            ? "bg-orange-100 text-orange-800"
                            : value === "Termination"
                            ? "bg-red-100 text-red-800"
                            : value === "Retirement"
                            ? "bg-blue-100 text-blue-800"
                            : value === "Contract End"
                            ? "bg-gray-100 text-gray-800"
                            : value === "Layoff"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                    {value}
                </span>
            ),
        },
        {
            key: "dateOfExit",
            header: "Exit Date",
            sortable: true,
            width: "120px",
            render: (value) => new Date(value).toLocaleDateString(),
        },
        {
            key: "lastWorkingDay",
            header: "Last Working Day",
            sortable: true,
            width: "140px",
            render: (value) => new Date(value).toLocaleDateString(),
        },
        {
            key: "noticePeriod",
            header: "Notice Period",
            sortable: true,
            width: "120px",
            render: (value) => `${value} days`,
        },
        {
            key: "relievingStatus",
            header: "Relieving Status",
            sortable: true,
            width: "140px",
            render: (value) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        value === "Completed"
                            ? "bg-green-100 text-green-800"
                            : value === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
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
                                handleViewDetails(row);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                        >
                            <PasswordHideIcon />
                        </button>

                        {/* Edit Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(row);
                            }}
                            className="text-green-600 hover:text-green-800"
                            title="Edit Exit Details"
                        >
                            <EditIcon />
                        </button>

                        {/* Delete Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(row.id);
                            }}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Record"
                        >
                            <DeleteIcon />
                        </button>
                    </div>
                );
            },
        },
    ];

    // Sample data for exited employees
    const data = [
        {
            id: 1,
            name: "John Smith",
            punchCode: "EMP001",
            department: "Engineering",
            manager: "Sarah Johnson",
            exitReason: "Resignation",
            dateOfExit: "2024-03-15",
            lastWorkingDay: "2024-03-15",
            noticePeriod: 30,
            relievingStatus: "Completed",
        },
        {
            id: 2,
            name: "Emily Davis",
            punchCode: "EMP002",
            department: "Product",
            manager: "Michael Brown",
            exitReason: "Termination",
            dateOfExit: "2024-02-28",
            lastWorkingDay: "2024-02-28",
            noticePeriod: 0,
            relievingStatus: "Completed",
        },
        {
            id: 3,
            name: "Robert Wilson",
            punchCode: "EMP003",
            department: "Design",
            manager: "Lisa Anderson",
            exitReason: "Contract End",
            dateOfExit: "2024-01-31",
            lastWorkingDay: "2024-01-31",
            noticePeriod: 0,
            relievingStatus: "Completed",
        },
        {
            id: 4,
            name: "Maria Garcia",
            punchCode: "EMP004",
            department: "Analytics",
            manager: "David Lee",
            exitReason: "Retirement",
            dateOfExit: "2024-04-01",
            lastWorkingDay: "2024-04-01",
            noticePeriod: 60,
            relievingStatus: "Pending",
        },
        {
            id: 5,
            name: "James Thompson",
            punchCode: "EMP005",
            department: "Infrastructure",
            manager: "Jennifer White",
            exitReason: "Layoff",
            dateOfExit: "2024-02-15",
            lastWorkingDay: "2024-02-15",
            noticePeriod: 0,
            relievingStatus: "Completed",
        },
        {
            id: 6,
            name: "Anna Martinez",
            punchCode: "EMP006",
            department: "Sales",
            manager: "Tom Wilson",
            exitReason: "Resignation",
            dateOfExit: "2024-05-10",
            lastWorkingDay: "2024-05-20",
            noticePeriod: 30,
            relievingStatus: "Pending",
        },
    ];

    // Action handlers
    const handleViewDetails = (row) => {
        console.log("View exit details for employee:", row);
        // Implement view exit details logic - could open a modal with full exit information
    };

    const handleEdit = (row) => {
        console.log("Edit exit details for employee:", row);
        // Implement edit exit details logic - could open edit form
    };

    const handleDelete = (id) => {
        console.log("Delete exit record with ID:", id);
        // Implement delete logic with confirmation
        if (window.confirm("Are you sure you want to delete this exit record? This action cannot be undone.")) {
            // Delete logic here
        }
    };

    const handleRowClick = (row) => {
        console.log("Exit record clicked:", row);
        // Optional: Handle row click to show detailed view
    };

    const extraHeaderContent = (
        <div className="flex items-center justify-end space-x-2">
            <CustomButton
                label="Add Exit Employee"
                onClick={() => {
                    console.log("Add new exit employee record");
                    // Handle adding new exit employee
                }}
                variant="primary"
                size="small"
                className="px-3 py-2 text-sm rounded-md font-medium transition-all shadow-sm hover:shadow-md"
                ariaLabel="Add Exit Employee Button"
                testId="add-exit-employee-btn"
                bgColor="bg-red-600"
                hoverColor="hover:bg-red-500"
                color="text-white"
                borderRadius="rounded"
            >
                Add Exit Employee
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
                filterableColumns={["department", "exitReason", "relievingStatus"]}
                sortable={true}
                pagination={true}
                className="exited-employee-table"
                emptyMessage="No exited employee records available"
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

export default ExitedEmployeeTabs;