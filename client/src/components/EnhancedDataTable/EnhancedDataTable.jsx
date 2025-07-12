import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from "react";
import PropTypes from "prop-types";
import "./EnhancedDataTable.css";

// Icons for the table functionalities
const SortIcon = ({ direction }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`sort-icon ${direction}`}
        width="14"
        height="14"
    >
        {direction === "asc" && <path d="M18 15l-6-6-6 6" />}
        {direction === "desc" && <path d="M6 9l6 6 6-6" />}
        {!direction && (
            <>
                <path d="M7 10l5-5 5 5" />
                <path d="M7 14l5 5 5-5" />
            </>
        )}
    </svg>
);

const FilterIcon = ({ active }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`filter-icon ${active ? "active" : ""}`}
        width="14"
        height="14"
    >
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
);

const ResizeHandle = ({ onMouseDown }) => (
    <div className="resize-handle" onMouseDown={onMouseDown}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="10"
            height="16"
        >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    </div>
);

// Filter component for individual columns
const ColumnFilter = ({
    column,
    onApplyFilter,
    onClearFilter,
    currentFilter,
}) => {
    const [value, setValue] = useState(currentFilter?.value || "");
    const [operator, setOperator] = useState(
        currentFilter?.operator || "contains"
    );

    const applyFilter = () => {
        if (!value.trim()) {
            onClearFilter(column.field);
            return;
        }

        onApplyFilter(column.field, { operator, value });
    };

    const operators = [
        { value: "contains", label: "Contains" },
        { value: "equals", label: "Equals" },
        { value: "startsWith", label: "Starts With" },
        { value: "endsWith", label: "Ends With" },
        { value: "gt", label: "Greater Than" },
        { value: "lt", label: "Less Than" },
        { value: "gte", label: "Greater Than or Equal" },
        { value: "lte", label: "Less Than or Equal" },
        { value: "empty", label: "Is Empty" },
        { value: "notEmpty", label: "Is Not Empty" },
    ];

    const isNumeric = column.type === "number";
    const isDate = column.type === "date";

    // Filter operators based on column type
    const filteredOperators = operators.filter((op) => {
        if (isNumeric) {
            return [
                "equals",
                "gt",
                "lt",
                "gte",
                "lte",
                "empty",
                "notEmpty",
            ].includes(op.value);
        }
        if (isDate) {
            return [
                "equals",
                "gt",
                "lt",
                "gte",
                "lte",
                "empty",
                "notEmpty",
            ].includes(op.value);
        }
        return true;
    });

    return (
        <div className="column-filter">
            <div className="filter-header">
                <span>Filter: {column.header}</span>
                <button
                    className="close-filter"
                    onClick={() => onClearFilter(column.field)}
                    aria-label="Close filter"
                >
                    &times;
                </button>
            </div>

            <div className="filter-body">
                <select
                    className="filter-operator"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                >
                    {filteredOperators.map((op) => (
                        <option key={op.value} value={op.value}>
                            {op.label}
                        </option>
                    ))}
                </select>

                {!["empty", "notEmpty"].includes(operator) && (
                    <input
                        type={isNumeric ? "number" : isDate ? "date" : "text"}
                        className="filter-input"
                        placeholder="Filter value..."
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                )}

                <div className="filter-actions">
                    <button className="apply-filter" onClick={applyFilter}>
                        Apply
                    </button>
                    <button
                        className="clear-filter"
                        onClick={() => {
                            setValue("");
                            onClearFilter(column.field);
                        }}
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

// Cell renderer that handles different data types and custom templates
const CellRenderer = ({ column, value, row, customRenderers }) => {
    // Check if there's a custom renderer for this column
    if (customRenderers && customRenderers[column.field]) {
        return customRenderers[column.field]({ value, row, column });
    }

    // Default rendering based on data type
    switch (column.type) {
        case "number":
            return (
                <span className="cell-number">
                    {value !== undefined ? Number(value).toLocaleString() : ""}
                </span>
            );

        case "boolean":
            return (
                <span className={`cell-boolean ${value ? "true" : "false"}`}>
                    {value ? "✓" : "✗"}
                </span>
            );

        case "date":
            if (!value) return "";
            try {
                const date = new Date(value);
                return (
                    <span className="cell-date">
                        {date.toLocaleDateString()}
                    </span>
                );
            } catch (e) {
                return (
                    <span className="cell-error">
                        {value} with error {e}
                    </span>
                );
            }

        case "currency":
            return (
                <span
                    className={`cell-currency ${
                        parseFloat(value) < 0 ? "negative" : ""
                    }`}
                >
                    {column.currencySymbol || "$"}
                    {parseFloat(value).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </span>
            );

        case "status":
            return (
                <span className={`cell-status status-${value.toLowerCase()}`}>
                    {value}
                </span>
            );

        case "link":
            return (
                <a
                    href={column.buildUrl ? column.buildUrl(row) : value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cell-link"
                >
                    {column.linkText || value}
                </a>
            );

        default:
            return <span className="cell-text">{value}</span>;
    }
};

// Inline editing component
const EditableCell = ({ value, column, onSave, onCancel }) => {
    const [editValue, setEditValue] = useState(value);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onSave(editValue);
        } else if (e.key === "Escape") {
            onCancel();
        }
    };

    const renderEditor = () => {
        switch (column.type) {
            case "number":
                return (
                    <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="cell-editor number"
                    />
                );

            case "boolean":
                return (
                    <select
                        value={editValue.toString()}
                        onChange={(e) =>
                            setEditValue(e.target.value === "true")
                        }
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="cell-editor boolean"
                    >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                );

            case "date":
                return (
                    <input
                        type="date"
                        value={
                            editValue
                                ? new Date(editValue)
                                      .toISOString()
                                      .split("T")[0]
                                : ""
                        }
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="cell-editor date"
                    />
                );

            case "status":
                return (
                    <select
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="cell-editor status"
                    >
                        {column.options?.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );

            default:
                return (
                    <input
                        type="text"
                        value={editValue || ""}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="cell-editor text"
                    />
                );
        }
    };

    return (
        <div className="editable-cell">
            {renderEditor()}
            <div className="editor-actions">
                <button className="save-btn" onClick={() => onSave(editValue)}>
                    ✓
                </button>
                <button className="cancel-btn" onClick={onCancel}>
                    ✗
                </button>
            </div>
        </div>
    );
};

// Main component
const EnhancedDataTable = ({
    columns = [],
    data = [],
    loadMore = () => {},
    hasMore = false,
    loading = false,
    rowKey = "id",
    onRowClick = null,
    onRowSelect = null,
    onCellEdit = null,
    customCellRenderers = {},
    actionButtons = [],
    enableSelection = false,
    enableMultiSelect = false,
    enableFiltering = true,
    enableSorting = true,
    enableExport = true,
    enableColumnResize = true,
    enableColumnReorder = true,
    enableInfiniteScroll = true,
    enableVirtualization = true,
    initialSort = null,
    highlightedRow = null,
    stickyColumns = [],
    rowHeight = 48, // Default row height for virtualization
    pageSize = 20, // Number of rows to render at once with virtualization
    rowsBuffer = 5, // Extra rows to render above and below the visible area
    height = "400px",
    maxHeight = null, // Will use height if not specified
    fixedHeader = true,
    fixedFooter = false,
    className = "",
    emptyMessage = "No data available",
    filterLogic = "AND", // 'AND' or 'OR'
    showColumnSelector = true,
    searchable = true,
    searchPlaceholder = "Search...",
    exportOptions = {
        csv: true,
        excel: true,
        pdf: false,
        filename: "data-export",
    },
    serverSideProcessing = false,
    onSortChange = null,
    onFilterChange = null,
}) => {
    // State for table functionality
    const [visibleColumns, setVisibleColumns] = useState(
        columns.map((col) => ({
            ...col,
            visible: col.visible !== false, // Column is visible by default
            width: col.width || 150, // Default column width
            order: col.order ?? columns.indexOf(col),
        }))
    );
    const [sortConfig, setSortConfig] = useState(
        initialSort || { field: null, direction: null, multiSort: [] }
    );
    const [filters, setFilters] = useState({});
    const [activeFilter, setActiveFilter] = useState(null);
    const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [editingCell, setEditingCell] = useState(null); // { rowKey, field }
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const [resizingColumn, setResizingColumn] = useState(null);
    const [startX, setStartX] = useState(null);
    const [startWidth, setStartWidth] = useState(null);
    const [isDraggingColumn, setIsDraggingColumn] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);

    // Refs for scrolling and virtualization
    const tableRef = useRef(null);
    const tbodyRef = useRef(null);
    const headerRef = useRef(null);
    const scrollTimeout = useRef(null);
    const lastScrollTop = useRef(0);
    const scrollDirection = useRef(null);

    // Virtualization state
    const [scrollTop, setScrollTop] = useState(0);
    const [clientHeight, setClientHeight] = useState(0);
    // Update client height on mount and resize
    useEffect(() => {
        const updateSize = () => {
            if (tbodyRef.current) {
                setClientHeight(tbodyRef.current.clientHeight);
            }
        };

        updateSize();
        window.addEventListener("resize", updateSize);

        return () => window.removeEventListener("resize", updateSize);
    }, []);

    // Sort visible columns by order
    const orderedVisibleColumns = useMemo(() => {
        return [...visibleColumns]
            .filter((col) => col.visible)
            .sort((a, b) => a.order - b.order);
    }, [visibleColumns]);

    // Handle filtering
    const applyFilter = (field, filterConfig) => {
        const newFilters = { ...filters, [field]: filterConfig };
        setFilters(newFilters);
        setActiveFilter(null);

        if (onFilterChange && serverSideProcessing) {
            onFilterChange(newFilters);
        }
    };

    const clearFilter = (field) => {
        const newFilters = { ...filters };
        delete newFilters[field];
        setFilters(newFilters);
        setActiveFilter(null);

        if (onFilterChange && serverSideProcessing) {
            onFilterChange(newFilters);
        }
    };

    const clearAllFilters = () => {
        setFilters({});
        setActiveFilter(null);

        if (onFilterChange && serverSideProcessing) {
            onFilterChange({});
        }
    };

    // Check if a value matches a filter condition
    const matchesFilter = (value, filter) => {
        if (!filter) return true;

        const { operator, value: filterValue } = filter;

        // Handle empty/null values
        if (value === null || value === undefined || value === "") {
            return operator === "empty";
        }

        if (operator === "notEmpty") {
            return value !== null && value !== undefined && value !== "";
        }

        const stringValue = String(value).toLowerCase();
        const stringFilterValue = String(filterValue).toLowerCase();

        switch (operator) {
            case "contains":
                return stringValue.includes(stringFilterValue);
            case "equals":
                return stringValue === stringFilterValue;
            case "startsWith":
                return stringValue.startsWith(stringFilterValue);
            case "endsWith":
                return stringValue.endsWith(stringFilterValue);
            case "gt":
                return Number(value) > Number(filterValue);
            case "lt":
                return Number(value) < Number(filterValue);
            case "gte":
                return Number(value) >= Number(filterValue);
            case "lte":
                return Number(value) <= Number(filterValue);
            default:
                return true;
        }
    };

    // Apply filters to data
    const filteredData = useMemo(() => {
        // Ensure data is an array before proceeding
        if (!Array.isArray(data)) {
            return [];
        }

        if (serverSideProcessing) return data;

        if (Object.keys(filters).length === 0 && !searchTerm) {
            return data;
        }

        return data.filter((row) => {
            // Apply column filters
            if (Object.keys(filters).length > 0) {
                const filterResults = Object.entries(filters).map(
                    ([field, filter]) => {
                        return matchesFilter(row[field], filter);
                    }
                );

                if (filterLogic === "AND") {
                    if (filterResults.includes(false)) return false;
                } else if (filterLogic === "OR") {
                    if (!filterResults.includes(true)) return false;
                }
            }

            // Apply search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const searchMatch = orderedVisibleColumns.some((column) => {
                    if (!column.searchable && column.searchable !== undefined)
                        return false;
                    const value = row[column.field];
                    if (value === null || value === undefined) return false;
                    return String(value).toLowerCase().includes(searchLower);
                });

                if (!searchMatch) return false;
            }

            return true;
        });
    }, [
        data,
        filters,
        searchTerm,
        serverSideProcessing,
        orderedVisibleColumns,
        filterLogic,
    ]);

    // Handle sorting
    const sortedData = useMemo(() => {
        if (serverSideProcessing) return filteredData;

        // Ensure data is an array
        if (!Array.isArray(filteredData)) {
            return [];
        }

        let sortedData = [...filteredData];

        // Check if multiSort exists and has length property
        if (sortConfig.multiSort && sortConfig.multiSort.length > 0) {
            sortedData.sort((a, b) => {
                for (const sort of sortConfig.multiSort) {
                    const { field, direction } = sort;
                    const aValue = a[field];
                    const bValue = b[field];

                    // Handle null/undefined values
                    if (aValue === undefined || aValue === null) {
                        if (bValue === undefined || bValue === null) return 0;
                        return direction === "asc" ? -1 : 1;
                    }
                    if (bValue === undefined || bValue === null) {
                        return direction === "asc" ? 1 : -1;
                    }

                    // Sort numbers
                    if (
                        typeof aValue === "number" &&
                        typeof bValue === "number"
                    ) {
                        if (aValue !== bValue) {
                            return direction === "asc"
                                ? aValue - bValue
                                : bValue - aValue;
                        }
                    }
                    // Sort dates
                    else if (aValue instanceof Date && bValue instanceof Date) {
                        if (aValue.getTime() !== bValue.getTime()) {
                            return direction === "asc"
                                ? aValue.getTime() - bValue.getTime()
                                : bValue.getTime() - aValue.getTime();
                        }
                    }
                    // Sort strings
                    else {
                        const aString = String(aValue).toLowerCase();
                        const bString = String(bValue).toLowerCase();
                        if (aString !== bString) {
                            return direction === "asc"
                                ? aString.localeCompare(bString)
                                : bString.localeCompare(aString);
                        }
                    }
                }
                return 0;
            });
        } else if (sortConfig.field) {
            sortedData.sort((a, b) => {
                const aValue = a[sortConfig.field];
                const bValue = b[sortConfig.field];

                // Handle null/undefined values
                if (aValue === undefined || aValue === null) {
                    if (bValue === undefined || bValue === null) return 0;
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (bValue === undefined || bValue === null) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }

                // Sort numbers
                if (typeof aValue === "number" && typeof bValue === "number") {
                    return sortConfig.direction === "asc"
                        ? aValue - bValue
                        : bValue - aValue;
                }
                // Sort dates
                else if (aValue instanceof Date && bValue instanceof Date) {
                    return sortConfig.direction === "asc"
                        ? aValue.getTime() - bValue.getTime()
                        : bValue.getTime() - aValue.getTime();
                }
                // Sort date strings
                else if (
                    /^\d{4}-\d{2}-\d{2}/.test(aValue) &&
                    /^\d{4}-\d{2}-\d{2}/.test(bValue)
                ) {
                    return sortConfig.direction === "asc"
                        ? new Date(aValue) - new Date(bValue)
                        : new Date(bValue) - new Date(aValue);
                }
                // Sort strings
                else {
                    const aString = String(aValue).toLowerCase();
                    const bString = String(bValue).toLowerCase();
                    return sortConfig.direction === "asc"
                        ? aString.localeCompare(bString)
                        : bString.localeCompare(aString);
                }
            });
        }

        return sortedData;
    }, [filteredData, sortConfig, serverSideProcessing]);
    // Handle sorting on header click
    const handleSort = (field, isMultiSort = false) => {
        const column = visibleColumns.find((col) => col.field === field);
        if (!column || column.sortable === false) return;

        // Handle multi-sort with Shift key
        if (isMultiSort) {
            const existingSort = sortConfig.multiSort.find(
                (s) => s.field === field
            );
            let newMultiSort = [...sortConfig.multiSort];

            if (existingSort) {
                // Toggle direction if already in multi-sort
                if (existingSort.direction === "asc") {
                    newMultiSort = newMultiSort.map((s) =>
                        s.field === field ? { ...s, direction: "desc" } : s
                    );
                } else {
                    // Remove from multi-sort if already desc
                    newMultiSort = newMultiSort.filter(
                        (s) => s.field !== field
                    );
                }
            } else {
                // Add to multi-sort
                newMultiSort.push({ field, direction: "asc" });
            }

            const newSortConfig = {
                field: null,
                direction: null,
                multiSort: newMultiSort,
            };

            setSortConfig(newSortConfig);

            if (onSortChange && serverSideProcessing) {
                onSortChange(newSortConfig);
            }
        } else {
            // Single column sort
            let direction = "asc";

            if (sortConfig.field === field) {
                direction = sortConfig.direction === "asc" ? "desc" : null;
            }

            const newSortConfig = {
                field: direction ? field : null,
                direction: direction,
                multiSort: [],
            };

            setSortConfig(newSortConfig);

            if (onSortChange && serverSideProcessing) {
                onSortChange(newSortConfig);
            }
        }
    };

    // Handle column visibility change
    const toggleColumnVisibility = (field) => {
        setVisibleColumns((prevColumns) =>
            prevColumns.map((col) =>
                col.field === field ? { ...col, visible: !col.visible } : col
            )
        );
    };

    // Handle row selection
    const handleRowSelect = (rowData, isSelected) => {
        if (!enableSelection) return;

        if (enableMultiSelect) {
            if (isSelected) {
                setSelectedRows((prev) => [...prev, rowData[rowKey]]);
            } else {
                setSelectedRows((prev) =>
                    prev.filter((id) => id !== rowData[rowKey])
                );
            }
        } else {
            setSelectedRows(isSelected ? [rowData[rowKey]] : []);
        }

        if (onRowSelect) {
            if (enableMultiSelect) {
                const updatedSelection = isSelected
                    ? [...selectedRows, rowData[rowKey]]
                    : selectedRows.filter((id) => id !== rowData[rowKey]);

                onRowSelect(
                    updatedSelection.map((id) =>
                        data.find((row) => row[rowKey] === id)
                    )
                );
            } else {
                onRowSelect(isSelected ? [rowData] : []);
            }
        }
    };

    // Handle select all rows
    const handleSelectAll = (isSelected) => {
        if (!enableSelection || !enableMultiSelect) return;

        if (isSelected) {
            const allRowIds = sortedData.map((row) => row[rowKey]);
            setSelectedRows(allRowIds);

            if (onRowSelect) {
                onRowSelect(sortedData);
            }
        } else {
            setSelectedRows([]);

            if (onRowSelect) {
                onRowSelect([]);
            }
        }
    };

    // Handle cell editing
    const handleCellEdit = (rowData, field, value) => {
        setEditingCell(null);

        if (onCellEdit) {
            onCellEdit(rowData, field, value);
        }
    };

    // Calculate virtualization window
    const getVirtualizationWindow = useCallback(() => {
        if (!enableVirtualization) {
            return { startIndex: 0, endIndex: sortedData.length - 1 };
        }

        const startIndex = Math.floor(scrollTop / rowHeight);
const visibleRowsCount = Math.ceil(clientHeight / rowHeight);

return {
    startIndex: Math.max(0, startIndex - rowsBuffer),
    endIndex: Math.min(
        sortedData.length - 1,
        startIndex + visibleRowsCount + rowsBuffer
    ),
};
    }, [
        scrollTop,
        clientHeight,
        rowHeight,
        sortedData.length,
        enableVirtualization,
        rowsBuffer,
    ]);

    // Get visible rows based on virtualization
    const visibleData = useMemo(() => {
        if (!enableVirtualization) {
            return sortedData;
        }

        const { startIndex, endIndex } = getVirtualizationWindow();
        return sortedData.slice(startIndex, endIndex + 1);
    }, [sortedData, enableVirtualization, getVirtualizationWindow]);

    // Initialize virtualization spaces
    const getVirtualSpaces = useCallback(() => {
        if (!enableVirtualization) {
            return { top: 0, bottom: 0 };
        }

        const { startIndex, endIndex } = getVirtualizationWindow();

        const topSpace = startIndex * rowHeight;
        const bottomSpace = (sortedData.length - endIndex - 1) * rowHeight;

        return { top: topSpace, bottom: bottomSpace };
    }, [
        enableVirtualization,
        getVirtualizationWindow,
        sortedData.length,
        rowHeight,
    ]);

    const virtualSpaces = useMemo(() => getVirtualSpaces(), [getVirtualSpaces]);

    // Calculate total width of all visible columns
    const totalTableWidth = useMemo(() => {
        return orderedVisibleColumns.reduce(
            (total, col) => total + col.width,
            0
        );
    }, [orderedVisibleColumns]);

    // Add a useEffect hook to ensure table body widths match header widths after scroll
    useEffect(() => {
        const syncColumnWidths = () => {
            if (!headerRef.current || !tbodyRef.current) return;

            const headerTable = headerRef.current.querySelector("table");
            const bodyTable = tbodyRef.current.querySelector("table");

            if (!headerTable || !bodyTable) return;

            // Set the same width for both tables
            bodyTable.style.width = headerTable.style.width;

            // Also sync individual column widths if needed
            const headerCols = headerRef.current.querySelectorAll("th");
            const bodyCells =
                tbodyRef.current.querySelectorAll("tr:first-child td");

            if (headerCols.length === bodyCells.length) {
                headerCols.forEach((col, index) => {
                    if (bodyCells[index]) {
                        bodyCells[index].style.width = col.style.width;
                        bodyCells[index].style.minWidth = col.style.minWidth;
                        bodyCells[index].style.maxWidth = col.style.maxWidth;
                    }
                });
            }
        };

        // Run on mount and when columns change
        syncColumnWidths();

        // Create a ResizeObserver to watch for changes in the table size
        const resizeObserver = new ResizeObserver(() => {
            syncColumnWidths();
        });

        if (tableRef.current) {
            resizeObserver.observe(tableRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [visibleColumns, orderedVisibleColumns, totalTableWidth]);

    // Updated handleScroll function to maintain column alignment during scrolling
    const handleScroll = (e) => {
        // Update scroll position for virtualization
        setScrollTop(e.target.scrollTop);

        // Sync header scroll for horizontal scrolling
        if (
            headerRef.current &&
            e.target.scrollLeft !== headerRef.current.scrollLeft
        ) {
            headerRef.current.scrollLeft = e.target.scrollLeft;
        }

        // Determine scroll direction
        const currentScrollTop = e.target.scrollTop;
        scrollDirection.current =
            currentScrollTop > lastScrollTop.current ? "down" : "up";
        lastScrollTop.current = currentScrollTop;

        // Check for infinite scroll trigger
        if (
            enableInfiniteScroll &&
            hasMore &&
            !loading &&
            scrollDirection.current === "down"
        ) {
            const scrollHeight = e.target.scrollHeight;
            const scrollTop = e.target.scrollTop;
            const clientHeight = e.target.clientHeight;

            // If scrolled near the bottom (e.g., within 200px), trigger loadMore
            if (scrollHeight - scrollTop - clientHeight < 200) {
                // Clear any existing timeout
                if (scrollTimeout.current) {
                    clearTimeout(scrollTimeout.current);
                }

                // Set a small timeout to avoid multiple calls
                scrollTimeout.current = setTimeout(() => {
                    loadMore();
                }, 100);
            }
        }
    };

    // Export functionality
    const exportData = (type) => {
        let exportableData = [...filteredData];

        // Only include visible columns
        const exportColumns = orderedVisibleColumns;

        // Create CSV
        if (type === "csv") {
            const header = exportColumns.map((col) => col.header).join(",");
            const rows = exportableData.map((row) =>
                exportColumns
                    .map((col) => {
                        const value = row[col.field];
                        // Escape CSV special characters
                        return value !== undefined && value !== null
                            ? `"${String(value).replace(/"/g, '""')}"`
                            : "";
                    })
                    .join(",")
            );

            const csv = [header, ...rows].join("\n");
            downloadFile(csv, "text/csv", `${exportOptions.filename}.csv`);
        }

        // Create Excel (actually CSV with Excel extension)
        else if (type === "excel") {
            const header = exportColumns.map((col) => col.header).join(",");
            const rows = exportableData.map((row) =>
                exportColumns
                    .map((col) => {
                        const value = row[col.field];
                        return value !== undefined && value !== null
                            ? `"${String(value).replace(/"/g, '""')}"`
                            : "";
                    })
                    .join(",")
            );

            const csv = [header, ...rows].join("\n");
            downloadFile(
                csv,
                "application/vnd.ms-excel",
                `${exportOptions.filename}.xlsx`
            );
        }

        // Reset export menu state
        setIsExportMenuOpen(false);
    };

    // Helper function for downloads
    const downloadFile = (content, mimeType, filename) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Handle column resizing
    const handleResizeMouseDown = (e, field) => {
        e.preventDefault();
        const column = visibleColumns.find((col) => col.field === field);

        setResizingColumn(field);
        setStartX(e.clientX);
        setStartWidth(column.width);

        document.addEventListener("mousemove", handleResizeMouseMove);
        document.addEventListener("mouseup", handleResizeMouseUp);
    };

    const handleResizeMouseMove = useCallback(
        (e) => {
            if (!resizingColumn || startX === null || startWidth === null)
                return;

            const deltaX = e.clientX - startX;
            const newWidth = Math.max(50, startWidth + deltaX); // Minimum width of 50px

            setVisibleColumns((prevColumns) =>
                prevColumns.map((col) =>
                    col.field === resizingColumn
                        ? { ...col, width: newWidth }
                        : col
                )
            );
        },
        [resizingColumn, startX, startWidth]
    );

    const handleResizeMouseUp = useCallback(() => {
        setResizingColumn(null);
        setStartX(null);
        setStartWidth(null);

        document.removeEventListener("mousemove", handleResizeMouseMove);
        document.removeEventListener("mouseup", handleResizeMouseUp);
    }, [handleResizeMouseMove]);

    // Clean up event listeners on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener("mousemove", handleResizeMouseMove);
            document.removeEventListener("mouseup", handleResizeMouseUp);
        };
    }, [handleResizeMouseMove, handleResizeMouseUp]);

    // Handle column reordering
    const handleDragStart = (e, field) => {
        setIsDraggingColumn(field);
    };

    const handleDragOver = (e, field) => {
        e.preventDefault();
        if (isDraggingColumn && isDraggingColumn !== field) {
            setDragOverColumn(field);
        }
    };

    const handleDrop = (e, field) => {
        e.preventDefault();

        if (!isDraggingColumn || isDraggingColumn === field) {
            setIsDraggingColumn(null);
            setDragOverColumn(null);
            return;
        }

        // Get the order of the dragged column and target column
        const draggedColumn = visibleColumns.find(
            (col) => col.field === isDraggingColumn
        );
        const targetColumn = visibleColumns.find((col) => col.field === field);

        if (!draggedColumn || !targetColumn) {
            setIsDraggingColumn(null);
            setDragOverColumn(null);
            return;
        }

        // Update the order of all columns
        const draggedOrder = draggedColumn.order;
        const targetOrder = targetColumn.order;

        setVisibleColumns((prevColumns) => {
            return prevColumns.map((col) => {
                if (col.field === isDraggingColumn) {
                    return { ...col, order: targetOrder };
                } else if (
                    draggedOrder < targetOrder &&
                    col.order > draggedOrder &&
                    col.order <= targetOrder
                ) {
                    return { ...col, order: col.order - 1 };
                } else if (
                    draggedOrder > targetOrder &&
                    col.order >= targetOrder &&
                    col.order < draggedOrder
                ) {
                    return { ...col, order: col.order + 1 };
                } else {
                    return col;
                }
            });
        });

        setIsDraggingColumn(null);
        setDragOverColumn(null);
    };

    // Close filter when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                activeFilter &&
                !e.target.closest(".column-filter") &&
                !e.target.closest(".filter-icon")
            ) {
                setActiveFilter(null);
            }

            if (
                isColumnSelectorOpen &&
                !e.target.closest(".column-selector") &&
                !e.target.closest(".column-selector-toggle")
            ) {
                setIsColumnSelectorOpen(false);
            }

            if (
                isExportMenuOpen &&
                !e.target.closest(".export-menu") &&
                !e.target.closest(".export-button")
            ) {
                setIsExportMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [activeFilter, isColumnSelectorOpen, isExportMenuOpen]);

    // Calculate if all rows are selected
    const allRowsSelected =
        enableMultiSelect &&
        sortedData.length > 0 &&
        sortedData.every((row) => selectedRows.includes(row[rowKey]));

    // Handle row click
    const handleRowClick = (e, rowData) => {
        // Ignore clicks on checkboxes, action buttons, or when editing
        if (
            e.target.closest(".row-checkbox") ||
            e.target.closest(".action-button") ||
            editingCell
        ) {
            return;
        }

        if (onRowClick) {
            onRowClick(rowData);
        }
    };

    // Check if column is sticky
    const isColumnSticky = (field) => {
        return stickyColumns.includes(field);
    };

    // Track sticky column positions
    const getStickyPosition = (field) => {
        if (!isColumnSticky(field)) return null;

        const index = stickyColumns.indexOf(field);

        if (index === 0) return 0;

        // Calculate position based on widths of preceding sticky columns
        let position = 0;
        for (let i = 0; i < index; i++) {
            const col = visibleColumns.find(
                (c) => c.field === stickyColumns[i]
            );
            position += col ? col.width : 0;
        }

        return position;
    };

    // Generate styles for a column
    const getColumnStyle = (column) => {
        const styles = {
            width: `${column.width}px`,
            minWidth: `${column.width}px`,
            maxWidth: `${column.width}px`,
            boxSizing: "border-box",
            flexShrink: 0,
            flexGrow: 0,
        };

        if (isColumnSticky(column.field)) {
            const position = getStickyPosition(column.field);
            styles.position = "sticky";
            styles.left = `${position}px`;
            styles.zIndex = 2;
        }

        return styles;
    };

    return (
        <div
            className={`enhanced-data-table-container ${className}`}
            style={{ height, maxHeight: maxHeight || height }}
        >
            {/* Table tools */}
            <div className="table-toolbar">
                {searchable && (
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button
                                className="clear-search"
                                onClick={() => setSearchTerm("")}
                                aria-label="Clear search"
                            >
                                &times;
                            </button>
                        )}
                    </div>
                )}

                <div className="table-actions">
                    {enableFiltering && Object.keys(filters).length > 0 && (
                        <button
                            className="clear-filters-button"
                            onClick={clearAllFilters}
                            aria-label="Clear all filters"
                        >
                            Clear Filters
                        </button>
                    )}

                    {showColumnSelector && (
                        <div className="column-selector-container">
                            <button
                                className="column-selector-toggle"
                                onClick={() =>
                                    setIsColumnSelectorOpen(
                                        !isColumnSelectorOpen
                                    )
                                }
                                aria-label="Show/hide columns"
                            >
                                Columns
                            </button>

                            {isColumnSelectorOpen && (
                                <div className="column-selector">
                                    <div className="column-selector-header">
                                        <span>Show/Hide Columns</span>
                                        <button
                                            className="close-selector"
                                            onClick={() =>
                                                setIsColumnSelectorOpen(false)
                                            }
                                            aria-label="Close column selector"
                                        >
                                            &times;
                                        </button>
                                    </div>

                                    <div className="column-selector-list">
                                        {visibleColumns.map((column) => (
                                            <div
                                                key={column.field}
                                                className="column-selector-item"
                                            >
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={column.visible}
                                                        onChange={() =>
                                                            toggleColumnVisibility(
                                                                column.field
                                                            )
                                                        }
                                                    />
                                                    {column.header}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {enableExport && (
                        <div className="export-container">
                            <button
                                className="export-button"
                                onClick={() =>
                                    setIsExportMenuOpen(!isExportMenuOpen)
                                }
                                aria-label="Export data"
                            >
                                Export
                            </button>

                            {isExportMenuOpen && (
                                <div className="export-menu">
                                    {exportOptions.csv && (
                                        <button
                                            className="export-option"
                                            onClick={() => exportData("csv")}
                                        >
                                            Export as CSV
                                        </button>
                                    )}

                                    {exportOptions.excel && (
                                        <button
                                            className="export-option"
                                            onClick={() => exportData("excel")}
                                        >
                                            Export as Excel
                                        </button>
                                    )}

                                    {exportOptions.pdf && (
                                        <button
                                            className="export-option"
                                            onClick={() => exportData("pdf")}
                                        >
                                            Export as PDF
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Main table */}
            <div className="table-container" ref={tableRef}>
                {/* Table header */}
                <div
                    className={`table-header ${
                        fixedHeader ? "fixed-header" : ""
                    }`}
                    ref={headerRef}
                >
                    <table style={{ width: `${totalTableWidth}px` }}>
                        <thead>
                            <tr>
                                {/* Selection checkbox for header */}
                                {enableSelection && enableMultiSelect && (
                                    <th className="selection-cell">
                                        <input
                                            type="checkbox"
                                            checked={allRowsSelected}
                                            onChange={(e) =>
                                                handleSelectAll(
                                                    e.target.checked
                                                )
                                            }
                                            className="select-all-checkbox"
                                        />
                                    </th>
                                )}

                                {/* Normal column headers */}
                                {orderedVisibleColumns.map((column) => (
                                    <th
                                        key={column.field}
                                        className={`
                                   ${
                                       column.sortable !== false &&
                                       enableSorting
                                           ? "sortable"
                                           : ""
                                   }
                                   ${
                                       sortConfig.field === column.field
                                           ? `sorted ${sortConfig.direction}`
                                           : ""
                                   }
                                   ${
                                       sortConfig.multiSort &&
                                       Array.isArray(sortConfig.multiSort) &&
                                       sortConfig.multiSort.some(
                                           (s) => s.field === column.field
                                       )
                                           ? "multi-sorted"
                                           : ""
                                   }
                                   ${
                                       isColumnSticky(column.field)
                                           ? "sticky-column"
                                           : ""
                                   }
                                   ${
                                       isDraggingColumn === column.field
                                           ? "dragging"
                                           : ""
                                   }
                                   ${
                                       dragOverColumn === column.field
                                           ? "drag-over"
                                           : ""
                                   }
                               `}
                                        style={getColumnStyle(column)}
                                        onClick={(e) => {
                                            if (
                                                column.sortable !== false &&
                                                enableSorting
                                            ) {
                                                handleSort(
                                                    column.field,
                                                    e.shiftKey
                                                );
                                            }
                                        }}
                                        draggable={enableColumnReorder}
                                        onDragStart={(e) =>
                                            handleDragStart(e, column.field)
                                        }
                                        onDragOver={(e) =>
                                            handleDragOver(e, column.field)
                                        }
                                        onDrop={(e) =>
                                            handleDrop(e, column.field)
                                        }
                                    >
                                        <div className="th-content">
                                            <span className="column-title">
                                                {column.header}
                                            </span>

                                            {column.sortable !== false &&
                                                enableSorting && (
                                                    <span className="sort-indicator">
                                                        {sortConfig.field ===
                                                        column.field ? (
                                                            <SortIcon
                                                                direction={
                                                                    sortConfig.direction
                                                                }
                                                            />
                                                        ) : sortConfig.multiSort &&
                                                          Array.isArray(
                                                              sortConfig.multiSort
                                                          ) &&
                                                          sortConfig.multiSort.some(
                                                              (s) =>
                                                                  s.field ===
                                                                  column.field
                                                          ) ? (
                                                            <SortIcon
                                                                direction={
                                                                    sortConfig.multiSort.find(
                                                                        (s) =>
                                                                            s.field ===
                                                                            column.field
                                                                    ).direction
                                                                }
                                                            />
                                                        ) : (
                                                            <SortIcon
                                                                direction={null}
                                                            />
                                                        )}
                                                    </span>
                                                )}

                                            {enableFiltering &&
                                                column.filterable !== false && (
                                                    <span
                                                        className="filter-indicator"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveFilter(
                                                                activeFilter ===
                                                                    column.field
                                                                    ? null
                                                                    : column.field
                                                            );
                                                        }}
                                                    >
                                                        <FilterIcon
                                                            active={
                                                                !!filters[
                                                                    column.field
                                                                ]
                                                            }
                                                        />
                                                    </span>
                                                )}

                                            {activeFilter === column.field && (
                                                <ColumnFilter
                                                    column={column}
                                                    onApplyFilter={applyFilter}
                                                    onClearFilter={clearFilter}
                                                    currentFilter={
                                                        filters[column.field]
                                                    }
                                                />
                                            )}
                                        </div>

                                        {enableColumnResize && (
                                            <ResizeHandle
                                                onMouseDown={(e) =>
                                                    handleResizeMouseDown(
                                                        e,
                                                        column.field
                                                    )
                                                }
                                            />
                                        )}
                                    </th>
                                ))}

                                {/* Actions column if needed */}
                                {actionButtons.length > 0 && (
                                    <th
                                        className="actions-cell"
                                        style={{
                                            right: 0,
                                            zIndex: 2,
                                            width: "160px",
                                            paddingLeft: "15px",
                                        }}
                                    >
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                    </table>
                </div>

                {/* Table body */}
                <div
                    className="table-body"
                    ref={tbodyRef}
                    onScroll={handleScroll}
                >
                    <table style={{ width: `${totalTableWidth}px` }}>
                        <tbody>
                            {/* Virtual top spacer */}
                            {enableVirtualization && virtualSpaces.top > 0 && (
                                <tr>
                                    <td
                                        colSpan={
                                            orderedVisibleColumns.length +
                                            (enableSelection ? 1 : 0) +
                                            (actionButtons.length > 0 ? 1 : 0)
                                        }
                                        style={{
                                            height: `${virtualSpaces.top}px`,
                                            padding: 0,
                                            border: "none",
                                        }}
                                    />
                                </tr>
                            )}

                            {visibleData.length > 0 ? (
                                visibleData.map((rowData) => {
                                    const rowId = rowData[rowKey];
                                    const isSelected =
                                        selectedRows.includes(rowId);
                                    const isHighlighted =
                                        highlightedRow === rowId;

                                    return (
                                        <tr
                                            key={rowId}
                                            className={`
                        ${isSelected ? "selected" : ""}
                        ${isHighlighted ? "highlighted" : ""}
                      `}
                                            onClick={(e) =>
                                                handleRowClick(e, rowData)
                                            }
                                            style={{ height: `${rowHeight}px` }}
                                        >
                                            {/* Selection checkbox */}
                                            {enableSelection && (
                                                <td className="selection-cell row-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={(e) =>
                                                            handleRowSelect(
                                                                rowData,
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                </td>
                                            )}

                                            {/* Data cells */}
                                            {orderedVisibleColumns.map(
                                                (column) => {
                                                    const field = column.field;
                                                    const value =
                                                        rowData[field];
                                                    const isEditing =
                                                        editingCell &&
                                                        editingCell.rowKey ===
                                                            rowId &&
                                                        editingCell.field ===
                                                            field;

                                                    return (
                                                        <td
                                                            key={field}
                                                            className={`
                              ${isColumnSticky(field) ? "sticky-column" : ""}
                              ${isEditing ? "editing" : ""}
                            `}
                                                            style={getColumnStyle(
                                                                column
                                                            )}
                                                            onDoubleClick={() => {
                                                                if (
                                                                    column.editable &&
                                                                    onCellEdit
                                                                ) {
                                                                    setEditingCell(
                                                                        {
                                                                            rowKey: rowId,
                                                                            field,
                                                                        }
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            {isEditing ? (
                                                                <EditableCell
                                                                    value={
                                                                        value
                                                                    }
                                                                    column={
                                                                        column
                                                                    }
                                                                    onSave={(
                                                                        newValue
                                                                    ) =>
                                                                        handleCellEdit(
                                                                            rowData,
                                                                            field,
                                                                            newValue
                                                                        )
                                                                    }
                                                                    onCancel={() =>
                                                                        setEditingCell(
                                                                            null
                                                                        )
                                                                    }
                                                                />
                                                            ) : (
                                                                <CellRenderer
                                                                    column={
                                                                        column
                                                                    }
                                                                    value={
                                                                        value
                                                                    }
                                                                    row={
                                                                        rowData
                                                                    }
                                                                    customRenderers={
                                                                        customCellRenderers
                                                                    }
                                                                />
                                                            )}
                                                        </td>
                                                    );
                                                }
                                            )}

                                            {/* Action buttons */}
                                            {actionButtons.length > 0 && (
                                                <td
                                                    className="actions-cell data"
                                                    style={{
                                                        right: 0,
                                                        zIndex: 1,
                                                    }}
                                                >
                                                    <div className="action-buttons">
                                                        {actionButtons.map(
                                                            (action, index) => (
                                                                <button
                                                                    key={index}
                                                                    className={`action-button ${
                                                                        action.className ||
                                                                        ""
                                                                    }`}
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        action.onClick(
                                                                            rowData
                                                                        );
                                                                    }}
                                                                    disabled={
                                                                        action.isDisabled
                                                                            ? action.isDisabled(
                                                                                  rowData
                                                                              )
                                                                            : false
                                                                    }
                                                                    title={
                                                                        action.tooltip ||
                                                                        action.label
                                                                    }
                                                                >
                                                                    {action.icon ? (
                                                                        <span className="action-icon">
                                                                            {
                                                                                action.icon
                                                                            }
                                                                        </span>
                                                                    ) : (
                                                                        action.label
                                                                    )}
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr className="empty-row">
                                    <td
                                        colSpan={
                                            orderedVisibleColumns.length +
                                            (enableSelection ? 1 : 0) +
                                            (actionButtons.length > 0 ? 1 : 0)
                                        }
                                    >
                                        {loading ? (
                                            <div className="loading-message">
                                                Loading data...
                                            </div>
                                        ) : (
                                            <div className="empty-message">
                                                {emptyMessage}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )}

                            {/* Virtual bottom spacer */}
                            {enableVirtualization &&
                                virtualSpaces.bottom > 0 && (
                                    <tr>
                                        <td
                                            colSpan={
                                                orderedVisibleColumns.length +
                                                (enableSelection ? 1 : 0) +
                                                (actionButtons.length > 0
                                                    ? 1
                                                    : 0)
                                            }
                                            style={{
                                                height: `${virtualSpaces.bottom}px`,
                                                padding: 0,
                                                border: "none",
                                            }}
                                        />
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>

                {/* Loading indicator */}
                {loading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                    </div>
                )}
            </div>

            {/* Table footer if needed */}
            {fixedFooter && (
                <div className="table-footer">
                    <div className="table-info">
                        Showing {visibleData.length} of {sortedData.length}{" "}
                        {sortedData.length === 1 ? "row" : "rows"}
                    </div>
                </div>
            )}
        </div>
    );
};

EnhancedDataTable.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            field: PropTypes.string.isRequired,
            header: PropTypes.string.isRequired,
            type: PropTypes.oneOf([
                "text",
                "number",
                "boolean",
                "date",
                "currency",
                "status",
                "link",
            ]),
            width: PropTypes.number,
            visible: PropTypes.bool,
            sortable: PropTypes.bool,
            filterable: PropTypes.bool,
            searchable: PropTypes.bool,
            editable: PropTypes.bool,
            order: PropTypes.number,
            options: PropTypes.arrayOf(PropTypes.string), // For status or select types
            currencySymbol: PropTypes.string, // For currency type
            buildUrl: PropTypes.func, // For link type
            linkText: PropTypes.string, // For link type
        })
    ).isRequired,
    data: PropTypes.array.isRequired,
    loadMore: PropTypes.func,
    hasMore: PropTypes.bool,
    loading: PropTypes.bool,
    rowKey: PropTypes.string,
    onRowClick: PropTypes.func,
    onRowSelect: PropTypes.func,
    onCellEdit: PropTypes.func,
    customCellRenderers: PropTypes.object,
    actionButtons: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            icon: PropTypes.node,
            onClick: PropTypes.func.isRequired,
            isDisabled: PropTypes.func,
            tooltip: PropTypes.string,
            className: PropTypes.string,
        })
    ),
    enableSelection: PropTypes.bool,
    enableMultiSelect: PropTypes.bool,
    enableFiltering: PropTypes.bool,
    enableSorting: PropTypes.bool,
    enableExport: PropTypes.bool,
    enableColumnResize: PropTypes.bool,
    enableColumnReorder: PropTypes.bool,
    enableInfiniteScroll: PropTypes.bool,
    enableVirtualization: PropTypes.bool,
    initialSort: PropTypes.shape({
        field: PropTypes.string,
        direction: PropTypes.oneOf(["asc", "desc"]),
        multiSort: PropTypes.arrayOf(
            PropTypes.shape({
                field: PropTypes.string.isRequired,
                direction: PropTypes.oneOf(["asc", "desc"]).isRequired,
            })
        ),
    }),
    highlightedRow: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stickyColumns: PropTypes.arrayOf(PropTypes.string),
    rowHeight: PropTypes.number,
    pageSize: PropTypes.number,
    rowsBuffer: PropTypes.number,
    height: PropTypes.string,
    maxHeight: PropTypes.string,
    fixedHeader: PropTypes.bool,
    fixedFooter: PropTypes.bool,
    className: PropTypes.string,
    emptyMessage: PropTypes.string,
    filterLogic: PropTypes.oneOf(["AND", "OR"]),
    showColumnSelector: PropTypes.bool,
    searchable: PropTypes.bool,
    searchPlaceholder: PropTypes.string,
    exportOptions: PropTypes.shape({
        csv: PropTypes.bool,
        excel: PropTypes.bool,
        pdf: PropTypes.bool,
        filename: PropTypes.string,
    }),
    serverSideProcessing: PropTypes.bool,
    onSortChange: PropTypes.func,
    onFilterChange: PropTypes.func,
};

export default EnhancedDataTable;

// ### Usage0- - - - - - -
// import React, { useState, useEffect, useRef } from "react";
// import EnhancedDataTable from "./components/EnhancedDataTable/EnhancedDataTable";

// // Example Action Icons
// const EditIcon = () => (
//     <svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//     >
//         <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
//         <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
//     </svg>
// );

// const DeleteIcon = () => (
//     <svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//     >
//         <polyline points="3 6 5 6 21 6"></polyline>
//         <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
//         <line x1="10" y1="11" x2="10" y2="17"></line>
//         <line x1="14" y1="11" x2="14" y2="17"></line>
//     </svg>
// );

// const ViewIcon = () => (
//     <svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//     >
//         <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
//         <circle cx="12" cy="12" r="3"></circle>
//     </svg>
// );

// const DataTableExample = () => {
//     // Generate some initial data right away
//     const generateInitialData = () => {
//         const statusOptions = ["Active", "Inactive", "Pending", "Completed"];
//         const names = [
//             "John Smith",
//             "Emma Wilson",
//             "Michael Johnson",
//             "Sarah Brown",
//             "David Lee",
//             "Lisa Chen",
//             "Robert Miller",
//             "Jennifer Davis",
//             "James Taylor",
//             "Sophia Martinez",
//         ];

//         return Array(20)
//             .fill(0)
//             .map((_, index) => {
//                 const id = index + 1;
//                 const createdDate = new Date();
//                 createdDate.setDate(
//                     createdDate.getDate() - Math.floor(Math.random() * 365)
//                 );

//                 const lastLoginDate = new Date();
//                 lastLoginDate.setDate(
//                     lastLoginDate.getDate() - Math.floor(Math.random() * 30)
//                 );

//                 const revenue = parseFloat((Math.random() * 20000).toFixed(2));
//                 const orders = Math.floor(Math.random() * 50);

//                 return {
//                     id,
//                     name: names[Math.floor(Math.random() * names.length)],
//                     email: `user${id}@example.com`,
//                     status: statusOptions[
//                         Math.floor(Math.random() * statusOptions.length)
//                     ],
//                     created: createdDate.toISOString(),
//                     lastLogin: lastLoginDate.toISOString(),
//                     orders,
//                     revenue,
//                     website: `https://example.com/user${id}`,
//                     notes:
//                         Math.random() > 0.7 ? `Notes for customer #${id}` : "",
//                 };
//             });
//     };

//     // Initialize state with actual data, not an empty array
//     const [data, setData] = useState(generateInitialData());
//     const [loading, setLoading] = useState(false);
//     const [hasMore, setHasMore] = useState(true);
//     const [page, setPage] = useState(1);
//     const [selectedRow, setSelectedRow] = useState(null);
//     const dataRef = useRef(data);

//     // Sample data generator function for additional pages
//     const generateSampleData = (page, pageSize = 20) => {
//         const statusOptions = ["Active", "Inactive", "Pending", "Completed"];
//         const names = [
//             "John Smith",
//             "Emma Wilson",
//             "Michael Johnson",
//             "Sarah Brown",
//             "David Lee",
//             "Lisa Chen",
//             "Robert Miller",
//             "Jennifer Davis",
//             "James Taylor",
//             "Sophia Martinez",
//         ];

//         return Array(pageSize)
//             .fill(0)
//             .map((_, index) => {
//                 const id = (page - 1) * pageSize + index + 1;
//                 const createdDate = new Date();
//                 createdDate.setDate(
//                     createdDate.getDate() - Math.floor(Math.random() * 365)
//                 );

//                 const lastLoginDate = new Date();
//                 lastLoginDate.setDate(
//                     lastLoginDate.getDate() - Math.floor(Math.random() * 30)
//                 );

//                 const revenue = parseFloat((Math.random() * 20000).toFixed(2));
//                 const orders = Math.floor(Math.random() * 50);

//                 return {
//                     id,
//                     name: names[Math.floor(Math.random() * names.length)],
//                     email: `user${id}@example.com`,
//                     status: statusOptions[
//                         Math.floor(Math.random() * statusOptions.length)
//                     ],
//                     created: createdDate.toISOString(),
//                     lastLogin: lastLoginDate.toISOString(),
//                     orders,
//                     revenue,
//                     website: `https://example.com/user${id}`,
//                     notes:
//                         Math.random() > 0.7 ? `Notes for customer #${id}` : "",
//                 };
//             });
//     };

//     // Keep track of data in ref for debugging
//     useEffect(() => {
//         dataRef.current = data;
//         console.log("Data updated:", data);
//     }, [data]);

//     // Define table columns
//     const columns = [
//         {
//             field: "id",
//             header: "ID",
//             type: "number",
//             width: 80,
//         },
//         {
//             field: "name",
//             header: "Name",
//             type: "text",
//             width: 200,
//             editable: true,
//         },
//         {
//             field: "email",
//             header: "Email",
//             type: "text",
//             width: 250,
//         },
//         {
//             field: "status",
//             header: "Status",
//             type: "status",
//             width: 150,
//             options: ["Active", "Inactive", "Pending", "Completed"],
//             editable: true,
//         },
//         {
//             field: "created",
//             header: "Created Date",
//             type: "date",
//             width: 150,
//         },
//         {
//             field: "lastLogin",
//             header: "Last Login",
//             type: "date",
//             width: 150,
//         },
//         {
//             field: "orders",
//             header: "Orders",
//             type: "number",
//             width: 100,
//         },
//         {
//             field: "revenue",
//             header: "Revenue",
//             type: "currency",
//             width: 150,
//         },
//         {
//             field: "website",
//             header: "Website",
//             type: "link",
//             width: 200,
//             linkText: "Visit Website",
//         },
//         {
//             field: "notes",
//             header: "Notes",
//             type: "text",
//             width: 300,
//             editable: true,
//         },
//     ];

//     // Define custom cell renderers
//     const customCellRenderers = {
//         revenue: ({ value, row }) => {
//             // Ensure value exists before trying to use it
//             if (value === undefined || value === null) {
//                 return <span>$0.00</span>;
//             }

//             return (
//                 <span
//                     style={{
//                         fontWeight: value > 10000 ? "bold" : "normal",
//                         color:
//                             value > 10000
//                                 ? "#047857"
//                                 : value < 1000
//                                 ? "#b91c1c"
//                                 : "inherit",
//                     }}
//                 >
//                     $
//                     {Number(value).toLocaleString(undefined, {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                     })}
//                 </span>
//             );
//         },
//         // Additional custom renderers can be added here
//     };

//     // Load more data with pagination
//     useEffect(() => {
//         // Skip page 1 since we already loaded it
//         if (page === 1) return;

//         const loadMoreData = async () => {
//             setLoading(true);

//             // Simulate API delay
//             await new Promise((resolve) => setTimeout(resolve, 800));

//             // Generate mock data for this page
//             const newData = generateSampleData(page);

//             // Update data (appending for infinite scroll)
//             setData((prev) => {
//                 // Make sure prev is an array
//                 const prevData = Array.isArray(prev) ? prev : [];
//                 return [...prevData, ...newData];
//             });

//             // Simulate end of data after 5 pages
//             if (page >= 5) {
//                 setHasMore(false);
//             }

//             setLoading(false);
//         };

//         loadMoreData();
//     }, [page]);

//     // Handle loading more data when scrolling
//     const loadMoreData = () => {
//         if (!loading && hasMore) {
//             setPage((prev) => prev + 1);
//         }
//     };

//     // Handle row click
//     const handleRowClick = (rowData) => {
//         setSelectedRow(rowData.id);
//         console.log("Row clicked:", rowData);
//     };

//     // Handle row selection
//     const handleRowSelect = (selectedRows) => {
//         console.log("Selected rows:", selectedRows);
//     };

//     // Handle cell editing
//     const handleCellEdit = (rowData, field, newValue) => {
//         console.log(
//             `Edit cell: Row ID ${rowData.id}, Field: ${field}, New Value: ${newValue}`
//         );

//         // Update the data
//         setData((prev) => {
//             // Make sure prev is an array
//             const prevData = Array.isArray(prev) ? prev : [];
//             return prevData.map((row) =>
//                 row.id === rowData.id ? { ...row, [field]: newValue } : row
//             );
//         });
//     };

//     // Action buttons
//     const actionButtons = [
//         {
//             label: "View",
//             icon: <ViewIcon />,
//             onClick: (row) => console.log("View:", row),
//             tooltip: "View details",
//         },
//         {
//             label: "Edit",
//             icon: <EditIcon />,
//             onClick: (row) => console.log("Edit:", row),
//             tooltip: "Edit record",
//         },
//         {
//             label: "Delete",
//             icon: <DeleteIcon />,
//             onClick: (row) => {
//                 console.log("Delete:", row);
//                 if (
//                     window.confirm(
//                         `Are you sure you want to delete ${row.name}?`
//                     )
//                 ) {
//                     setData((prev) => {
//                         // Make sure prev is an array
//                         const prevData = Array.isArray(prev) ? prev : [];
//                         return prevData.filter((item) => item.id !== row.id);
//                     });
//                 }
//             },
//             tooltip: "Delete record",
//             isDisabled: (row) => row.status === "Active", // Disable delete for active users
//         },
//     ];

//     console.log("Current data length:", data.length);

//     // Don't render the table until we have data
//     if (data.length === 0) {
//         return <div>Loading data...</div>;
//     }

//     return (
//         <div style={{ height: "800px", padding: "20px" }}>
//             <h2>Enhanced Data Table with Infinite Scroll</h2>
//             <p>
//                 This example demonstrates the table with virtual scrolling and
//                 infinite data loading.
//             </p>

//             <EnhancedDataTable
//                 columns={columns}
//                 data={data}
//                 loadMore={loadMoreData}
//                 hasMore={hasMore}
//                 loading={loading}
//                 rowKey="id"
//                 onRowClick={handleRowClick}
//                 onRowSelect={handleRowSelect}
//                 onCellEdit={handleCellEdit}
//                 customCellRenderers={customCellRenderers}
//                 actionButtons={actionButtons}
//                 enableSelection={true}
//                 enableMultiSelect={true}
//                 enableFiltering={true}
//                 enableSorting={true}
//                 enableExport={true}
//                 enableColumnResize={true}
//                 enableColumnReorder={true}
//                 enableInfiniteScroll={true}
//                 enableVirtualization={true}
//                 initialSort={{ field: "id", direction: "asc" }}
//                 highlightedRow={selectedRow}
//                 stickyColumns={["id"]} // Make ID column sticky
//                 rowHeight={48}
//                 height="600px"
//                 fixedHeader={true}
//                 fixedFooter={true}
//                 emptyMessage="No users found"
//                 searchPlaceholder="Search users..."
//                 exportOptions={{
//                     csv: true,
//                     excel: true,
//                     pdf: false,
//                     filename: "users-export",
//                 }}
//             />
//         </div>
//     );
// };

// export default DataTableExample;
