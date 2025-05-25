import React, { useState, useRef, useEffect } from "react";

function MultiEmailInput({
    label,
    placeholder,
    value = "",
    onChange,
    required = false,
    disabled = false,
    className = "",
}) {
    const [emails, setEmails] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [errors, setErrors] = useState([]);
    const inputRef = useRef(null);

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Initialize emails from value prop
    useEffect(() => {
        if (value && typeof value === "string") {
            const emailList = value
                .split(",")
                .map((email) => email.trim())
                .filter((email) => email.length > 0);
            setEmails(emailList);
        }
    }, []);

    // Update parent component when emails change
    useEffect(() => {
        const emailString = emails.join(", ");
        if (onChange) {
            onChange(emailString);
        }
    }, [emails, onChange]);

    // Validate email format
    const isValidEmail = (email) => {
        return emailRegex.test(email.trim());
    };

    // Add email to the list
    const addEmail = (email) => {
        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedEmail) return;

        if (!isValidEmail(trimmedEmail)) {
            setErrors([...errors, `Invalid email: ${trimmedEmail}`]);
            setTimeout(() => {
                setErrors((prev) =>
                    prev.filter(
                        (err) => err !== `Invalid email: ${trimmedEmail}`
                    )
                );
            }, 3000);
            return;
        }

        if (emails.includes(trimmedEmail)) {
            setErrors([...errors, `Duplicate email: ${trimmedEmail}`]);
            setTimeout(() => {
                setErrors((prev) =>
                    prev.filter(
                        (err) => err !== `Duplicate email: ${trimmedEmail}`
                    )
                );
            }, 3000);
            return;
        }

        setEmails([...emails, trimmedEmail]);
        setInputValue("");
    };

    // Remove email from the list
    const removeEmail = (index) => {
        const newEmails = emails.filter((_, i) => i !== index);
        setEmails(newEmails);
        setFocusedIndex(-1);
    };

    // Handle input key events
    const handleKeyDown = (e) => {
        const value = inputValue.trim();

        switch (e.key) {
            case "Enter":
            case ",":
            case ";":
            case " ":
                e.preventDefault();
                if (value) {
                    addEmail(value);
                }
                break;

            case "Backspace":
                if (!value && emails.length > 0) {
                    if (focusedIndex >= 0) {
                        removeEmail(focusedIndex);
                        setFocusedIndex(-1);
                    } else {
                        setFocusedIndex(emails.length - 1);
                    }
                }
                break;

            case "ArrowLeft":
                if (!value && focusedIndex > 0) {
                    setFocusedIndex(focusedIndex - 1);
                } else if (!value && focusedIndex === -1 && emails.length > 0) {
                    setFocusedIndex(emails.length - 1);
                }
                break;

            case "ArrowRight":
                if (focusedIndex >= 0 && focusedIndex < emails.length - 1) {
                    setFocusedIndex(focusedIndex + 1);
                } else if (focusedIndex === emails.length - 1) {
                    setFocusedIndex(-1);
                }
                break;

            case "Delete":
                if (focusedIndex >= 0) {
                    removeEmail(focusedIndex);
                    setFocusedIndex(-1);
                }
                break;
        }
    };

    // Handle input blur (when user clicks away)
    const handleBlur = () => {
        const value = inputValue.trim();
        if (value) {
            addEmail(value);
        }
        setFocusedIndex(-1);
    };

    // Handle paste event
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text");
        const pastedEmails = pastedText
            .split(/[,;\s\n]+/)
            .map((email) => email.trim())
            .filter((email) => email.length > 0);

        pastedEmails.forEach((email) => {
            addEmail(email);
        });
    };

    // Clear all emails
    const clearAll = () => {
        setEmails([]);
        setInputValue("");
        setFocusedIndex(-1);
        setErrors([]);
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {/* Label */}
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Input Container */}
            <div
                className={`
                min-h-[42px] w-full px-3 py-2 border border-gray-300 rounded-lg 
                focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
                ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
                transition-colors duration-200
            `}
            >
                <div className="flex flex-wrap gap-1 items-center">
                    {/* Email Chips */}
                    {emails.map((email, index) => (
                        <div
                            key={index}
                            className={`
                                inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm
                                ${
                                    focusedIndex === index
                                        ? "bg-blue-100 border-2 border-blue-400"
                                        : "bg-blue-50 border border-blue-200"
                                }
                                ${disabled ? "opacity-50" : ""}
                            `}
                        >
                            <span className="text-blue-800">{email}</span>
                            {!disabled && (
                                <button
                                    onClick={() => removeEmail(index)}
                                    className="text-blue-600 hover:text-red-600 ml-1 text-xs font-bold"
                                    title="Remove email"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}

                    {/* Input Field */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        onPaste={handlePaste}
                        placeholder={emails.length === 0 ? placeholder : ""}
                        disabled={disabled}
                        className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
                    />
                </div>
            </div>

            {/* Helper Text and Actions */}
            <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-4">
                    <span>Press Enter, comma, or space to add email</span>
                    {emails.length > 0 && (
                        <span className="text-blue-600">
                            {emails.length} email
                            {emails.length !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>
                {emails.length > 0 && !disabled && (
                    <button
                        onClick={clearAll}
                        className="text-red-500 hover:text-red-700 underline"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Error Messages */}
            {errors.length > 0 && (
                <div className="space-y-1">
                    {errors.map((error, index) => (
                        <div
                            key={index}
                            className="text-xs text-red-600 flex items-center gap-1"
                        >
                            <span>⚠️</span>
                            {error}
                        </div>
                    ))}
                </div>
            )}

            {/* Email Count and Validation Summary */}
            {emails.length > 0 && (
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border">
                    <div className="font-medium mb-1">Email Summary:</div>
                    <div className="break-all">{emails.join(", ")}</div>
                </div>
            )}
        </div>
    );
}

export default MultiEmailInput;
