import React, { useState, forwardRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ModernDateRangePicker.css"; // Custom CSS file

// const today = new Date();
// const nextWeek = new Date();
// nextWeek.setDate(today.getDate() + 7);
// const [date, setDate] = React.useState([today, nextWeek]);
// const handleDateChange = (update) => {
//     setDate(update);
// };
// <ModernDateRangePicker
//     label="Select vacation dates"
//     initialStartDate={date[0]}
//     initialEndDate={date[1]}
//     handleDateChange={handleDateChange}
// />

// Custom input component for the date picker with fixed icon layout
const CustomInput = forwardRef(
    ({ value, onClick, placeholder, onClear }, ref) => (
        <div className="date-input-wrapper">
            <button className="date-input" onClick={onClick} ref={ref}>
                <span className="date-value">
                    {value || placeholder || "Select dates"}
                </span>
                <div className="date-input-icons">
                    {value && (
                        <button
                            type="button"
                            className="clear-date-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClear();
                            }}
                            aria-label="Clear date selection"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="clear-icon"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    )}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="calendar-icon"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </button>
        </div>
    )
);
export default function ModernDateRangePicker({
    label,
    onChange,
    initialStartDate,
    initialEndDate,
}) {
    // Initialize dateRange with initialStartDate and initialEndDate
    const [dateRange, setDateRange] = useState([
        initialStartDate || null,
        initialEndDate || null,
    ]);

    // Update dateRange when initialStartDate or initialEndDate changes
    useEffect(() => {
        if (initialStartDate || initialEndDate) {
            setDateRange([initialStartDate, initialEndDate]);
        }
    }, [initialStartDate, initialEndDate]);

    const [startDate, endDate] = dateRange;

    const handleChange = (update) => {
        setDateRange(update);
        if (onChange) {
            onChange(update);
        }
    };

    // Clear date handler
    const handleClear = () => {
        setDateRange([null, null]);
        if (onChange) {
            onChange([null, null]);
        }
    };

    // Format the display value
    const formatDisplayValue = () => {
        if (!startDate) return "";

        const formatDate = (date) => {
            if (!date) return "";
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
        };

        if (!endDate) return formatDate(startDate);
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    };

    return (
        <div className="date-picker-container">
            {label && <label className="date-picker-label">{label}</label>}
            <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={handleChange}
                customInput={
                    <CustomInput
                        placeholder="Select date range"
                        value={formatDisplayValue()}
                        onClear={handleClear}
                    />
                }
                monthsShown={2}
                calendarClassName="modern-calendar"
                popperClassName="date-picker-popper"
                popperPlacement="bottom-start"
                fixedHeight
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                closeOnScroll={true}
                // We'll handle clearing manually
                isClearable={false}
                dayClassName={(date) =>
                    date.getDate() === new Date().getDate() &&
                    date.getMonth() === new Date().getMonth() &&
                    date.getFullYear() === new Date().getFullYear()
                        ? "current-day"
                        : undefined
                }
            />
        </div>
    );
}
