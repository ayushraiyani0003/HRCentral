// Enhanced helper functions for time conversion

// Convert 24-hour format (HH:MM:SS or HH:MM) to 12-hour format with AM/PM
const formatTime = (timeString) => {
    if (!timeString) return "";

    try {
        // Handle both HH:MM:SS and HH:MM formats
        const [hours, minutes] = timeString.split(":");
        const hour24 = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);

        if (
            isNaN(hour24) ||
            isNaN(minute) ||
            hour24 < 0 ||
            hour24 > 23 ||
            minute < 0 ||
            minute > 59
        ) {
            return timeString; // Return original if invalid
        }

        const period = hour24 >= 12 ? "PM" : "AM";
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;

        return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
    } catch (error) {
        console.error("Error formatting time:", error);
        return timeString; // Return original if formatting fails
    }
};

// Convert 12-hour format (H:MM AM/PM) to 24-hour format (HH:MM:SS)
const convertTo24Hour = (timeString) => {
    if (!timeString) return "";

    try {
        // Remove extra spaces and convert to uppercase
        const cleanTime = timeString.trim().toUpperCase();

        // Check if it already contains AM/PM
        if (!cleanTime.includes("AM") && !cleanTime.includes("PM")) {
            // If no AM/PM, assume it's already in 24-hour format
            // Just ensure it has proper format
            const [hours, minutes] = cleanTime.split(":");
            const hour = parseInt(hours, 10);
            const minute = parseInt(minutes, 10);

            if (
                isNaN(hour) ||
                isNaN(minute) ||
                hour < 0 ||
                hour > 23 ||
                minute < 0 ||
                minute > 59
            ) {
                return timeString; // Return original if invalid
            }

            return `${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}:00`;
        }

        // Extract time part and period
        const timeMatch = cleanTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);

        if (!timeMatch) {
            console.warn("Invalid time format:", timeString);
            return timeString;
        }

        const [, hourStr, minuteStr, period] = timeMatch;
        let hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);

        // Validate inputs
        if (
            isNaN(hour) ||
            isNaN(minute) ||
            hour < 1 ||
            hour > 12 ||
            minute < 0 ||
            minute > 59
        ) {
            console.warn("Invalid time values:", timeString);
            return timeString;
        }

        // Convert to 24-hour format
        if (period === "AM") {
            hour = hour === 12 ? 0 : hour;
        } else {
            // PM
            hour = hour === 12 ? 12 : hour + 12;
        }

        return `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}:00`;
    } catch (error) {
        console.error("Error converting to 24-hour format:", error);
        return timeString;
    }
};

// Helper function to create timeRange with enhanced formatting
const createTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return "Flexible Timing";

    const formattedStart = formatTime(startTime);
    const formattedEnd = formatTime(endTime);

    if (!formattedStart || !formattedEnd) return "Flexible Timing";

    return `${formattedStart} to ${formattedEnd}`;
};

// Validate time format (both 12-hour and 24-hour)
const isValidTimeFormat = (timeString) => {
    if (!timeString) return false;

    const cleanTime = timeString.trim().toUpperCase();

    // Check for 12-hour format (H:MM AM/PM)
    const twelveHourMatch = cleanTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
    if (twelveHourMatch) {
        const [, hourStr, minuteStr] = twelveHourMatch;
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        return hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59;
    }

    // Check for 24-hour format (HH:MM or HH:MM:SS)
    const twentyFourHourMatch = cleanTime.match(
        /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/
    );
    if (twentyFourHourMatch) {
        const [, hourStr, minuteStr, secondStr] = twentyFourHourMatch;
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        const second = secondStr ? parseInt(secondStr, 10) : 0;
        return (
            hour >= 0 &&
            hour <= 23 &&
            minute >= 0 &&
            minute <= 59 &&
            second >= 0 &&
            second <= 59
        );
    }

    return false;
};

// Get current time in specified format
const getCurrentTime = (format = "24hour") => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    if (format === "12hour") {
        const period = hours >= 12 ? "PM" : "AM";
        const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
    }

    // Default to 24-hour format
    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

// Usage examples:
/*
// Converting for display (24-hour to 12-hour):
formatTime("08:00:00") // Returns: "8:00 AM"
formatTime("16:00:00") // Returns: "4:00 PM"
formatTime("00:30:00") // Returns: "12:30 AM"
formatTime("12:00:00") // Returns: "12:00 PM"

// Converting for storage (12-hour to 24-hour):
convertTo24Hour("8:00 AM")  // Returns: "08:00:00"
convertTo24Hour("4:00 PM")  // Returns: "16:00:00"
convertTo24Hour("12:30 AM") // Returns: "00:30:00"
convertTo24Hour("12:00 PM") // Returns: "12:00:00"

// Creating time ranges:
createTimeRange("08:00:00", "16:00:00") // Returns: "8:00 AM to 4:00 PM"

// Validation:
isValidTimeFormat("8:00 AM")   // Returns: true
isValidTimeFormat("16:00:00")  // Returns: true
isValidTimeFormat("25:00")     // Returns: false
isValidTimeFormat("invalid")   // Returns: false
*/

export {
    formatTime,
    convertTo24Hour,
    createTimeRange,
    isValidTimeFormat,
    getCurrentTime,
};
