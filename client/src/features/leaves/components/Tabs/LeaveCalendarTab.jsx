import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

function CalendarTab({ setCalendarModelOpen, selectedDate, setSelectedDate }) {
    const [viewMode, setViewMode] = useState("month"); // 'month' or 'year'
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Sample attendance data - in real app, this would come from props or API
    const attendanceData = {
        "2025-05-15": { attendance: 8, leave: 2, absent: 1 },
        "2025-05-22": { attendance: 9, leave: 1, absent: 1 },
        "2025-03": { attendance: 180, leave: 15, absent: 8 },
        "2025-04": { attendance: 200, leave: 10, absent: 5 },
        "2025-05": { attendance: 195, leave: 12, absent: 3 },
    };

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    // Helper function to format date in local timezone (YYYY-MM-DD)
    const formatDateLocal = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Helper function to create date from YYYY-MM-DD string in local timezone
    const createDateFromString = (dateString) => {
        if (!dateString) return new Date();
        
        // Handle month-only format (YYYY-MM)
        if (dateString.match(/^\d{4}-\d{2}$/)) {
            const [year, month] = dateString.split('-');
            return new Date(parseInt(year), parseInt(month) - 1, 1);
        }
        
        // Handle full date format (YYYY-MM-DD)
        const [year, month, day] = dateString.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    };

    // Use current date as fallback when selectedDate is null
    const currentDate = selectedDate ? createDateFromString(selectedDate) : new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Generate years for dropdown
    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
    }, []);

    // Generate calendar days for month view
    const generateCalendarDays = () => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const current = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return days;
    };

    const handleDateClick = (date) => {
        console.log("Date clicked:", date);
        
        const dateKey = formatDateLocal(date);
        console.log("Formatted date key:", dateKey);
        
        setSelectedDate(dateKey);
        setCalendarModelOpen(true);
    };

    const handleMonthClick = (monthIndex) => {
        const monthKey = `${currentYear}-${String(monthIndex + 1).padStart(2, "0")}`;
        console.log("Month clicked:", monthKey);
        
        setSelectedDate(monthKey);
        setCalendarModelOpen(true);
    };

    const handleDropdownSelect = (value, type) => {
        let year = currentYear;
        let month = currentMonth;

        if (type === "month") {
            month = value;
        } else if (type === "year") {
            year = value;
        }

        // Always use day 1 for consistency
        const day = 1;
        const newDate = new Date(year, month, day);
        const formattedDate = formatDateLocal(newDate);
        
        console.log("Dropdown selected:", value, type);
        console.log("New formatted date:", formattedDate);

        setSelectedDate(formattedDate);
        setDropdownOpen(false);
    };

    // Helper function to check if two dates are the same day (timezone-safe)
    const isSameDay = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    };

    const calendarDays = generateCalendarDays();
    const today = new Date();

    return (
        <div className="w-full mx-auto bg-white rounded-lg pt-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                {/* Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <span className="font-medium">
                            {viewMode === "month"
                                ? `${months[currentMonth]} ${currentYear}`
                                : currentYear}
                        </span>
                        <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                                dropdownOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                            {viewMode === "month" ? (
                                <div className="p-2">
                                    <div className="grid grid-cols-3 gap-1">
                                        {months.map((month, index) => (
                                            <button
                                                key={month}
                                                onClick={() =>
                                                    handleDropdownSelect(
                                                        index,
                                                        "month"
                                                    )
                                                }
                                                className={`px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                                                    index === currentMonth
                                                        ? "bg-blue-100 text-blue-600"
                                                        : ""
                                                }`}
                                            >
                                                {month.slice(0, 3)}
                                            </button>
                                        ))}
                                    </div>
                                    <hr className="my-2" />
                                    <div className="grid grid-cols-2 gap-1">
                                        {years.map((year) => (
                                            <button
                                                key={year}
                                                onClick={() =>
                                                    handleDropdownSelect(
                                                        year,
                                                        "year"
                                                    )
                                                }
                                                className={`px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                                                    year === currentYear
                                                        ? "bg-blue-100 text-blue-600"
                                                        : ""
                                                }`}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-2 grid grid-cols-2 gap-1">
                                    {years.map((year) => (
                                        <button
                                            key={year}
                                            onClick={() =>
                                                handleDropdownSelect(
                                                    year,
                                                    "year"
                                                )
                                            }
                                            className={`px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                                                year === currentYear
                                                    ? "bg-blue-100 text-blue-600"
                                                    : ""
                                            }`}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Toggle Button */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode("month")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            viewMode === "month"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        Month
                    </button>
                    <button
                        onClick={() => setViewMode("year")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            viewMode === "year"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        Year
                    </button>
                </div>
            </div>

            {/* Calendar Content */}
            {viewMode === "month" ? (
                <div>
                    {/* Month View */}
                    <div className="grid grid-cols-7 gap-1 mb-4">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                            (day) => (
                                <div
                                    key={day}
                                    className="text-center text-sm font-medium text-gray-500 py-2"
                                >
                                    {day}
                                </div>
                            )
                        )}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((date, index) => {
                            const isCurrentMonth = date.getMonth() === currentMonth;
                            const dateKey = formatDateLocal(date);
                            const hasData = attendanceData[dateKey];
                            const isToday = isSameDay(date, today);

                            return (
                                <div
                                    key={index}
                                    onClick={() =>
                                        isCurrentMonth && handleDateClick(date)
                                    }
                                    className={`
                    min-h-20 p-2 border rounded-lg cursor-pointer transition-all hover:bg-gray-50
                    ${
                        isCurrentMonth
                            ? "bg-white border-gray-200"
                            : "bg-gray-50 border-gray-100 text-gray-400"
                    }
                    ${isToday ? "ring-2 ring-blue-500" : ""}
                    ${hasData ? "hover:bg-blue-50" : ""}
                  `}
                                >
                                    <div
                                        className={`text-sm font-medium ${
                                            isToday ? "text-blue-600" : ""
                                        }`}
                                    >
                                        {date.getDate()}
                                    </div>

                                    {hasData && isCurrentMonth && (
                                        <div className="flex flex-row justify-between w-full gap-2 mt-1.5">
                                            <div className="flex flex-row items-center justify-center flex-1 bg-green-100 text-green-700 px-2 py-1 rounded text-l gap-2">
                                                <div className="font-semibold">
                                                    P
                                                </div>
                                                <div className="font-bold">
                                                    {hasData.attendance}
                                                </div>
                                            </div>
                                            <div className="flex flex-row items-center justify-center flex-1  bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-l gap-2">
                                                <div className="font-semibold">
                                                    L
                                                </div>
                                                <div className="font-bold">
                                                    {hasData.leave}
                                                </div>
                                            </div>
                                            <div className="flex flex-row items-center justify-center flex-1  bg-red-100 text-red-700 px-2 py-1 rounded text-l gap-2">
                                                <div className="font-semibold">
                                                    Ab
                                                </div>
                                                <div className="font-bold">
                                                    {hasData.absent}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div>
                    {/* Year View */}
                    <div className="grid grid-cols-3 gap-4">
                        {months.map((month, index) => {
                            const monthKey = `${currentYear}-${String(
                                index + 1
                            ).padStart(2, "0")}`;
                            const hasData = attendanceData[monthKey];

                            return (
                                <div
                                    key={month}
                                    onClick={() => handleMonthClick(index)}
                                    className={`
                    p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50
                    ${
                        hasData
                            ? "border-blue-200 hover:bg-blue-50"
                            : "border-gray-200"
                    }
                    `}
                                >
                                    <div className="text-lg font-semibold text-gray-800 mb-2">
                                        {month}
                                    </div>

                                    {hasData && (
                                        <div className="flex flex-row justify-between w-full gap-2 mt-1.5">
                                            <div className="flex flex-row items-center justify-center flex-1 bg-green-50 text-green-800 px-3 py-2 rounded-xl gap-2 border border-green-800">
                                                <div className="text-xs bg-green-200 text-green-900 px-1.5 py-0.5 rounded-full font-medium">
                                                    Present
                                                </div>
                                                <div className="text-lg font-semibold">
                                                    {hasData.attendance}
                                                </div>
                                            </div>
                                            <div className="flex flex-row items-center justify-center flex-1 bg-yellow-50 text-yellow-800 px-3 py-2 rounded-xl gap-2 border border-yellow-800">
                                                <div className="text-xs bg-yellow-200 text-yellow-900 px-1.5 py-0.5 rounded-full font-medium">
                                                    Leave
                                                </div>
                                                <div className="text-lg font-semibold">
                                                    {hasData.leave}
                                                </div>
                                            </div>
                                            <div className="flex flex-row items-center justify-center flex-1 bg-red-50 text-red-800 px-3 py-2 rounded-xl gap-2 border border-red-800">
                                                <div className="text-xs bg-red-200 text-red-900 px-1.5 py-0.5 rounded-full font-medium">
                                                    Absent
                                                </div>
                                                <div className="text-lg font-semibold">
                                                    {hasData.absent}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!hasData && (
                                        <div className="text-sm text-gray-500">
                                            No data available
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CalendarTab;