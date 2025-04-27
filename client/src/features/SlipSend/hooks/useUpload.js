// src/hooks/useUpload.js
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback } from "react";
import {
    uploadSalarySlips,
    clearContacts,
    updateContact,
} from "../../../store/uploadSlice";

/**
 * Custom hook for handling upload operations
 * @returns {Object} Upload methods and state
 */
export const useUpload = () => {
    const dispatch = useDispatch();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    // Get upload state from Redux
    const { contacts, stats, loading, error, success } = useSelector(
        (state) => state.upload
    );

    /**
     * Upload salary slip ZIP file
     * @param {File} zipFile - The ZIP file to upload
     * @returns {Promise<boolean>} Success state
     */
    const uploadFile = useCallback(
        async (zipFile) => {
            try {
                setIsUploading(true);
                setUploadError(null);
                // In uploadFile function
                console.log("Sending file to API:", zipFile);

                // Use the Redux action which uses the service internally
                await dispatch(uploadSalarySlips(zipFile)).unwrap();

                setIsUploading(false);
                return true;
            } catch (error) {
                setUploadError(error.message || "Failed to upload file");
                setIsUploading(false);
                return false;
            }
        },
        [dispatch]
    );

    /**
     * Clear all uploaded contacts data
     */
    const clearUploadedData = useCallback(() => {
        dispatch(clearContacts());
        setUploadError(null);
    }, [dispatch]);

    /**
     * Update a specific contact's data
     * @param {number} index - Index of the contact to update
     * @param {Object} updates - Fields to update
     */
    const updateContactData = useCallback(
        (index, updates) => {
            dispatch(updateContact({ index, updates }));
        },
        [dispatch]
    );

    /**
     * Validate a file before upload
     * @param {File} file - The file to validate
     * @returns {Object} Validation result with isValid and errorMessage
     */
    const validateFile = useCallback((file) => {
        if (!file) {
            return { isValid: false, errorMessage: "No file selected" };
        }

        if (file.type !== "application/zip" && !file.name.endsWith(".zip")) {
            return { isValid: false, errorMessage: "File must be a ZIP file" };
        }

        if (file.size > 200 * 1024 * 1024) {
            // 100MB limit
            return {
                isValid: false,
                errorMessage: "File size exceeds 100MB limit",
            };
        }

        return { isValid: true, errorMessage: null };
    }, []);

    /**
     * Upload multiple files (filters for single ZIP)
     * @param {FileList|Array} files - List of files to upload
     * @returns {Promise<Object>} Result of the upload operation
     */
    const handleFileUpload = useCallback(
        async (files) => {
            if (!files || files.length === 0) {
                return { success: false, message: "No files selected" };
            }
            console.log("Files in hook:", files);

            // Handle both FileList and normal arrays
            const filesArray = Array.from(files);

            if (filesArray.length > 1) {
                return {
                    success: false,
                    message: "Please upload only one ZIP file",
                };
            }

            const file = filesArray[0];
            const validation = validateFile(file);

            if (!validation.isValid) {
                return { success: false, message: validation.errorMessage };
            }

            const success = await uploadFile(file);
            return {
                success,
                message: success
                    ? "File uploaded successfully"
                    : uploadError || "Upload failed",
            };
        },
        [validateFile, uploadFile, uploadError]
    );

    return {
        // Methods
        uploadFile,
        validateFile,
        handleFileUpload,
        clearUploadedData,
        updateContactData,

        // State
        isUploading,
        uploadError,
        contacts,
        stats,

        // Redux state
        loading,
        error,
        success,
        hasContacts: contacts && contacts.length > 0,
    };
};
