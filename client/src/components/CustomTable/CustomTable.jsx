import React, {
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef,
} from "react";
import "./customTableStyles.css";

// Usage :
// import React, { useState } from "react";
// import CustomTable from "./components/CustomTable/CustomTable";

// function App() {
//     // Sample data for demonstration
//     const [userData] = useState([
//         {
//             id: 1,
//             name: "John Doe",
//             email: "john.doe@example.com",
//             role: "Admin",
//             status: "Active",
//             joinDate: "2023-01-15",
//             lastLogin: "2025-04-20T09:30:00",
//         },
//         {
//             id: 2,
//             name: "Jane Smith",
//             email: "jane.smith@example.com",
//             role: "User",
//             status: "Inactive",
//             joinDate: "2023-02-21",
//             lastLogin: "2025-03-15T14:20:00",
//         },
//         {
//             id: 3,
//             name: "Robert Johnson",
//             email: "robert.johnson@example.com",
//             role: "Editor",
//             status: "Active",
//             joinDate: "2023-03-10",
//             lastLogin: "2025-04-21T11:45:00",
//         },
//         {
//             id: 10,
//             name: "Jessica Anderson",
//             email: "jessica.anderson@example.com",
//             role: "Admin",
//             status: "Active",
//             joinDate: "2023-10-18",
//             lastLogin: "2025-04-20T16:30:00",
//         },
//         {
//             id: 11,
//             name: "Daniel Thomas",
//             email: "daniel.thomas@example.com",
//             role: "User",
//             status: "Active",
//             joinDate: "2023-11-07",
//             lastLogin: "2025-04-15T10:20:00",
//         },
//         {
//             id: 12,
//             name: "Jennifer Martinez",
//             email: "jennifer.martinez@example.com",
//             role: "Editor",
//             status: "Active",
//             joinDate: "2023-12-01",
//             lastLogin: "2025-04-18T14:15:00",
//         },
//     ]);

//     // Define table columns with configuration
//     const columns = [
//         {
//             key: "id",
//             header: "ID",
//             sortable: true,
//             width: "80px", // Set explicit width
//         },
//         {
//             key: "name",
//             header: "Name",
//             sortable: true,
//             width: "250px",
//         },
//         {
//             key: "email",
//             header: "Email",
//             sortable: true,
//             width: "200px",
//         },
//         {
//             key: "role",
//             header: "Role",
//             sortable: true,
//             filterable: true,
//             width: "120px",
//         },
//         {
//             key: "status",
//             header: "Status",
//             sortable: true,
//             filterable: true,
//             width: "120px",
//             // Custom render function to style the status cell
//             render: (value) => (
//                 <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         value === "Active"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-red-100 text-red-800"
//                     }`}
//                 >
//                     {value}
//                 </span>
//             ),
//         },
//         {
//             key: "joinDate",
//             header: "Join Date",
//             sortable: true,
//             width: "100px",
//             // Custom render function to format the date
//             render: (value) => {
//                 return new Date(value).toLocaleDateString();
//             },
//         },
//         {
//             key: "lastLogin",
//             header: "Last Login",
//             sortable: true,
//             width: "180px",
//             // Custom render function to format the datetime
//             render: (value) => {
//                 const date = new Date(value);
//                 return `${date.toLocaleDateString()} ${date.toLocaleTimeString(
//                     [],
//                     {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                     }
//                 )}`;
//             },
//         },
//         {
//             key: "actions",
//             header: "Actions",
//             sortable: false,
//             filterable: false,
//             searchable: false,
//             // Custom render function for action buttons
//             render: (_, user) => (
//                 <div className="flex space-x-2">
//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             handleEdit(user);
//                         }}
//                         className="text-blue-600 hover:text-blue-800"
//                     >
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                             className="w-5 h-5"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                             />
//                         </svg>
//                     </button>
//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             handleDelete(user.id);
//                         }}
//                         className="text-red-600 hover:text-red-800"
//                     >
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                             className="w-5 h-5"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                             />
//                         </svg>
//                     </button>
//                 </div>
//             ),
//         },
//     ];

//     // Example handlers for row click and actions
//     const handleRowClick = (user) => {
//         console.log("Row clicked:", user);
//         // You can navigate to user details page or open a modal
//     };

//     const handleEdit = (user) => {
//         console.log("Edit user:", user);
//         // Open edit form or modal
//     };

//     const handleDelete = (userId) => {
//         console.log("Delete user ID:", userId);
//         // Show confirmation dialog and delete
//     };

//     return (
//         <div className="App flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//             <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
//                 <h1 className="text-2xl font-bold text-gray-800 mb-6">
//                     User Management
//                 </h1>

//                 {/* CustomTable Component */}
//                 <CustomTable
//                     columns={columns}
//                     data={userData}
//                     onRowClick={handleRowClick}
//                     searchable={true}
//                     filterable={true}
//                     filterableColumns={["status"]} // Only allow filtering on these columns
//                     sortable={true}
//                     pagination={true}
//                     itemsPerPageOptions={[5, 10, 20, 50]}
//                     defaultItemsPerPage={10}
//                     emptyMessage="No users found"
//                     loading={false}
//                     className="user-table"
//                     tableHeight="650px" // Fixed height for the table
//                     rowHeight="61px" // Height of each row including padding
//                     tableWidth="100%"
//                 />
//             </div>
//         </div>
//     );
// }

const CustomTable = ({
    columns = [],
    data = [],
    itemsPerPageOptions = [10, 25, 50, 100],
    defaultItemsPerPage = 10,
    searchable = true,
    filterable = true,
    filterableColumns = [], // Array of column keys that should have filters
    sortable = true,
    pagination = true,
    className = "",
    extraHeaderContent = function () {
        return null;
    },
    emptyMessage = "No data available",
    loading = false,
    onRowClick,
    tableHeight = "500px", // Default fixed height for the table
    tableWidth = "100%", // Default width for the table
    rowHeight = "61px", // Default height for each row (including borders)
    tdClassName = "p-2", // Default height for each cell (including borders
    thCustomStyles = "",
    tableControlClassName = "",
}) => {
    // State for table functionality
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });
    const [filters, setFilters] = useState({});
    const [activeFilters, setActiveFilters] = useState({});

    // Use refs to track if we've already initialized filters
    const filtersInitialized = useRef(false);
    const prevDataLength = useRef(data.length);
    const prevColumnsKey = useRef("");

    // Generate a stable key for columns
    const columnsKey = useMemo(() => {
        return columns
            .map((c) => c.accessor || c.key || c.header || "")
            .join("|");
    }, [columns]);

    // Create a memoized value for the stringified filters
    const stringifiedFilters = useMemo(
        () => JSON.stringify(activeFilters),
        [activeFilters]
    );

    // Reset pagination when data changes or search/filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [data.length, searchTerm, stringifiedFilters]);

    // Initialize filter options for each column - with strict dependency checks
    useEffect(() => {
        // Skip if filterable is false or we're not supposed to re-initialize
        if (!filterable) return;

        // Only recalculate filters when data or columns actually change
        if (
            filtersInitialized.current &&
            prevDataLength.current === data.length &&
            prevColumnsKey.current === columnsKey
        ) {
            return;
        }

        // Update our tracking refs
        prevDataLength.current = data.length;
        prevColumnsKey.current = columnsKey;
        filtersInitialized.current = true;

        // Now calculate the filters
        const initialFilters = {};

        columns.forEach((column) => {
            const columnKey = column.key || column.header || column.accessor;
            if (!columnKey) return; // Skip columns with no key

            // Check if column should have filter
            const shouldHaveFilter =
                (filterableColumns.length > 0 &&
                    filterableColumns.includes(columnKey)) ||
                (filterableColumns.length === 0 && column.filterable !== false);

            if (shouldHaveFilter) {
                const uniqueValues = [
                    ...new Set(
                        data.map((item) => {
                            let value;
                            if (
                                column.accessor &&
                                item[column.accessor] !== undefined
                            ) {
                                value = item[column.accessor];
                            } else if (
                                columnKey &&
                                item[columnKey] !== undefined
                            ) {
                                value = item[columnKey];
                            } else {
                                value = "";
                            }

                            return value !== null && value !== undefined
                                ? String(value)
                                : "";
                        })
                    ),
                ]
                    .filter(Boolean)
                    .sort();

                initialFilters[columnKey] = uniqueValues;
            }
        });

        setFilters(initialFilters);
    }, [filterable, data.length, columnsKey, filterableColumns]);

    // Handle sorting
    const handleSort = useCallback(
        (key) => {
            if (!sortable) return;

            let direction = "asc";
            if (sortConfig.key === key && sortConfig.direction === "asc") {
                direction = "desc";
            }
            setSortConfig({ key, direction });
        },
        [sortable, sortConfig]
    );

    // Handle search
    const handleSearch = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    // Handle filter change
    const handleFilterChange = useCallback((columnKey, value) => {
        setActiveFilters((prev) => {
            const newFilters = { ...prev };
            if (value === "") {
                delete newFilters[columnKey];
            } else {
                newFilters[columnKey] = value;
            }
            return newFilters;
        });
    }, []);

    // Handle pagination
    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    const handleItemsPerPageChange = useCallback((e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    }, []);

    // Apply filters, search, and sorting to data
    const filteredAndSortedData = useMemo(() => {
        let processedData = [...data];

        // Apply filters
        if (Object.keys(activeFilters).length > 0) {
            processedData = processedData.filter((item) => {
                return Object.entries(activeFilters).every(([key, value]) => {
                    const column = columns.find(
                        (col) => (col.key || col.header || col.accessor) === key
                    );

                    if (!column) return true; // Skip if column not found

                    let itemValue;
                    if (
                        column.accessor &&
                        item[column.accessor] !== undefined
                    ) {
                        itemValue = item[column.accessor];
                    } else if (column.key && item[column.key] !== undefined) {
                        itemValue = item[column.key];
                    } else if (
                        column.header &&
                        item[column.header] !== undefined
                    ) {
                        itemValue = item[column.header];
                    } else {
                        return false; // No matching value found
                    }

                    return String(itemValue) === value;
                });
            });
        }

        // Apply search across all searchable columns
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            processedData = processedData.filter((item) => {
                return columns.some((column) => {
                    if (column.searchable === false) return false;

                    let value;
                    if (
                        column.accessor &&
                        item[column.accessor] !== undefined
                    ) {
                        value = item[column.accessor];
                    } else if (column.key && item[column.key] !== undefined) {
                        value = item[column.key];
                    } else if (
                        column.header &&
                        item[column.header] !== undefined
                    ) {
                        value = item[column.header];
                    } else {
                        return false; // No matching value found
                    }

                    return (
                        value !== null &&
                        String(value).toLowerCase().includes(searchLower)
                    );
                });
            });
        }

        // Apply sorting
        if (sortConfig.key) {
            processedData.sort((a, b) => {
                const column = columns.find(
                    (col) =>
                        (col.key || col.header || col.accessor) ===
                        sortConfig.key
                );

                if (!column) return 0; // No sorting if column not found

                let aValue, bValue;

                if (column.accessor) {
                    aValue = a[column.accessor];
                    bValue = b[column.accessor];
                } else if (column.key) {
                    aValue = a[column.key];
                    bValue = b[column.key];
                } else if (column.header) {
                    aValue = a[column.header];
                    bValue = b[column.header];
                } else {
                    return 0; // Can't sort without a valid accessor
                }

                // Handle custom sorting logic if provided
                if (column.sortFn) {
                    return column.sortFn(aValue, bValue, sortConfig.direction);
                }

                // Default sorting logic
                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;

                // Handle string comparisons
                if (typeof aValue === "string") aValue = aValue.toLowerCase();
                if (typeof bValue === "string") bValue = bValue.toLowerCase();

                if (aValue < bValue)
                    return sortConfig.direction === "asc" ? -1 : 1;
                if (aValue > bValue)
                    return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        return processedData;
    }, [data, columns, searchTerm, sortConfig, activeFilters]);

    // Pagination calculations
    const totalItems = filteredAndSortedData.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentData = filteredAndSortedData.slice(startIndex, endIndex);

    // Generate pagination buttons
    const paginationButtons = useMemo(() => {
        const buttons = [];
        const maxVisiblePages = 5;

        if (totalPages <= 1) return buttons;

        // Always show first page
        buttons.push(
            <button
                key="first"
                className={`pagination-button ${
                    safeCurrentPage === 1 ? "active" : ""
                }`}
                onClick={() => handlePageChange(1)}
                disabled={safeCurrentPage === 1}
            >
                1
            </button>
        );

        // Calculate range of visible page buttons
        let startPage = Math.max(
            2,
            safeCurrentPage - Math.floor(maxVisiblePages / 2)
        );
        let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);

        // Adjust if we're near the beginning
        if (startPage > 2) {
            buttons.push(
                <span key="ellipsis1" className="pagination-ellipsis">
                    ...
                </span>
            );
        }

        // Add page buttons
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    className={`pagination-button ${
                        safeCurrentPage === i ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        // Add ellipsis if needed
        if (endPage < totalPages - 1) {
            buttons.push(
                <span key="ellipsis2" className="pagination-ellipsis">
                    ...
                </span>
            );
        }

        // Always show last page
        if (totalPages > 1) {
            buttons.push(
                <button
                    key="last"
                    className={`pagination-button ${
                        safeCurrentPage === totalPages ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(totalPages)}
                    disabled={safeCurrentPage === totalPages}
                >
                    {totalPages}
                </button>
            );
        }

        return buttons;
    }, [safeCurrentPage, totalPages, handlePageChange]);

    // Render cell content with custom renderer if provided
    const renderCell = useCallback((item, column) => {
        // Use cell render function if provided
        if (column.cell) {
            return column.cell(item);
        }

        // Otherwise render normally
        let value;
        if (column.accessor && item[column.accessor] !== undefined) {
            value = item[column.accessor];
        } else if (column.key && item[column.key] !== undefined) {
            value = item[column.key];
        } else if (column.header && item[column.header] !== undefined) {
            value = item[column.header];
        } else {
            value = ""; // Default empty value
        }

        return value;
    }, []);

    return (
        <div
            className={`custom-table-container ${className}`}
            style={{ width: tableWidth }}
        >
            {/* Table controls */}
            <div className={`table-controls ${tableControlClassName}`}>
                <div className="flex flex-row gap-3 items-center">
                    {searchable && (
                        <div className="search-container">
                            <input
                                type="text"
                                className="custom-input-field search-input"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <div className="custom-table-search-input-icons">
                                {searchTerm && (
                                    <button
                                        type="button"
                                        className="clear-input-button"
                                        onClick={() => setSearchTerm("")}
                                        aria-label="Clear search"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className="clear-icon"
                                            width="20"
                                            height="20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                )}
                                <div className="input-icon">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="search-icon"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    {typeof extraHeaderContent === "function" &&
                        extraHeaderContent() && (
                            <div className="extra-header-content">
                                {extraHeaderContent()}
                            </div>
                        )}
                </div>

                {filterable && (
                    <div className="filters-container">
                        {columns.map((column, colIndex) => {
                            const columnKey =
                                column.key || column.header || column.accessor;
                            if (!columnKey) return null; // Skip columns with no key

                            // Check if column should have filter
                            const shouldHaveFilter =
                                (filterableColumns.length > 0 &&
                                    filterableColumns.includes(columnKey)) ||
                                (filterableColumns.length === 0 &&
                                    column.filterable !== false);

                            return shouldHaveFilter &&
                                filters[columnKey] &&
                                filters[columnKey].length > 0 ? (
                                <div
                                    key={`filter-${colIndex}`}
                                    className="filter-select-container"
                                >
                                    <select
                                        className="filter-select"
                                        value={activeFilters[columnKey] || ""}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                columnKey,
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            All {column.header}
                                        </option>
                                        {filters[columnKey].map(
                                            (value, valIndex) => (
                                                <option
                                                    key={`opt-${valIndex}`}
                                                    value={value}
                                                >
                                                    {value}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            ) : null;
                        })}
                    </div>
                )}
            </div>

            {/* Table */}
            <div
                className="table-wrapper"
                style={{
                    height: tableHeight,
                    overflowX: "auto", // Enable horizontal scrolling for entire table
                }}
            >
                <table className="custom-table">
                    <colgroup>
                        {columns.map((column, index) => (
                            <col
                                key={`col-${index}`}
                                style={{
                                    width: column.width || "auto",
                                    minWidth: column.minWidth || "auto",
                                    maxWidth: column.maxWidth || "none",
                                }}
                            />
                        ))}
                    </colgroup>
                    <thead>
                        <tr>
                            {columns.map((column, colIndex) => {
                                const columnKey =
                                    column.key ||
                                    column.header ||
                                    column.accessor;

                                return (
                                    <th
                                        key={`header-${colIndex}`}
                                        className={`${
                                            sortable &&
                                            column.sortable !== false
                                                ? "sortable"
                                                : ""
                                        } ${
                                            sortConfig.key === columnKey
                                                ? sortConfig.direction
                                                : ""
                                        }
                                        ${thCustomStyles}
                                        `}
                                        onClick={() =>
                                            sortable &&
                                            column.sortable !== false &&
                                            columnKey &&
                                            handleSort(columnKey)
                                        }
                                        style={{
                                            width: column.width || "auto",
                                            minWidth: column.minWidth || "auto",
                                            maxWidth: column.maxWidth || "none",
                                        }}
                                    >
                                        <div className="custom-table-th-content">
                                            {column.header}
                                            {sortable &&
                                                column.sortable !== false && (
                                                    <div className="sort-icons">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            className={`sort-icon ${
                                                                sortConfig.key ===
                                                                    columnKey &&
                                                                sortConfig.direction ===
                                                                    "asc"
                                                                    ? "active"
                                                                    : ""
                                                            }`}
                                                            width="16"
                                                            height="16"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            className={`sort-icon ${
                                                                sortConfig.key ===
                                                                    columnKey &&
                                                                sortConfig.direction ===
                                                                    "desc"
                                                                    ? "active"
                                                                    : ""
                                                            }`}
                                                            width="16"
                                                            height="16"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className={`loading-cell ${
                                        tdClassName ? tdClassName : ""
                                    }`}
                                >
                                    <div className="loading-spinner"></div>
                                    <span>Loading...</span>
                                </td>
                            </tr>
                        ) : currentData.length > 0 ? (
                            currentData.map((item, rowIndex) => (
                                <tr
                                    key={`row-${rowIndex}`}
                                    onClick={() =>
                                        onRowClick && onRowClick(item)
                                    }
                                    className={onRowClick ? "clickable" : ""}
                                >
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={`cell-${rowIndex}-${colIndex}`}
                                            className={`${
                                                column.className || ""
                                            } ${
                                                tdClassName ? tdClassName : ""
                                            }`}
                                        >
                                            {renderCell(item, column)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className={`empty-cell ${
                                        tdClassName ? tdClassName : ""
                                    }`}
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                        {/* Add empty rows to maintain consistent table height */}
                        {!loading &&
                            currentData.length > 0 &&
                            currentData.length < itemsPerPage &&
                            Array.from({
                                length: itemsPerPage - currentData.length,
                            }).map((_, index) => (
                                <tr
                                    key={`empty-${index}`}
                                    className="empty-row"
                                    style={{ height: rowHeight }}
                                >
                                    <td colSpan={columns.length}>&nbsp;</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && totalItems > 0 && (
                <div className="pagination-container">
                    <div className="pagination-info">
                        Showing {totalItems > 0 ? startIndex + 1 : 0} to{" "}
                        {endIndex} of {totalItems} entries
                    </div>
                    <div className="pagination-controls">
                        <button
                            className="pagination-arrow"
                            onClick={() =>
                                handlePageChange(safeCurrentPage - 1)
                            }
                            disabled={safeCurrentPage === 1}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                width="20"
                                height="20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <div className="pagination-pages">
                            {paginationButtons}
                        </div>
                        <button
                            className="pagination-arrow"
                            onClick={() =>
                                handlePageChange(safeCurrentPage + 1)
                            }
                            disabled={safeCurrentPage === totalPages}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                width="20"
                                height="20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="items-per-page">
                        <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="items-per-page-select"
                        >
                            {itemsPerPageOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option} per page
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomTable;
