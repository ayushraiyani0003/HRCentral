import React, { useState, forwardRef } from "react";
import "./customInputStyles.css";

const CustomTextInput = forwardRef(
    (
        {
            label,
            type = "text",
            placeholder,
            value,
            onChange,
            onClear,
            onlyNumbers = false,
            required = false,
            className = "",
            error = "",
            icon = null,
            ...rest
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);

        // Handle focus state
        const handleFocus = () => setIsFocused(true);
        const handleBlur = () => setIsFocused(false);

        // Handle input change with number validation if needed
        const handleChange = (e) => {
            const newValue = e.target.value;

            // If onlyNumbers is true, validate input to allow only numbers
            if (onlyNumbers) {
                // Allow numbers and decimal point only
                if (/^$|^[0-9]+(\.[0-9]*)?$/.test(newValue)) {
                    onChange(newValue);
                }
            } else {
                onChange(newValue);
            }
        };

        // Clear input handler
        const handleClear = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onClear) {
                onClear();
            } else {
                onChange("");
            }
        };

        // Check if value is not empty to show the clear button
        const showClearButton =
            value !== null && value !== undefined && value !== "";

        return (
            <div className={`custom-input-container ${className}`}>
                {label && (
                    <label className="custom-input-label">
                        {label}
                        {required && <span className="required-mark">*</span>}
                    </label>
                )}

                <div
                    className={`custom-input-wrapper ${
                        isFocused ? "focused" : ""
                    } ${error ? "has-error" : ""}`}
                >
                    <input
                        ref={ref}
                        type={onlyNumbers ? "text" : type}
                        className="custom-input-field"
                        placeholder={placeholder}
                        value={value || ""}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        inputMode={onlyNumbers ? "decimal" : "text"}
                        {...rest}
                    />

                    <div className="custom-input-icons">
                        {showClearButton && (
                            <button
                                type="button"
                                className="clear-input-button"
                                onClick={handleClear}
                                aria-label="Clear input"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="clear-icon"
                                    width="20"
                                    height="20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        )}

                        {icon && <div className="input-icon">{icon}</div>}
                    </div>
                </div>

                {error && <div className="input-error-message">{error}</div>}
            </div>
        );
    }
);

export default CustomTextInput;
