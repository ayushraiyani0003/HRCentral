import React, { useState, forwardRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ModernDateRangePicker.css"; // Custom CSS file

// Custom input component for the date picker with fixed icon layout
const CustomInput = forwardRef(
    (
        { value, onClick, placeholder, onClear, disabled, className, required },
        ref
    ) => (
        <div
            className={`date-input-wrapper ${className || ""} ${
                required ? "required" : ""
            }`}
        >
            <div
                className="date-input"
                onClick={onClick}
                ref={ref}
                tabIndex={disabled ? -1 : 0}
                role="button"
                aria-disabled={disabled}
            >
                <span className="date-value">
                    {value || placeholder || "Select dates"}
                </span>
                <div className="date-input-icons">
                    {value && (
                        <div
                            role="button"
                            tabIndex={disabled ? -1 : 0}
                            className="clear-date-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClear();
                            }}
                            aria-label="Clear date selection"
                            aria-disabled={disabled}
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
                        </div>
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
            </div>
        </div>
    )
);

// in this initialStartDate date need in Date objects
export default function ModernDateRangePicker({
    label,
    onChange,
    initialStartDate,
    initialEndDate,
    initialDates,
    isDisabled = false,
    placeholder = "Select dates",
    dateFormat = "MMM d, yyyy",
    showMonthYearDropdowns = true,
    monthsShown = 1,
    selectionMode = "range", // 'range', 'single', or 'multiple'
    isSingle = false, // true for single date selection / false for multi date
    className = "",
    inputClassName = "",
    calendarClassName = "",
    labelClassName = "",
    popperClassName = "",
    dayClassName,
    highlightDates,
    minDate,
    maxDate,
    excludeDates,
    includeDates,
    filterDate,
    showWeekNumbers = false,
    inline = false,
    fixedHeight = true,
    shouldCloseOnSelect = true,
    placeholderText,
    popperPlacement = "bottom-start",
    showTimeSelect = false,
    timeFormat = "h:mm aa",
    timeIntervals = 30,
    weekLabel = "Wk",
    customDateFormat,
    isRequired = false,
}) {
    // Initialize based on selection mode and isSingle override
    const [selectedDate, setSelectedDate] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [multipleDates, setMultipleDates] = useState([]);

    // Determine the effective selection mode based on isSingle prop
    const effectiveSelectionMode = isSingle ? "single" : selectionMode;

    // Initialize date values based on props and selection mode
    useEffect(() => {
        if (
            effectiveSelectionMode === "range" &&
            (initialStartDate || initialEndDate)
        ) {
            setDateRange([initialStartDate || null, initialEndDate || null]);
        } else if (effectiveSelectionMode === "single" && initialStartDate) {
            setSelectedDate(initialStartDate);
        } else if (effectiveSelectionMode === "multiple" && initialDates) {
            setMultipleDates(initialDates);
        }
    }, [
        initialStartDate,
        initialEndDate,
        initialDates,
        effectiveSelectionMode,
    ]);

    // Handle date changes based on selection mode
    const handleChange = (update) => {
        if (effectiveSelectionMode === "range") {
            setDateRange(update);
            if (onChange) onChange(update);
        } else if (effectiveSelectionMode === "single") {
            setSelectedDate(update);
            if (onChange) onChange(update);
        } else if (effectiveSelectionMode === "multiple") {
            setMultipleDates(update);
            if (onChange) onChange(update);
        }
    };

    // Clear date handler
    const handleClear = () => {
        if (effectiveSelectionMode === "range") {
            setDateRange([null, null]);
            if (onChange) onChange([null, null]);
        } else if (effectiveSelectionMode === "single") {
            setSelectedDate(null);
            if (onChange) onChange(null);
        } else if (effectiveSelectionMode === "multiple") {
            setMultipleDates([]);
            if (onChange) onChange([]);
        }
    };

    // Format the display value based on selection mode
    const formatDisplayValue = () => {
        const formatDate = (date) => {
            if (!date) return "";

            if (customDateFormat) {
                return customDateFormat(date);
            }

            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        };

        if (effectiveSelectionMode === "range") {
            const [startDate, endDate] = dateRange;
            if (!startDate) return "";
            if (!endDate) return formatDate(startDate);
            return `${formatDate(startDate)} - ${formatDate(endDate)}`;
        } else if (effectiveSelectionMode === "single") {
            return selectedDate ? formatDate(selectedDate) : "";
        } else if (effectiveSelectionMode === "multiple") {
            if (!multipleDates.length) return "";
            if (multipleDates.length === 1) return formatDate(multipleDates[0]);
            return `${formatDate(multipleDates[0])} (+${
                multipleDates.length - 1
            } more)`;
        }
        return "";
    };

    // Custom day class name function that combines the provided function with highlighting current day
    const getCustomDayClassName = (date) => {
        const isCurrentDay =
            date.getDate() === new Date().getDate() &&
            date.getMonth() === new Date().getMonth() &&
            date.getFullYear() === new Date().getFullYear();

        let customClass = isCurrentDay ? "current-day" : "";

        if (dayClassName) {
            const additionalClass = dayClassName(date);
            if (additionalClass) {
                customClass = customClass
                    ? `${customClass} ${additionalClass}`
                    : additionalClass;
            }
        }

        return customClass || undefined;
    };

    // Common DatePicker props
    const commonProps = {
        onChange: handleChange,
        customInput: (
            <CustomInput
                placeholder={placeholderText || placeholder}
                value={formatDisplayValue()}
                onClear={handleClear}
                disabled={isDisabled}
                className={inputClassName}
            />
        ),
        monthsShown: monthsShown,
        calendarClassName: `modern-calendar ${calendarClassName || ""}`,
        popperClassName: `date-picker-popper ${popperClassName || ""}`,
        popperPlacement: popperPlacement,
        fixedHeight: fixedHeight,
        showMonthDropdown: showMonthYearDropdowns,
        showYearDropdown: showMonthYearDropdowns,
        dropdownMode: "select",
        closeOnScroll: true,
        isClearable: false,
        disabled: isDisabled,
        dayClassName: getCustomDayClassName,
        highlightDates: highlightDates,
        minDate: minDate,
        maxDate: maxDate,
        excludeDates: excludeDates,
        includeDates: includeDates,
        filterDate: filterDate,
        showWeekNumbers: showWeekNumbers,
        inline: inline,
        shouldCloseOnSelect: shouldCloseOnSelect,
        dateFormat: dateFormat,
        showTimeSelect: showTimeSelect,
        timeFormat: timeFormat,
        timeIntervals: timeIntervals,
        weekLabel: weekLabel,
    };

    // Selection mode specific props
    const selectionProps = {
        range: {
            selectsRange: true,
            startDate: dateRange[0],
            endDate: dateRange[1],
        },
        single: {
            selected: selectedDate,
        },
        multiple: {
            selected: multipleDates,
            selectsMultiple: true,
        },
    };

    return (
        <div className={`date-picker-container ${className}`}>
            {label && (
                <label className={`date-picker-label ${labelClassName}`}>
                    {label}
                    {isRequired && <span className="required-mark">*</span>}
                </label>
            )}
            <DatePicker
                {...commonProps}
                {...selectionProps[effectiveSelectionMode]}
                required={isRequired}
                aria-required={isRequired}
            />
        </div>
    );
}
