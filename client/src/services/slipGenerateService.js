import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";

export const uploadSlipExcel = async (formData) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/slip-generate/upload`, // POST to upload
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data", // Ensure this header is correct
                },
            }
        );
        
        // Check if the response is successful
        if (response.status === 200 && response.data.success) {
            // Return the response data that includes the filePath and other information
            return response.data; // Expected: { success: true, filePath }
        } else {
            throw new Error("Failed to upload the file, please try again.");
        }
    } catch (error) {
        // Handle axios specific errors or any thrown errors
        if (axios.isAxiosError(error)) {
            // If it's an Axios error, we can inspect the error response
            console.error('Error response:', error.response);
            throw new Error(error.response?.data?.message || error.message || "An error occurred during file upload.");
        } else {
            // Any other errors thrown during the process
            console.error('Error:', error);
            throw new Error(error.message || "An unknown error occurred.");
        }
    }
};

// Function to start streaming the progress via EventSource (Server-Sent Events)
export const streamSlipProgress = (filePath) => {
    return new Promise((resolve, reject) => {
        const eventSource = new EventSource(`${API_URL}/api/slip-generate/stream-slip-progress?filePath=${filePath}`);
        
        eventSource.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                if (data.event === 'done') {
                    resolve(data); // Resolve when done
                    eventSource.close();
                } else {
                    resolve(data); // Return the progress
                }
            } catch (err) {
                reject(err);
                eventSource.close();
            }
        };

        eventSource.onerror = (err) => {
            reject(err);
            eventSource.close();
        };
    });
};
