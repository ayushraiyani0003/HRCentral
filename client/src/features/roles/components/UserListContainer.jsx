import React, { useState } from "react";
import {
    CustomButton,
    CustomContainer,
    CustomTable,
} from "../../../components";
import "./UserListContainer.css";
import { colorPalette } from "../../../utils/colorPalatte";

function UserListContainer({ userLevel = "level_1" }) {
    // Check if user has read-only access
    const isReadOnly = userLevel === "level_1";

    // this variable is the use for the color generate for each different role
    const roleColorMap = {};
    let colorIndex = 0;

    const [userData, setUserData] = useState([
        {
            id: "USR-001",
            user: "alex_wilson",
            name: "Alex Wilson",
            phone: "+1 (555) 123-4567",
            role: "Admin",
            department: "Engineering",
            designation: "Lead Developer",
            status: "Active",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            joinDate: "2023-09-15T08:30:00",
            lastActive: "2024-05-04T13:22:10",
        },
        {
            id: "USR-002",
            user: "sophia_chen",
            name: "Sophia Chen",
            phone: "+1 (555) 987-6543",
            role: "Manager",
            department: "Product",
            designation: "Product Manager",
            status: "Active",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            joinDate: "2023-05-22T10:15:00",
            lastActive: "2024-05-03T16:45:30",
        },
        {
            id: "USR-003",
            user: "marcus_johnson",
            name: "Marcus Johnson",
            phone: "+1 (555) 234-5678",
            role: "User",
            department: "Marketing",
            designation: "Marketing Specialist",
            status: "Inactive",
            avatar: "https://randomuser.me/api/portraits/men/22.jpg",
            joinDate: "2023-11-08T14:20:00",
            lastActive: "2024-04-15T09:10:45",
        },
        {
            id: "USR-004",
            user: "priya_patel",
            name: "Priya Patel",
            phone: "+1 (555) 876-5432",
            role: "Editor",
            department: "Content",
            designation: "Content Strategist",
            status: "Active",
            avatar: "https://randomuser.me/api/portraits/women/65.jpg",
            joinDate: "2024-01-18T11:05:00",
            lastActive: "2024-05-04T10:30:15",
        },
        {
            id: "USR-005",
            user: "david_kim",
            name: "David Kim",
            phone: "+1 (555) 456-7890",
            role: "Admin",
            department: "Finance",
            designation: "Finance Director",
            status: "Inactive",
            avatar: "https://randomuser.me/api/portraits/men/55.jpg",
            joinDate: "2023-07-30T09:45:00",
            lastActive: "2024-04-20T15:50:22",
        },
    ]);

    // It will create one map for all different roles and assign a color to each.
    const assignColorToRole = (role) => {
        if (!roleColorMap[role]) {
            const [bg, text] = colorPalette[colorIndex % colorPalette.length];
            roleColorMap[role] = `${bg} ${text}`;
            colorIndex++;
        }
        return roleColorMap[role];
    };

    // Handle viewing user details
    const handleViewDetails = (user) => {
        // console.log("View details for user:", user); // debug only
        // Implement navigation to user details page or show modal
    };

    // Handle editing user
    const handleEdit = (user) => {
        // Prevent editing for level_1 users
        if (isReadOnly) return;

        // console.log("Edit user:", user); // debug only
        // Implement edit functionality
    };

    // Handle deleting user
    const handleDelete = (userId) => {
        // Prevent deletion for level_1 users
        if (isReadOnly) return;

        // console.log("Delete user with ID:", userId); // debug only
        // Implement delete confirmation and functionality
        if (window.confirm(`Are you sure you want to delete user ${userId}?`)) {
            setUserData(userData.filter((user) => user.id !== userId));
        }
    };

    // Handle toggling user status
    const handleToggleStatus = (userId, currentStatus) => {
        // Prevent status toggle for level_1 users
        if (isReadOnly) return;

        // console.log(`Toggle status for user ${userId} from ${currentStatus}`); // debug only
        setUserData(
            userData.map((user) => {
                if (user.id === userId) {
                    return {
                        ...user,
                        status:
                            user.status === "Active" ? "Inactive" : "Active",
                    };
                }
                return user;
            })
        );
    };

    // Handle add user
    const handleAddUser = () => {
        // Prevent adding user for level_1 users
        if (isReadOnly) return;

        // console.log("Add new user"); // debug only
        // Implement add user functionality
    };

    // Handle export
    const handleExport = () => {
        // console.log("Export users"); // debug only
        // Implement export functionality
    };

    // Define table columns with configuration
    const columns = [
        {
            key: "user",
            header: "User",
            sortable: true,
            width: "180px",
            accessor: "name",
            cell: (row) => {
                const name = row.name;
                const lastActive = row.lastActive;
                return (
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-100 overflow-hidden flex-shrink-0">
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                                {name}
                            </span>
                            <span className="text-xs text-gray-500">
                                Last active:{" "}
                                {new Date(lastActive).toLocaleString([], {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            key: "name",
            header: "Name",
            sortable: true,
            width: "150px",
        },
        {
            key: "phone",
            header: "Phone",
            sortable: true,
            width: "150px",
        },
        {
            key: "role",
            header: "Role",
            accessor: "role", // Important for sorting and filtering
            sortable: true,
            filterable: true,
            width: "120px",
            cell: (row) => {
                return (
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${assignColorToRole(
                            row.role
                        )}`}
                    >
                        {row.role}
                    </span>
                );
            },
        },
        {
            key: "department",
            header: "Department",
            sortable: true,
            filterable: true,
            width: "140px",
        },
        {
            key: "designation",
            header: "Designation",
            sortable: true,
            width: "160px",
        },
        {
            key: "status",
            header: "Status",
            accessor: "status", // Important for sorting and filtering
            sortable: true,
            filterable: true,
            width: "120px",
            cell: (row) => {
                return (
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                            row.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                        {row.status}
                    </span>
                );
            },
        },
        {
            key: "actions",
            header: "Actions",
            sortable: false,
            filterable: false,
            searchable: false,
            width: "120px",
            cell: (row) => {
                return (
                    <div className="flex space-x-2">
                        {/* View Details Button - Always visible */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(row); // Pass the entire row object
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </button>

                        {/* Delete Button - Only for level_2 users */}
                        {!isReadOnly && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(row.id);
                                }}
                                className="text-red-600 hover:text-red-800"
                                title="Delete User"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </button>
                        )}

                        {/* Options Dropdown - Only for level_2 users */}
                        {!isReadOnly && (
                            <div className="relative group">
                                <button
                                    onClick={(e) => e.stopPropagation()} // Prevent row click
                                    className="text-gray-600 hover:text-gray-800"
                                    title="More Options"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                        />
                                    </svg>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block z-150 ">
                                    <div
                                        className="py-1"
                                        role="menu"
                                        aria-orientation="vertical"
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(row); // Pass the entire row object
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            role="menuitem"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleStatus(
                                                    row.id,
                                                    row.status
                                                );
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            role="menuitem"
                                        >
                                            {row.status === "Active"
                                                ? "Deactivate"
                                                : "Activate"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <CustomContainer
            title="User Management"
            description={
                isReadOnly
                    ? "You have read-only access to view users. Contact your administrator for editing privileges."
                    : "Manage all users, their roles, departments and access levels in your organization."
            }
            titleCssClass="!text-2xl !font-semibold"
            headerActions={
                <div className="flex space-x-3">
                    {/* Export button - Always visible */}
                    <CustomButton
                        className="inline-flex items-center gap-2 rounded-lg bg-gray-200 hover:bg-gray-300 px-4 py-2 text-gray-700 shadow-sm active:scale-95 transition-all duration-200"
                        onClick={handleExport}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                            />
                        </svg>
                        Export
                    </CustomButton>
                    {/* Add User button - Only for level_2 users */}
                    {!isReadOnly && (
                        <CustomButton
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 px-4 py-2 text-white shadow-md active:scale-95 transition-all duration-200"
                            onClick={handleAddUser}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            Add User
                        </CustomButton>
                    )}
                </div>
            }
        >
            <CustomTable
                columns={columns}
                data={userData}
                searchable={true}
                filterable={true}
                filterableColumns={["role", "department", "status"]}
                sortable={true}
                pagination={true}
                itemsPerPageOptions={[5, 10, 20, 50]}
                defaultItemsPerPage={10}
                emptyMessage="No users found"
                loading={false}
                className="user-table"
                tableHeight="650px"
                rowHeight="70px"
                tableWidth="100%"
                hoverEffect={true}
                striped={true}
                highlightOnHover={true}
            />
        </CustomContainer>
    );
}

export default UserListContainer;
