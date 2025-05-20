import React from "react";
import { CustomSearchBar, Pagination } from "../../../../../components";

function EmployeeList({
    searchQuery,
    handleSearch,
    handleEmployeeSelect,
    selectedEmployee,
    displayedEmployees,
    setCurrentPage,
    currentPage,
    totalPages,
    pageSize,
    filteredEmployees,
}) {
    return (
        <div className="w-3/11 border-r border-gray-200 pr-4">
            {/* Search bar section */}
            <div className="mb-2">
                <CustomSearchBar
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={handleSearch}
                    onSearch={handleSearch}
                    onClear={() => handleSearch("")}
                    allowClear={true}
                    size="medium"
                    rounded={false}
                    className="!mb-0"
                />
            </div>

            {/* List of employees section */}
            <div className="mb-4 overflow-y-auto max-h-142">
                {displayedEmployees.map((employee) => (
                    <div
                        key={employee.id}
                        className={`flex flex-col mb-1 py-2 px-3 rounded cursor-pointer hover:bg-gray-100 transition-colors ${
                            selectedEmployee?.id === employee.id
                                ? "bg-blue-50"
                                : ""
                        }`}
                        onClick={() => handleEmployeeSelect(employee)}
                    >
                        <div className="flex items-center">
                            <img
                                src={employee.avatar}
                                alt={employee.name}
                                className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                                <div className="flex items-center">
                                    <span className="font-medium">
                                        {employee.name}
                                    </span>
                                    <span className="ml-2 text-sm text-gray-500">
                                        #{employee.punchCode}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    {employee.designation},{" "}
                                    {employee.department}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {displayedEmployees.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No employees found
                    </div>
                )}
            </div>

            {/* Pagination section */}
            <div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredEmployees.length}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    showJumpToPage={false}
                    maxVisibleButtons={5}
                    showItemsCount={false}
                    variant="default"
                    size="medium"
                />
            </div>
        </div>
    );
}

export default EmployeeList;
