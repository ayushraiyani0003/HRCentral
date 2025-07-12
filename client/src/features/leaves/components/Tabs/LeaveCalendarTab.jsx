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
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // Helper function to create date from YYYY-MM-DD string in local timezone
    const createDateFromString = (dateString) => {
        if (!dateString) return new Date();

        // Handle month-only format (YYYY-MM)
        if (dateString.match(/^\d{4}-\d{2}$/)) {
            const [year, month] = dateString.split("-");
            return new Date(parseInt(year), parseInt(month) - 1, 1);
        }

        // Handle full date format (YYYY-MM-DD)
        const [year, month, day] = dateString.split("-");
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    };

    // Use current date as fallback when selectedDate is null
    const currentDate = selectedDate
        ? createDateFromString(selectedDate)
        : new Date();
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
        const dateKey = formatDateLocal(date);
        setSelectedDate(dateKey);
        setCalendarModelOpen(true);
    };

    const handleMonthClick = (monthIndex) => {
        const monthKey = `${currentYear}-${String(monthIndex + 1).padStart(
            2,
            "0"
        )}`;
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

        setSelectedDate(formattedDate);
        setDropdownOpen(false);
    };

    // Helper function to check if two dates are the same day (timezone-safe)
    const isSameDay = (date1, date2) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    const calendarDays = generateCalendarDays();
    const today = new Date();

    return (
        <div className="w-full mx-auto bg-white rounded-lg p-2 sm:p-3 lg:p-4 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 flex-shrink-0">
                {/* Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
                    >
                        <span className="font-medium">
                            {viewMode === "month"
                                ? `${months[currentMonth]} ${currentYear}`
                                : currentYear}
                        </span>
                        <ChevronDown
                            className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${
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
                                                className={`px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded hover:bg-gray-100 ${
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
                                                className={`px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded hover:bg-gray-100 ${
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
                                            className={`px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded hover:bg-gray-100 ${
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
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                            viewMode === "month"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        Month
                    </button>
                    <button
                        onClick={() => setViewMode("year")}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
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
            <div className="flex-1 flex flex-col min-h-0">
                {viewMode === "month" ? (
                    <div className="flex flex-col h-full">
                        {/* Month View Header */}
                        <div className="grid grid-cols-7 gap-1 mb-2 sm:mb-4 flex-shrink-0">
                            {[
                                "Sun",
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                            ].map((day) => (
                                <div
                                    key={day}
                                    className="text-center text-xs sm:text-sm font-medium text-gray-500 py-1 sm:py-2"
                                >
                                    <span className="hidden sm:inline">
                                        {day}
                                    </span>
                                    <span className="sm:hidden">
                                        {day.slice(0, 1)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid - Takes remaining space */}
                        <div className="grid grid-cols-7 gap-1 flex-1 auto-rows-fr">
                            {calendarDays.map((date, index) => {
                                const isCurrentMonth =
                                    date.getMonth() === currentMonth;
                                const dateKey = formatDateLocal(date);
                                const hasData = attendanceData[dateKey];
                                const isToday = isSameDay(date, today);

                                return (
                                    <div
                                        key={index}
                                        onClick={() =>
                                            isCurrentMonth &&
                                            handleDateClick(date)
                                        }
                                        className={`relative flex flex-col p-1 sm:p-2 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 min-h-16 sm:min-h-20 lg:min-h-24
                        ${
                            isCurrentMonth
                                ? "bg-white border-gray-200"
                                : "bg-gray-50 border-gray-100 text-gray-400"
                        }
                        ${isToday ? "ring-1 sm:ring-2 ring-blue-500" : ""}
                        ${hasData ? "hover:bg-blue-50" : ""}
                      `}
                                    >
                                        <div
                                            className={`text-xs sm:text-sm font-medium mb-1 flex-shrink-0 ${
                                                isToday ? "text-blue-600" : ""
                                            }`}
                                        >
                                            {date.getDate()}
                                        </div>

                                        {hasData && isCurrentMonth && (
                                            <div className="flex flex-col sm:flex-row justify-between w-full gap-1 flex-1">
                                                <div className="flex flex-row items-center justify-center flex-1 bg-green-100 text-green-700 px-1 py-0.5 sm:px-2 sm:py-1 rounded text-l gap-1">
                                                    <div className="font-semibold">
                                                        P
                                                    </div>
                                                    <div className="font-bold">
                                                        {hasData.attendance}
                                                    </div>
                                                </div>
                                                <div className="flex flex-row items-center justify-center flex-1 bg-yellow-100 text-yellow-700 px-1 py-0.5 sm:px-2 sm:py-1 rounded text-l gap-1">
                                                    <div className="font-semibold">
                                                        L
                                                    </div>
                                                    <div className="font-bold">
                                                        {hasData.leave}
                                                    </div>
                                                </div>
                                                <div className="flex flex-row items-center justify-center flex-1 bg-red-100 text-red-700 px-1 py-0.5 sm:px-2 sm:py-1 rounded text-l gap-1">
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
                    <div className="h-full overflow-auto">
                        {/* Year View */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
                        p-3 sm:p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 min-h-32 sm:min-h-36
                        ${
                            hasData
                                ? "border-blue-200 hover:bg-blue-50"
                                : "border-gray-200"
                        }
                        `}
                                    >
                                        <div className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                                            {month}
                                        </div>

                                        {hasData && (
                                            <div className="flex flex-col sm:flex-row justify-between w-full gap-2">
                                                <div className="flex flex-row items-center justify-center flex-1 bg-green-50 text-green-800 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl gap-1 sm:gap-2 border border-green-200">
                                                    <div className="bg-green-200 text-green-900 px-1 py-0.5 sm:px-1.5 rounded-full font-medium text-[13px] leading-[18px]">
                                                        Present
                                                    </div>
                                                    <div className="text-sm sm:text-lg font-semibold">
                                                        {hasData.attendance}
                                                    </div>
                                                </div>
                                                <div className="flex flex-row items-center justify-center flex-1 bg-yellow-50 text-yellow-800 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl gap-1 sm:gap-2 border border-yellow-200">
                                                    <div className="text-[13px] leading-[18px] bg-yellow-200 text-yellow-900 px-1 py-0.5 sm:px-1.5 rounded-full font-medium">
                                                        Leave
                                                    </div>
                                                    <div className="text-sm sm:text-lg font-semibold">
                                                        {hasData.leave}
                                                    </div>
                                                </div>
                                                <div className="flex flex-row items-center justify-center flex-1 bg-red-50 text-red-800 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl gap-1 sm:gap-2 border border-red-200">
                                                    <div className="text-[13px] leading-[18px] bg-red-200 text-red-900 px-1 py-0.5 sm:px-1.5 rounded-full font-medium">
                                                        Absent
                                                    </div>
                                                    <div className="text-sm sm:text-lg font-semibold">
                                                        {hasData.absent}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {!hasData && (
                                            <div className="text-xs sm:text-sm text-gray-500">
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
        </div>
    );
}

export default CalendarTab;
