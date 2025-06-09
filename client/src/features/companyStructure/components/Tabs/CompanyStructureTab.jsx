import React, { useMemo } from "react";
import {
    CustomTable,
    CustomButton,
    CustomContainer,
    CustomSearchBar,
    TextButton,
} from "../../../../components";
import {
    AddIcon,
    DeleteIcon,
    EditIcon,
    ViewIcon,
} from "../../../../utils/SvgIcon";
import useCompanyStructureTab from "../../hooks/useCompanyStructureTab";

function CompanyStructureTab({
    setOpenDeleteModel,
    setCompanyStructure = () => {},
    setOpenStructureModel = () => {},
    setModelType = () => {},
}) {
    const {
        searchValue,
        filteredData,
        handleAddNew,
        handleView,
        handleEdit,
        handleDelete,
        handleSearch,
        handleMoreInfo,
    } = useCompanyStructureTab({
        setOpenDeleteModel,
        setCompanyStructure,
        setOpenStructureModel,
        setModelType,
    });

    // Memoize table columns configuration to prevent unnecessary rerenders
    const columns = useMemo(
        () => [
            {
                key: "name",
                header: "Name",
                sortable: true,
                className: "font-medium text-gray-900",
                width: "220px",
            },
            {
                key: "address",
                header: "Address",
                sortable: true,
                className: "text-sm text-gray-600",
                width: "620px",
            },
            {
                key: "type",
                header: "Type",
                sortable: true,
                width: "130px",
                cell: (row) => (
                    <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            row.type === "Head Office"
                                ? "bg-blue-100 text-blue-800"
                                : row.type === "Branch"
                                ? "bg-green-100 text-green-800"
                                : row.type === "Department"
                                ? "bg-purple-100 text-purple-800"
                                : row.type === "Unit"
                                ? "bg-yellow-100 text-yellow-800"
                                : row.type === "SubUnit"
                                ? "bg-pink-100 text-pink-800"
                                : row.type === "Regional Office"
                                ? "bg-indigo-100 text-indigo-800"
                                : "bg-orange-100 text-orange-800" // fallback for unknown types
                        }`}
                    >
                        {row.type}
                    </span>
                ),
            },
            {
                key: "country",
                header: "Country",
                sortable: true,
                width: "160px",
                className: "text-sm text-gray-700",
            },
            {
                key: "parentStructure",
                header: "Parent Structure",
                sortable: true,
                className: "text-sm text-gray-600",
                width: "220px",
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
                                className="px-3 py-1 flex flex-row items-center rounded-md text-blue-600 bg-blue-50 text-xs font-medium border border-blue-600"
                            >
                                <ViewIcon className="mr-1 h-3.5 w-3.5" />
                                View
                            </button>
                            <button
                                onClick={() => handleEdit(row)}
                                className="px-3 py-1 flex flex-row items-center rounded-md text-lime-600 bg-lime-50 text-xs font-medium border border-lime-600"
                            >
                                <EditIcon className="mr-1 h-3.5 w-3.5" />
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(row)}
                                className="px-3 py-1 flex items-center rounded-md text-[#d4380d] bg-[#fff2e8] text-xs font-medium border border-[#ffbb96]"
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
    ); // Dependencies for memoization

    // Memoize header actions to prevent recreating the object on every render
    const headerActions = useMemo(
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
                    placeholder="Search company structures..."
                    value={searchValue}
                    onChange={handleSearch}
                    onSearch={handleSearch}
                    size="small"
                    className="!max-w-90 !mb-0"
                />
            </div>
        ),
        [handleAddNew, searchValue, handleSearch]
    );

    // Memoize the "More Info" button
    const moreInfoButton = useMemo(
        () => (
            <TextButton
                text="More Info"
                size="small"
                onClick={handleMoreInfo}
                className="text-blue-600 hover:text-blue-800"
            />
        ),
        [handleMoreInfo]
    );

    return (
        <div className="space-y-6 mt-2">
            {/* First Container - Header Information */}
            <CustomContainer
                title="Company Structure"
                headerActions={moreInfoButton}
                padding="medium"
                className="bg-white"
            >
                <p className="text-gray-600 text-sm leading-relaxed">
                    Here you can define the structure of the company by adding
                    branches, departments, company units, etc. Each employee
                    needs to be connected to a company structure.
                </p>
            </CustomContainer>

            {/* Second Container - Table with Data */}
            <CustomContainer
                padding="medium"
                className="bg-white"
                headerActionsClassName="w-full"
                headerActions={headerActions}
            >
                <CustomTable
                    columns={columns}
                    data={filteredData}
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
                    emptyMessage="No company structures found"
                    tableControlClassName="!mb-0"
                />
            </CustomContainer>
        </div>
    );
}

export default CompanyStructureTab;
