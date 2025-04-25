import React, { useState, forwardRef, useEffect } from "react";
import "./customInputStyles.css";
import {
    PasswordIcon,
    PasswordHideIcon,
    SearchIcon,
    ClearIcon,
} from "../../utils/SvgIcon";

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
            autoComplete,
            maxLength,
            minLength,
            pattern,
            readOnly = false,
            disabled = false,
            helperText = "",
            ...rest
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [inputType, setInputType] = useState(type);
        const [passwordVisible, setPasswordVisible] = useState(false);
        const [validationState, setValidationState] = useState({
            isValid: true,
            message: "",
        });

        // Set initial input type
        useEffect(() => {
            setInputType(type);
        }, [type]);

        // Handle focus state
        const handleFocus = () => setIsFocused(true);
        const handleBlur = (e) => {
            setIsFocused(false);
            validateInput(e.target.value);
        };

        // Input validation
        const validateInput = (value) => {
            if (required && (!value || value.trim() === "")) {
                setValidationState({
                    isValid: false,
                    message: "This field is required",
                });
                return false;
            }

            if (minLength && value && value.length < minLength) {
                setValidationState({
                    isValid: false,
                    message: `Minimum ${minLength} characters required`,
                });
                return false;
            }

            if (maxLength && value && value.length > maxLength) {
                setValidationState({
                    isValid: false,
                    message: `Maximum ${maxLength} characters allowed`,
                });
                return false;
            }

            if (pattern && value && !new RegExp(pattern).test(value)) {
                setValidationState({
                    isValid: false,
                    message: "Invalid format",
                });
                return false;
            }

            if (
                type === "email" &&
                value &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ) {
                setValidationState({
                    isValid: false,
                    message: "Invalid email address",
                });
                return false;
            }

            if (
                type === "url" &&
                value &&
                !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
                    value
                )
            ) {
                setValidationState({
                    isValid: false,
                    message: "Invalid URL",
                });
                return false;
            }

            setValidationState({ isValid: true, message: "" });
            return true;
        };

        // Handle input change with appropriate validation
        const handleChange = (e) => {
            const newValue = e.target.value;

            // Different validation based on input type
            if (onlyNumbers) {
                // Allow numbers and decimal point only
                if (/^$|^[0-9]+(\.[0-9]*)?$/.test(newValue)) {
                    onChange(newValue);
                }
            } else if (type === "tel") {
                // Allow only numbers, spaces, dashes, and plus sign for phone numbers
                if (/^$|^[0-9\s\-+()]*$/.test(newValue)) {
                    onChange(newValue);
                }
            } else {
                onChange(newValue);
            }
        };

        // Toggle password visibility
        const togglePasswordVisibility = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setPasswordVisible(!passwordVisible);
            setInputType(passwordVisible ? "password" : "text");
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
            // Focus back on input after clearing
            if (ref && ref.current) {
                ref.current.focus();
            }
        };

        // Format specific inputs (e.g., credit card)
        const formatValue = (rawValue) => {
            if (!rawValue) return "";

            // Format credit card numbers with spaces every 4 digits
            if (type === "creditcard") {
                return rawValue
                    .replace(/\s/g, "")
                    .replace(/(.{4})/g, "$1 ")
                    .trim();
            }

            return rawValue;
        };

        // Get appropriate input mode based on type
        const getInputMode = () => {
            if (onlyNumbers || type === "number") return "decimal";
            if (type === "tel") return "tel";
            if (type === "email") return "email";
            if (type === "url") return "url";
            return "text";
        };

        // Check if value is not empty to show the clear button
        const showClearButton =
            !disabled &&
            !readOnly &&
            value !== null &&
            value !== undefined &&
            value !== "";

        // Determine if we should show password toggle
        const showPasswordToggle =
            type === "password" && !disabled && !readOnly;

        return (
            <div className={`custom-input-container ${className}`}>
                {label && (
                    <label
                        className={`custom-input-label ${
                            disabled ? "disabled-label" : ""
                        }`}
                    >
                        {label}
                        {required && <span className="required-mark">*</span>}
                    </label>
                )}

                <div
                    className={`custom-input-wrapper ${
                        isFocused ? "focused" : ""
                    } ${error || !validationState.isValid ? "has-error" : ""} ${
                        disabled ? "disabled" : ""
                    } ${readOnly ? "readonly" : ""}`}
                >
                    {type === "search" && (
                        <div className="search-icon">
                            <SearchIcon />
                        </div>
                    )}

                    <input
                        ref={ref}
                        type={inputType}
                        className={`custom-input-field ${
                            type === "search" ? "with-search-icon" : ""
                        }`}
                        placeholder={placeholder}
                        value={formatValue(value || "")}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        inputMode={getInputMode()}
                        autoComplete={autoComplete}
                        maxLength={maxLength}
                        minLength={minLength}
                        pattern={pattern}
                        disabled={disabled}
                        readOnly={readOnly}
                        aria-invalid={
                            !validationState.isValid || Boolean(error)
                        }
                        aria-describedby={
                            !validationState.isValid || helperText
                                ? `${rest.id || ""}-helper-text`
                                : undefined
                        }
                        {...rest}
                    />

                    <div className="custom-input-icons">
                        {showClearButton && (
                            <button
                                type="button"
                                className="icon-button clear-input-button"
                                onClick={handleClear}
                                aria-label="Clear input"
                                tabIndex="-1"
                            >
                                <ClearIcon />
                            </button>
                        )}

                        {showPasswordToggle && (
                            <button
                                type="button"
                                className="icon-button toggle-password-button"
                                onClick={togglePasswordVisibility}
                                aria-label={
                                    passwordVisible
                                        ? "Hide password"
                                        : "Show password"
                                }
                                tabIndex="-1"
                            >
                                {passwordVisible ? (
                                    <PasswordIcon />
                                ) : (
                                    <PasswordHideIcon />
                                )}
                            </button>
                        )}

                        {icon && <div className="input-icon">{icon}</div>}
                    </div>
                </div>

                {(error || !validationState.isValid || helperText) && (
                    <div
                        id={`${rest.id || ""}-helper-text`}
                        className={`input-message ${
                            error || !validationState.isValid
                                ? "input-error-message"
                                : "input-helper-text"
                        }`}
                    >
                        {error || validationState.message || helperText}
                    </div>
                )}
            </div>
        );
    }
);

// Display name for debugging
CustomTextInput.displayName = "CustomTextInput";

export default CustomTextInput;

// usage:
// import React, { useState } from "react";
// import CustomTextInput from "./components/CustomTextInput/CustomTextInput";
// import { EmailIcon } from "./utils/SvgIcon";
// import "./App.css";

// const InputExamples = () => {
//     // State for various input types
//     const [textValue, setTextValue] = useState("");
//     const [passwordValue, setPasswordValue] = useState("");
//     const [emailValue, setEmailValue] = useState("");
//     const [numberValue, setNumberValue] = useState("");
//     const [searchValue, setSearchValue] = useState("");
//     const [phoneValue, setPhoneValue] = useState("");
//     const [creditCardValue, setCreditCardValue] = useState("");
//     const [urlValue, setUrlValue] = useState("");

//     // Function to create custom icons

//     return (
//         <div className="input-examples w-1/4 m-auto">
//             <h2>Input Field Examples</h2>

//             {/* Basic Text Input */}
//             <CustomTextInput
//                 label="Text Input"
//                 placeholder="Enter some text"
//                 value={textValue}
//                 onChange={setTextValue}
//                 required
//                 helperText="This is a standard text input field"
//             />

//             {/* Password Input with Toggle */}
//             <CustomTextInput
//                 label="Password"
//                 type="password"
//                 placeholder="Enter your password"
//                 value={passwordValue}
//                 onChange={setPasswordValue}
//                 helperText="Your password is secure"
//                 required
//             />

//             {/* Email Input */}
//             <CustomTextInput
//                 label="Email Address"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={emailValue}
//                 onChange={setEmailValue}
//                 icon={<EmailIcon />}
//                 autoComplete="email"
//                 required
//             />

//             {/* Number Input */}
//             <CustomTextInput
//                 label="Amount"
//                 onlyNumbers
//                 placeholder="Enter amount"
//                 value={numberValue}
//                 onChange={setNumberValue}
//                 required
//                 icon={<span>$</span>}
//             />

//             {/* Search Input */}
//             <CustomTextInput
//                 label="Search"
//                 type="search"
//                 placeholder="Search..."
//                 value={searchValue}
//                 onChange={setSearchValue}
//             />

//             {/* Phone Input */}
//             <CustomTextInput
//                 label="Phone Number"
//                 type="tel"
//                 placeholder="(123) 456-7890"
//                 value={phoneValue}
//                 onChange={setPhoneValue}
//                 autoComplete="tel"
//             />

//             {/* Credit Card Input */}
//             <CustomTextInput
//                 label="Credit Card Number"
//                 type="creditcard"
//                 placeholder="1234 5678 9012 3456"
//                 value={creditCardValue}
//                 onChange={setCreditCardValue}
//                 maxLength={19} // 16 digits + 3 spaces
//             />

//             {/* URL Input */}
//             <CustomTextInput
//                 label="Website URL"
//                 type="url"
//                 placeholder="https://example.com"
//                 value={urlValue}
//                 onChange={setUrlValue}
//             />

//             {/* Disabled Input */}
//             <CustomTextInput
//                 label="Disabled Input"
//                 value="This input is disabled"
//                 onChange={() => {}}
//                 disabled
//             />

//             {/* Read-only Input */}
//             <CustomTextInput
//                 label="Read-only Input"
//                 value="This input is read-only"
//                 onChange={() => {}}
//                 readOnly
//             />

//             {/* Input with Error */}
//             <CustomTextInput
//                 label="Input with Error"
//                 value="Invalid value"
//                 onChange={() => {}}
//                 error="This value is not valid"
//             />
//         </div>
//     );
// };

// export default InputExamples;
