// src/services/UploadService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";
const UPLOAD_ENDPOINT = `${API_URL}/api/upload`;

// Create axios instance with base URL
const uploadApi = axios.create({
    baseURL: UPLOAD_ENDPOINT,
    headers: {
        // Default headers will be overridden when necessary (e.g., for multipart/form-data)
        "Content-Type": "application/json",
    },
});

// Add request interceptor for logging
uploadApi.interceptors.request.use(
    (config) => {
        // Only log in development
        if (process.env.NODE_ENV === "development") {
            console.log(
                `Upload API Request: ${config.method.toUpperCase()} ${
                    config.url
                }`
            );
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Service for handling salary slip uploads
 */
class UploadService {
    /**
     * Upload a ZIP file containing salary slips and employee data
     * @param {File} zipFile - The ZIP file to upload
     * @returns {Promise<Object>} - Response with processed contacts and stats
     */
    async uploadSalarySlips(zipFile) {
        try {
            console.log("Uploading salary slips...");
            
            const formData = new FormData();
            formData.append("zipFile", zipFile);

            const response = await uploadApi.post("/salary-slips", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data;
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Handle API errors consistently
     * @private
     * @param {Error} error - The error object from axios
     */
    _handleError(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const errorMessage =
                error.response.data.message || "Error uploading file";
            console.error("Upload Error:", errorMessage);
            throw new Error(errorMessage);
        } else if (error.request) {
            // The request was made but no response was received
            const errorMessage =
                "No response from server. Please try again later.";
            console.error("Upload Error:", errorMessage);
            throw new Error(errorMessage);
        } else {
            // Something happened in setting up the request
            const errorMessage = "Error setting up request: " + error.message;
            console.error("Upload Error:", errorMessage);
            throw new Error(errorMessage);
        }
    }
}

export default new UploadService();
