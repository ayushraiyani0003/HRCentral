import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";

// Function to upload the Excel file and handle the response
export const uploadSlipExcel = async (formData) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/slip-generate/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        // Check if the response is successful
        if (response.status === 200 && response.data.success) {
            return response.data; // Expected: { success: true, filePath }
        } else {
            throw new Error("Failed to upload the file, please try again.");
        }
    } catch (error) {
        // Handle axios specific errors or any thrown errors
        if (axios.isAxiosError(error)) {
            console.error("Error response:", error.response);
            throw new Error(
                error.response?.data?.message ||
                    error.message ||
                    "An error occurred during file upload."
            );
        } else {
            console.error("Error:", error);
            throw new Error(error.message || "An unknown error occurred.");
        }
    }
};

// Function to connect to the SSE stream and handle all messages until completion
export const connectToSlipProgressStream = (filePath, handlers = {}) => {
    const { onProgress, onComplete, onError } = handlers;

    // Create a new EventSource connection to the server
    const eventSource = new EventSource(
        `${API_URL}/api/slip-generate/stream-slip-progress?filePath=${filePath}`
    );

    // Handle the 'info' event (e.g. 'Processing started')
    eventSource.addEventListener("info", (event) => {
        const data = JSON.parse(event.data);
        if (onProgress) onProgress(data); // Pass the data to onProgress handler
    });

    // Handle the 'progress' event (for progress updates during processing)
    eventSource.addEventListener("progress", (event) => {
        const data = JSON.parse(event.data);
        if (onProgress) onProgress(data); // Pass the data to onProgress handler
    });

    // Handle the 'done' event (when processing is complete)
    eventSource.addEventListener("done", (event) => {
        const data = JSON.parse(event.data);
        if (onComplete) onComplete(data); // Pass the completion data to onComplete handler
        eventSource.close(); // Close the connection after processing is complete
    });

    // Handle the 'error' event (when an error occurs during processing)
    eventSource.addEventListener("error", (event) => {
        try {
            const data = JSON.parse(event.data);
            if (onError) onError(data.error || "Server error"); // Pass the error message to onError handler
        } catch {
            if (onError) onError("Unknown error from server"); // If there is an issue parsing the error, display a generic message
        }
        eventSource.close(); // Close the connection on error
    });

    // Return an object with a close method to manually close the connection
    return {
        close: () => eventSource.close(),
    };
};

// Optional helper function to handle one-time progress fetch (as fallback or for testing)
export const fetchSlipProgress = async (filePath) => {
    try {
        const response = await axios.get(
            `${API_URL}/api/slip-generate/progress?filePath=${filePath}`
        );

        if (response.status === 200) {
            return response.data; // Return the progress data from the server
        } else {
            throw new Error("Failed to fetch progress");
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || error.message);
        } else {
            throw new Error(error.message || "An unknown error occurred.");
        }
    }
};
