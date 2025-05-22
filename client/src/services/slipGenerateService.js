import axios from "axios";

/**
 * Function to upload the Excel file for payslip generation
 * @param {FormData} formData - Form data containing the Excel file
 * @returns {Promise<Object>} Upload response with file path
 */
export const uploadSlipExcel = async (formData) => {
    try {
        const response = await axios.post(
            `/api/slip-generate/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        // Check if the response is successful
        if (response.status === 200 && response.data.success) {
            return response.data; // Expected: { success: true, filePath, sessionId }
        } else {
            throw new Error(response.data.error || "Failed to upload the file, please try again.");
        }
    } catch (error) {
        // Handle axios specific errors or any thrown errors
        if (axios.isAxiosError(error)) {
            console.error("Error uploading file:", error.response?.data || error.message);
            throw new Error(
                error.response?.data?.error || 
                error.response?.data?.message ||
                error.message ||
                "An error occurred during file upload."
            );
        } else {
            console.error("Unknown error during upload:", error);
            throw new Error(error.message || "An unknown error occurred.");
        }
    }
};

/**
 * Function to connect to the SSE stream for real-time progress updates
 * @param {string} filePath - Path to the uploaded file
 * @param {Object} handlers - Event handlers for different SSE events
 * @returns {Object} Object with methods to control the SSE connection
 */
export const connectToSlipProgressStream = (filePath, handlers = {}) => {
    const { onProgress, onComplete, onError, onInfo } = handlers;
    
    // Track progress state for internal use
    let progressState = {
        total: 0,
        generated: 0,
        failed: 0,
        pending: 0,
        percentage: 0,
        tracking: [],
        zipPath: null,
        zipFilename: null
    };

    // Flag to track if we expect the connection to close
    let expectedClose = false;
    
    // Encode the file path to handle special characters
    const encodedFilePath = encodeURIComponent(filePath);
    
    // Create a new EventSource connection with a unique cache-busting parameter
    const eventSource = new EventSource(
        `/api/slip-generate/stream-slip-progress?filePath=${encodedFilePath}`
    );

    // console.log("SSE connection established to:", 
    //     `${API_URL}/api/slip-generate/stream-slip-progress?filePath=${encodedFilePath}`); // debug only

    // Create a safe close function
    const safeCloseConnection = () => {
        if (eventSource && eventSource.readyState !== 2) { // 2 = CLOSED
            expectedClose = true;
            
            // Remove all event listeners first to prevent error events from firing
            eventSource.removeEventListener("info", infoHandler);
            eventSource.removeEventListener("progress", progressHandler);
            eventSource.removeEventListener("done", doneHandler);
            eventSource.removeEventListener("error", errorHandler);
            eventSource.onerror = null;
            
            // Then close the connection
            eventSource.close(); 
            // console.log("SSE connection closed successfully"); // debug only
        }
    };

    // Define handlers as named functions so we can remove them later
    function infoHandler(event) {
        try {
            const data = JSON.parse(event.data);
            // console.log("SSE info event:", data); // debug only
            
            if (onInfo) onInfo(data);
            
            // Also pass to onProgress for UI updates
            if (onProgress) onProgress({
                ...progressState,
                message: data.message,
                eventType: "info"
            });
        } catch (error) {
            console.error("Error parsing info event:", error);
        }
    }

    function progressHandler(event) {
        try {
            const data = JSON.parse(event.data);
            // console.log("SSE progress event:", data); // debug only
            
            // Update internal progress state
            progressState = {
                ...progressState,
                ...data,
                eventType: "progress"
            };
            
            if (onProgress) onProgress(progressState);
        } catch (error) {
            console.error("Error parsing progress event:", error);
        }
    }

    function doneHandler(event) {
        try {
            const data = JSON.parse(event.data);
            // console.log("SSE done event:", data); // debug only
    
            const finalState = {
                ...progressState,
                ...data,
                completed: true,
                eventType: "done"
            };
    
            if (onProgress) onProgress(finalState);
    
            // Ensure zipPath is present before attempting download
            if (!data.zipPath) {
                throw new Error("ZIP file path not provided by server.");
            }
    
            // Mark as expected close before performing actions
            expectedClose = true;
    
            // Trigger file download from server using filePath
            const downloadUrl = `/api/slip-generate/download?filePath=${encodeURIComponent(data.zipPath)}`;
    
            const response = axios.get(downloadUrl, {
                responseType: "blob"
            }).then(response => {
                // Create a temporary link to download the blob
                const blob = new Blob([response.data], { type: "application/zip" });
                const downloadLink = document.createElement("a");
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = data.zipFilename || "payslips.zip";
                document.body.appendChild(downloadLink);
                downloadLink.click();
                
                // Clean up the link and URL object
                setTimeout(() => {
                    document.body.removeChild(downloadLink);
                    URL.revokeObjectURL(downloadLink.href);
                }, 100);
        
                if (onComplete) onComplete(finalState);
            }).catch(error => {
                console.error("Error downloading ZIP:", error);
                if (onError) onError("Failed to download ZIP file.");
            }).finally(() => {
                // Safely close the connection after everything is done
                setTimeout(() => safeCloseConnection(), 500);
            });
        } catch (error) {
            console.error("Error handling done event:", error);
            if (onError) onError("Failed to process completion event.");
            safeCloseConnection();
        }
    }

    function errorHandler(event) {
        // If we're expecting the connection to close, don't treat it as an error
        if (expectedClose) {
            // console.log("Ignoring error event after expected close"); // debug only
            return;
        }
        
        try {
            if (!event.data) {
                console.error("SSE connection error (no data):", event);
                if (onError) onError("Connection to server lost. Please try again.");
                safeCloseConnection();
                return;
            }
            
            // This is a data error sent by the server
            const data = JSON.parse(event.data);
            console.error("SSE error event:", data);
            
            if (onError) onError(data.error || "Server error during processing");
            if (onProgress) onProgress({
                ...progressState,
                error: data.error,
                eventType: "error"
            });
            
            safeCloseConnection();
        } catch (error) {
            console.error("Error handling SSE error event:", error);
            if (onError) onError("Unknown error from server");
            safeCloseConnection();
        }
    }

    // Handle browser-side connection errors
    eventSource.onerror = (event) => {
        // If we're expecting the connection to close, don't treat it as an error
        if (expectedClose) {
            // console.log("Ignoring onerror event after expected close"); // debug only
            return;
        }
        
        console.error("SSE general error:", event);
        
        if (onError && !expectedClose) {
            onError("Connection error. Please check your network connection.");
        }
        
        safeCloseConnection();
    };

    // Attach event listeners
    eventSource.addEventListener("info", infoHandler);
    eventSource.addEventListener("progress", progressHandler);
    eventSource.addEventListener("done", doneHandler);
    eventSource.addEventListener("error", errorHandler);

    // Return an object with methods to control the connection
    return {
        // Method to manually close the connection
        close: () => {
            // console.log("Manually closing SSE connection"); // debug only
            safeCloseConnection();
        },
        
        // Method to get the current progress state
        getState: () => ({ ...progressState }),
        
        // Check if the connection is active
        isActive: () => eventSource && eventSource.readyState === 1 // 1 = OPEN
    };
};
