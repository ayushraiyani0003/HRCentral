import React from "react";
import {
    CustomTabs,
    CustomTextInput,
    CustomModal,
} from "../../../../../components";

import useCompanyStructureTab from "../../../hooks/useCompanyStructureTab";

function DeleteConfirmationModal({
    openDeleteModel,
    setOpenDeleteModel,
    companyStructure,
}) {
    const { handleConfirmDelete } = useCompanyStructureTab({
        setOpenDeleteModel,
        modelType: "delete",
        companyStructure,
        handleCloseStructureModel: () => {},
    });

    const handleDelete = () => {
        handleConfirmDelete(companyStructure.id);
        setOpenDeleteModel(false);
    };

    const isEmployee = companyStructure?.type === "employee";
    const entityType = isEmployee ? "Employee" : "Department";
    const entityName = companyStructure?.name || "Unknown";

    return (
        <CustomModal
            isOpen={openDeleteModel}
            onClose={() => setOpenDeleteModel(false)}
            title={`Delete ${entityType}`}
            size="medium"
            showCloseButton={true}
            closeOnOverlayClick={false}
            closeOnEscape={true}
            bodyClassName="!px-0 !py-0"
        >
            <div className="px-6 py-6">
                {/* Warning Icon */}
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                    <svg
                        className="w-6 h-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                    </svg>
                </div>

                {/* Main Message */}
                <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Are you sure you want to delete this{" "}
                        {entityType.toLowerCase()}?
                    </h3>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-600 mb-1">
                            {entityType} Name:
                        </p>
                        <p className="font-medium text-gray-900">
                            {entityName}
                        </p>
                    </div>

                    <p className="text-sm text-gray-600">
                        {isEmployee
                            ? "This action will permanently remove the employee from the company structure. This action cannot be undone."
                            : "This action will permanently remove the department and all its sub-departments from the company structure. This action cannot be undone."}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 sm:justify-end">
                    <button
                        onClick={() => setOpenDeleteModel(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                        Delete {entityType}
                    </button>
                </div>
            </div>
        </CustomModal>
    );
}

export default DeleteConfirmationModal;
