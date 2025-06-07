import React from "react";
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
import useAllCandidatesTab from "../../hooks/useAllCandidatesTab";

function AllCandidatesTab({
    setOpenDeleteModel,
    setCandidate = () => {},
    setOpenCandidateModal = () => {}, // Fixed: Changed from setOpenCandidateModel to setOpenCandidateModal
    setModelType = () => {},
    userLevel,
}) {
    const {
        searchValue,
        filteredData,
        handleAddNew,
        handleView,
        handleEdit,
        handleDelete,
        handleSearch,
    } = useAllCandidatesTab({
        setOpenDeleteModel,
        setCandidate,
        setOpenCandidateModal, // Fixed: Updated prop name
        setModelType,
    });

    // console.log("userLevel", userLevel);

    // Fixed: Corrected table columns configuration with proper headers and data display
    const columns = [
        {
            key: "position",
            header: "Position", // Fixed: Changed from "Experience Level"
            sortable: true,
            className: "font-medium text-gray-900",
            width: "220px",
            cell: (row) => row.position, // Added data display
        },
        {
            key: "applicationDate",
            header: "Application Date", // Fixed: Changed from "Experience Level"
            sortable: true,
            className: "font-medium text-gray-900",
            width: "180px",
            cell: (row) => new Date(row.applicationDate).toLocaleDateString(), // Added formatted date display
        },
        {
            key: "firstName",
            header: "First Name", // Fixed: Changed from "Experience Level"
            sortable: true,
            className: "font-medium text-gray-900",
            width: "220px",
            cell: (row) => row.firstName, // Added data display
        },
        {
            key: "lastName",
            header: "Last Name", // Fixed: Changed from "Experience Level"
            sortable: true,
            className: "font-medium text-gray-900",
            width: "220px",
            cell: (row) => row.lastName, // Added data display
        },
        {
            key: "mobileNumber",
            header: "Mobile Number", // Fixed: Changed from "Experience Level"
            sortable: true,
            className: "font-medium text-gray-900",
            width: "220px",
            cell: (row) => row.mobileNumber, // Added data display
        },
        {
            key: "hiringStage",
            header: "Hiring Stage", // Fixed: Changed from "Experience Level"
            sortable: true,
            className: "font-medium text-gray-900",
            width: "220px",
            cell: (row) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.hiringStage === "Interview"
                            ? "bg-blue-100 text-blue-800"
                            : row.hiringStage === "Screening"
                            ? "bg-yellow-100 text-yellow-800"
                            : row.hiringStage === "Hired"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                >
                    {row.hiringStage}
                </span>
            ),
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
    ];

    return (
        <div className="space-y-6 mt-2">
            <CustomContainer
                padding="medium"
                className="bg-white"
                headerActionsClassName="w-full"
                headerActions={
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
                            placeholder="Search candidates..." // Fixed: Updated placeholder
                            value={searchValue}
                            onChange={handleSearch}
                            onSearch={handleSearch}
                            size="small"
                            className="!max-w-90 !mb-0"
                        />
                    </div>
                }
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
                    emptyMessage="No candidates found" // Fixed: Updated message
                    tableControlClassName="!mb-0"
                    extraHeaderContent={null}
                />
            </CustomContainer>
        </div>
    );
}

export default AllCandidatesTab;
