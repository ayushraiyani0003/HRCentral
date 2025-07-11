import React from "react";
import {
    CustomTabs,
    CustomTextInput,
    CustomModal,
} from "../../../../components";
import useCountryTab from "../../hooks/useCountryTab";
import useBankListTab from "../../hooks/useBankListTab";
import useSalutationTab from "../../hooks/useSalutationTab";

function DeleteConfirmationModal({
    openDeleteModel,
    setOpenDeleteModel,
    rowData,
    setupType,
}) {
    // Debug only
    // console.log(rowData);

    const { handleDeleteCountry } = useCountryTab(setOpenDeleteModel);
    const { handleDeleteBank } = useBankListTab(setOpenDeleteModel);
    const { handleDeleteSalutation } = useSalutationTab(setOpenDeleteModel);

    const handleDelete = () => {
        switch (setupType) {
            case "BankList":
                handleDeleteBank(rowData.id);
                break;
            case "Country":
                handleDeleteCountry(rowData.id);
                break;
            case "Salutation":
                handleDeleteSalutation(rowData.id);
                break;
            default:
                break;
        }
        setOpenDeleteModel(false);
    };

    // Add null check to prevent the error
    if (!rowData) {
        return null;
    }

    return (
        <CustomModal
            isOpen={openDeleteModel}
            onClose={() => setOpenDeleteModel(false)}
            title={`Delete ${rowData.name}`}
            size="medium"
            showCloseButton={true}
            closeOnOverlayClick={false}
            closeOnEscape={true}
            bodyClassName="!px-0 !py-0"
        >
            <div className="p-6">
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
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                    </svg>
                </div>

                <div className="text-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Are you sure you want to delete "{rowData.name}"?
                    </h3>
                    <p className="text-sm text-gray-500">
                        This action cannot be undone.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
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
                        Delete This
                    </button>
                </div>
            </div>
        </CustomModal>
    );
}

export default DeleteConfirmationModal;
