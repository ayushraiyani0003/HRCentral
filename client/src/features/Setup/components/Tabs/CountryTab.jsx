import React, { useEffect, useRef, useCallback } from "react";
import {
    CustomTable,
    CustomButton,
    CustomContainer,
    CustomSearchBar,
} from "../../../../components";
import {
    AddIcon,
    DeleteIcon,
    EditIcon,
    ViewIcon,
} from "../../../../utils/SvgIcon";
import useCountryTab from "../../hooks/useCountryTab";

function CountryTab({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
    setCrudHandlers = () => {},
}) {
    const {
        searchValue,
        filteredData,
        displayData,
        handleAddNew,
        handleView,
        handleEdit,
        handleDelete,
        handleSearch,
        stats,
        // CRUD handlers
        handleCreateCountry,
        handleUpdateCountry,
        handleDeleteCountry,
    } = useCountryTab({
        setOpenDeleteModel,
        setRowData,
        setOpenAddEditModel,
        setModelType,
    });

    console.log(stats);
    console.log(filteredData);

    // Use ref to track if handlers have been set to avoid unnecessary calls
    const handlersSetRef = useRef(false);

    // Memoize the CRUD handlers object to prevent unnecessary effect triggers
    const crudHandlers = useCallback(
        () => ({
            handleCreateCountry,
            handleUpdateCountry,
            handleDeleteCountry,
        }),
        [handleCreateCountry, handleUpdateCountry, handleDeleteCountry]
    );

    // Pass CRUD handlers to parent when component mounts or handlers change
    useEffect(() => {
        // Only set handlers if they haven't been set or if they've actually changed
        if (!handlersSetRef.current) {
            setCrudHandlers(crudHandlers());
            handlersSetRef.current = true;
        }
    }, [setCrudHandlers, crudHandlers]);

    // Memoize columns to prevent unnecessary re-renders of the table
    const columns = React.useMemo(
        () => [
            {
                key: "name",
                header: "Country",
                sortable: true,
                className: "font-medium text-gray-900",
                width: "180px",
            },
            {
                key: "code",
                header: "Code",
                sortable: true,
                className: "text-gray-700",
                width: "100px",
            },
            {
                key: "phone_code",
                header: "Phone Code",
                sortable: true,
                className: "text-gray-700",
                width: "120px",
            },
            {
                key: "region",
                header: "Region",
                sortable: true,
                className: "text-gray-700 capitalize",
                width: "150px",
            },
            {
                key: "actions",
                header: "Actions",
                sortable: false,
                cell: (row) => {
                    return (
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => handleView(row)}
                                className="px-3 py-1 flex flex-row items-center rounded-md text-blue-600 bg-blue-50 text-xs font-medium border border-blue-600 hover:bg-blue-100 transition-colors"
                            >
                                <ViewIcon className="mr-1 h-3.5 w-3.5" />
                                View
                            </button>
                            <button
                                onClick={() => handleEdit(row)}
                                className="px-3 py-1 flex flex-row items-center rounded-md text-lime-600 bg-lime-50 text-xs font-medium border border-lime-600 hover:bg-lime-100 transition-colors"
                            >
                                <EditIcon className="mr-1 h-3.5 w-3.5" />
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(row)}
                                className="px-3 py-1 flex items-center rounded-md text-[#d4380d] bg-[#fff2e8] text-xs font-medium border border-[#ffbb96] hover:bg-[#ffe7ba] transition-colors"
                            >
                                <DeleteIcon className="mr-1 h-3.5 w-3.5" />
                                Delete
                            </button>
                        </div>
                    );
                },
            },
        ],
        [handleView, handleEdit, handleDelete]
    );

    // Memoize header actions to prevent unnecessary re-renders
    const headerActions = React.useMemo(
        () => (
            <div className="flex items-center w-full justify-between space-x-4">
                <CustomButton
                    leftIcon={<AddIcon className="h-4 w-4" />}
                    onClick={handleAddNew}
                    size="small"
                    className="whitespace-nowrap px-4 py-2"
                >
                    Add New
                </CustomButton>
                <CustomSearchBar
                    placeholder="Search Countries..."
                    value={searchValue}
                    onChange={handleSearch}
                    onSearch={handleSearch}
                    size="small"
                    className="!max-w-90 !mb-0"
                />
            </div>
        ),
        [handleAddNew, handleSearch, searchValue]
    );

    // console.log(displayData);

    return (
        <div className="space-y-6 mt-2">
            <CustomContainer
                padding="medium"
                className="bg-white"
                headerActionsClassName="w-full"
                headerActions={headerActions}
            >
                <CustomTable
                    columns={columns}
                    data={displayData}
                    searchable={false}
                    filterable={false}
                    filterableColumns={[]}
                    sortable={true}
                    pagination={true}
                    itemsPerPageOptions={[10, 25, 50]}
                    defaultItemsPerPage={10}
                    rowHeight="40px"
                    tdClassName="!px-2 !py-2 text-sm"
                    thCustomStyles="px-3 py-2 text-xs font-semibold text-gray-700 uppercase tracking-wide"
                    className="border-0"
                    emptyMessage="No Country found"
                    tableControlClassName="!mb-0"
                    extraHeaderContent={null}
                />
            </CustomContainer>
        </div>
    );
}

export default React.memo(CountryTab);
