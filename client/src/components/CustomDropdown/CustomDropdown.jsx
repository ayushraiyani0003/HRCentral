import React, { useState, useRef, useEffect } from "react";
import "./customDropdownStyles.css";

// ex: <div
//                 style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}
//             >
//                 <h2 style={{ marginBottom: "20px" }}>
//                     Custom Dropdown Components
//                 </h2>

//                 {/* Single selection example */}
//                 <div style={{ marginBottom: "30px" }}>
//                     <h3>Single Selection</h3>
//                     <CustomDropdown
//                         label="Select an option"
//                         options={options}
//                         value={singleValue}
//                         onChange={(value) => {
//                             console.log(`Single selected: ${value}`);
//                             setSingleValue(value);
//                         }}
//                         placeholder="Choose one option"
//                         mode="single"
//                         required
//                     />
//                 </div>

//                 {/* Multiple selection example */}
//                 <div style={{ marginBottom: "30px" }}>
//                     <h3>Multiple Selection</h3>
//                     <CustomDropdown
//                         label="Select multiple options"
//                         options={options}
//                         value={multipleValue}
//                         onChange={(values) => {
//                             console.log(
//                                 `Multiple selected: ${values.join(", ")}`
//                             );
//                             setMultipleValue(values);
//                         }}
//                         placeholder="Choose multiple options"
//                         mode="multiple"
//                         maxTagCount={2}
//                     />
//                 </div>

//                 {/* Tags mode example */}
//                 <div style={{ marginBottom: "30px" }}>
//                     <h3>Tags Mode (Create custom options)</h3>
//                     <CustomDropdown
//                         label="Select or create tags"
//                         options={options}
//                         value={tagsValue}
//                         onChange={(values) => {
//                             console.log(`Tags selected: ${values.join(", ")}`);
//                             setTagsValue(values);
//                         }}
//                         placeholder="Type to create or select tags"
//                         mode="tags"
//                         tokenSeparators={[",", " "]}
//                     />
//                     <p
//                         style={{
//                             fontSize: "0.8rem",
//                             color: "#6b7280",
//                             marginTop: "0.5rem",
//                         }}
//                     >
//                         Type and add a comma or space to create a new tag
//                     </p>
//                 </div>

//                 {/* Display the current values for demonstration */}
//                 <div
//                     style={{
//                         marginTop: "20px",
//                         padding: "15px",
//                         backgroundColor: "#f9fafb",
//                         borderRadius: "8px",
//                     }}
//                 >
//                     <h3>Current Values:</h3>
//                     <p>
//                         <strong>Single selection:</strong>{" "}
//                         {singleValue || "(none selected)"}
//                     </p>
//                     <p>
//                         <strong>Multiple selection:</strong>{" "}
//                         {multipleValue.length > 0
//                             ? multipleValue.join(", ")
//                             : "(none selected)"}
//                     </p>
//                     <p>
//                         <strong>Tags:</strong>{" "}
//                         {tagsValue.length > 0
//                             ? tagsValue.join(", ")
//                             : "(none selected)"}
//                     </p>
//                 </div>
//             </div>

const CustomDropdown = ({
    label,
    options = [],
    value = [],
    onChange,
    placeholder = "Select options",
    required = false,
    error = "",
    mode = "single", // single, multiple, tags
    tokenSeparators = [","],
    className = "",
    maxTagCount = 3,
    dropdownPosition, // top, bottom (prop from parent)
    isSearchable = true,
    disabled = false,
    readOnly = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOptions, setSelectedOptions] = useState(
        Array.isArray(value) ? value : [value].filter(Boolean)
    );
    const [calculatedPosition, setCalculatedPosition] = useState("bottom");
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const menuRef = useRef(null);

    // Update internal state when prop value changes
    useEffect(() => {
        if (mode === "single") {
            setSelectedOptions(value ? [value] : []);
        } else {
            setSelectedOptions(Array.isArray(value) ? value : []);
        }
    }, [value, mode]);

    // Filter options based on search term - moved up to fix the issue
    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate dropdown position based on available space (used as fallback)
    const calculateDropdownPosition = () => {
        if (!dropdownRef.current) return "bottom";

        const rect = dropdownRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        // Estimate dropdown menu height (you can adjust this value based on your needs)
        const estimatedMenuHeight = Math.min(
            filteredOptions.length * 40 + 60,
            300
        ); // 40px per option + search input + padding

        // If there's not enough space below but enough space above, position it above
        if (
            spaceBelow < estimatedMenuHeight &&
            spaceAbove > estimatedMenuHeight
        ) {
            return "top";
        }

        return "bottom";
    };

    // Get the final position (prop takes priority over calculation)
    const getFinalPosition = () => {
        if (dropdownPosition) {
            return dropdownPosition; // Use prop if provided
        }
        return calculatedPosition; // Use calculated position as fallback
    };

    // Handle dropdown toggle
    const toggleDropdown = () => {
        // Prevent opening if disabled or readonly
        if (disabled || readOnly) return;

        if (!isOpen && !dropdownPosition) {
            // Only calculate position if prop is not provided and dropdown is opening
            const position = calculateDropdownPosition();
            setCalculatedPosition(position);
        }

        setIsOpen(!isOpen);

        if (!isOpen) {
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 10);
        }
    };

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Recalculate position on window resize or scroll (only if prop is not provided)
    useEffect(() => {
        const handlePositionUpdate = () => {
            if (isOpen && !dropdownPosition) {
                const position = calculateDropdownPosition();
                setCalculatedPosition(position);
            }
        };

        window.addEventListener("resize", handlePositionUpdate);
        window.addEventListener("scroll", handlePositionUpdate, true);

        return () => {
            window.removeEventListener("resize", handlePositionUpdate);
            window.removeEventListener("scroll", handlePositionUpdate, true);
        };
    }, [isOpen, dropdownPosition]);

    // Handle input change for search
    const handleInputChange = (e) => {
        // Prevent input changes if disabled or readonly
        if (disabled || readOnly) return;

        setSearchTerm(e.target.value);

        // Handle tags mode with token separators
        if (mode === "tags" && tokenSeparators.length > 0) {
            const lastChar = e.target.value.slice(-1);
            if (tokenSeparators.includes(lastChar)) {
                const newTag = e.target.value.slice(0, -1).trim();
                if (newTag) {
                    const newOption = { value: newTag, label: newTag };
                    handleOptionSelect(newOption);
                    setSearchTerm("");
                }
            }
        }
    };

    // Handle option selection
    const handleOptionSelect = (option) => {
        // Prevent selection if disabled or readonly
        if (disabled || readOnly) return;

        let newSelectedOptions;

        if (mode === "single") {
            newSelectedOptions = [option.value];
            setIsOpen(false);
        } else {
            // Check if option is already selected
            if (selectedOptions.includes(option.value)) {
                newSelectedOptions = selectedOptions.filter(
                    (item) => item !== option.value
                );
            } else {
                newSelectedOptions = [...selectedOptions, option.value];
            }
        }

        setSelectedOptions(newSelectedOptions);

        // Call the onChange handler with the new selection
        if (mode === "single") {
            onChange(newSelectedOptions[0] || null);
        } else {
            onChange(newSelectedOptions);
        }

        // Clear search term after selection in tags mode
        if (mode === "tags") {
            setSearchTerm("");
        }
    };

    // Handle tag removal
    const handleRemoveTag = (value, e) => {
        e.stopPropagation();

        // Prevent removal if disabled or readonly
        if (disabled || readOnly) return;

        const newSelectedOptions = selectedOptions.filter(
            (item) => item !== value
        );
        setSelectedOptions(newSelectedOptions);
        onChange(
            mode === "single"
                ? newSelectedOptions[0] || null
                : newSelectedOptions
        );
    };

    // Clear all selections
    const handleClear = (e) => {
        e.stopPropagation();

        // Prevent clearing if disabled or readonly
        if (disabled || readOnly) return;

        setSelectedOptions([]);
        onChange(mode === "single" ? null : []);
    };

    // Get display text for the dropdown
    const getDisplayText = () => {
        if (selectedOptions.length === 0) {
            return "";
        }

        // For single mode, just display the selected option
        if (mode === "single") {
            const selectedOption = options.find(
                (option) => option.value === selectedOptions[0]
            );
            return selectedOption ? selectedOption.label : "";
        }

        // For multiple/tags mode with maxTagCount
        if (selectedOptions.length > maxTagCount) {
            return `${selectedOptions.length} items selected`;
        }

        // Default display of tags
        return null;
    };

    // Find matching option objects for selected values
    const getSelectedOptionObjects = () => {
        return selectedOptions.map((value) => {
            const foundOption = options.find(
                (option) => option.value === value
            );
            return foundOption || { value, label: value };
        });
    };

    const finalPosition = getFinalPosition();

    // Determine visual state for styling
    const getVisualState = () => {
        if (disabled) return "disabled";
        if (readOnly) return "readonly";
        if (error) return "error";
        if (isOpen) return "open";
        return "default";
    };

    const visualState = getVisualState();

    // Get border color based on state
    const getBorderColor = () => {
        switch (visualState) {
            case "disabled":
                return "#d1d5db";
            case "readonly":
                return "#e5e7eb";
            case "error":
                return "#ef4444";
            case "open":
                return "#6366f1";
            default:
                return "#e5e7eb";
        }
    };

    // Get background color based on state
    const getBackgroundColor = () => {
        if (disabled) return "#f9fafb";
        if (readOnly) return "#f9fafb";
        return "#fff";
    };

    // Get text color based on state
    const getTextColor = () => {
        if (disabled || readOnly) return "#9ca3af";
        return "#111827";
    };

    // Get cursor style based on state
    const getCursor = () => {
        if (disabled) return "not-allowed";
        if (readOnly) return "default";
        return "pointer";
    };

    return (
        <div
            className={`custom-dropdown-container ${className}`}
            ref={dropdownRef}
            style={{
                fontFamily:
                    '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                marginBottom: "1.5rem",
                position: "relative",
                opacity: disabled ? 0.6 : 1,
            }}
        >
            {label && (
                <label
                    style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: disabled ? "#9ca3af" : "#374151",
                        marginBottom: "0.5rem",
                    }}
                >
                    {label}
                    {required && (
                        <span
                            style={{ color: "#ef4444", marginLeft: "0.25rem" }}
                        >
                            *
                        </span>
                    )}
                    {readOnly && (
                        <span
                            style={{
                                color: "#6b7280",
                                marginLeft: "0.5rem",
                                fontSize: "0.75rem",
                                fontWeight: "400",
                            }}
                        >
                            (Read only)
                        </span>
                    )}
                </label>
            )}

            <div
                style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    minHeight: "2.75rem",
                    padding: "0.75rem 1rem",
                    backgroundColor: getBackgroundColor(),
                    border: `1px solid ${getBorderColor()}`,
                    borderRadius: "0.5rem",
                    transition: "all 0.2s ease",
                    boxShadow: error
                        ? "0 0 0 3px rgba(239, 68, 68, 0.2)"
                        : isOpen && !disabled && !readOnly
                        ? "0 0 0 3px rgba(99, 102, 241, 0.2)"
                        : "0 1px 2px rgba(0, 0, 0, 0.05)",
                    cursor: getCursor(),
                }}
                onClick={toggleDropdown}
            >
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        flex: 1,
                        gap: "0.5rem",
                        minWidth: 0,
                    }}
                >
                    {/* Display tags for multiple/tags mode */}
                    {(mode === "multiple" || mode === "tags") &&
                        getSelectedOptionObjects()
                            .slice(0, maxTagCount)
                            .map((option) => (
                                <span
                                    key={option.value}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        backgroundColor:
                                            disabled || readOnly
                                                ? "#e5e7eb"
                                                : "#f3f4f6",
                                        borderRadius: "0.25rem",
                                        padding: "0.25rem 0.5rem",
                                        fontSize: "0.75rem",
                                        color:
                                            disabled || readOnly
                                                ? "#9ca3af"
                                                : "#4b5563",
                                        maxWidth: "100%",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {option.label}
                                    {!readOnly && !disabled && (
                                        <button
                                            type="button"
                                            style={{
                                                marginLeft: "0.25rem",
                                                border: "none",
                                                background: "transparent",
                                                color: "#9ca3af",
                                                cursor: "pointer",
                                                padding: "0.125rem",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: "50%",
                                            }}
                                            onClick={(e) =>
                                                handleRemoveTag(option.value, e)
                                            }
                                            aria-label={`Remove ${option.label}`}
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                height="14"
                                                width="14"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95 1.414-1.414 4.95 4.95z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </button>
                                    )}
                                </span>
                            ))}

                    {/* Display if more tags than maxTagCount */}
                    {selectedOptions.length > maxTagCount &&
                        mode !== "single" && (
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    backgroundColor:
                                        disabled || readOnly
                                            ? "#e5e7eb"
                                            : "#e5e7eb",
                                    borderRadius: "0.25rem",
                                    padding: "0.25rem 0.5rem",
                                    fontSize: "0.75rem",
                                    color:
                                        disabled || readOnly
                                            ? "#9ca3af"
                                            : "#6b7280",
                                }}
                            >
                                +{selectedOptions.length - maxTagCount} more
                            </span>
                        )}

                    {/* Display text for single selection or no selection */}
                    <span
                        style={{
                            fontSize: "0.875rem",
                            color:
                                selectedOptions.length === 0
                                    ? disabled || readOnly
                                        ? "#d1d5db"
                                        : "#9ca3af"
                                    : getTextColor(),
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                            minWidth: 0,
                        }}
                    >
                        {getDisplayText() || placeholder}
                    </span>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginLeft: "0.5rem",
                    }}
                >
                    {selectedOptions.length > 0 && !readOnly && !disabled && (
                        <button
                            type="button"
                            style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 1,
                            }}
                            onClick={handleClear}
                            aria-label="Clear selection"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                style={{
                                    width: "1.25rem",
                                    height: "1.25rem",
                                    color: "#9ca3af",
                                }}
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
                        style={{
                            width: "1.25rem",
                            height: "1.25rem",
                            color: disabled || readOnly ? "#d1d5db" : "#6366f1",
                            transition: "transform 0.2s ease",
                            transform:
                                isOpen && !disabled && !readOnly
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",
                        }}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            {/* Dropdown menu with prop-based or dynamic positioning */}
            {isOpen && !disabled && !readOnly && (
                <div
                    ref={menuRef}
                    style={{
                        position: "absolute",
                        width: "100%",
                        zIndex: 1000,
                        left: 0,
                        backgroundColor: "white",
                        border: "1px solid #f3f4f6",
                        borderRadius: "0.5rem",
                        boxShadow:
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        maxHeight: "300px",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        ...(finalPosition === "top"
                            ? {
                                  bottom: "100%",
                                  marginBottom: "4px",
                              }
                            : {
                                  top: "100%",
                                  marginTop: "4px",
                              }),
                    }}
                >
                    {isSearchable && (
                        <div
                            style={{
                                padding: "0.75rem",
                                borderBottom: "1px solid #f3f4f6",
                            }}
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                style={{
                                    width: "100%",
                                    padding: "0.5rem 0.75rem",
                                    fontSize: "0.875rem",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "0.375rem",
                                    outline: "none",
                                }}
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={handleInputChange}
                                onClick={(e) => e.stopPropagation()}
                                disabled={disabled || readOnly}
                            />
                        </div>
                    )}
                    <div
                        style={{
                            overflowY: "auto",
                            maxHeight: "220px",
                            padding: "0.5rem 0",
                        }}
                    >
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "0.5rem 1rem",
                                        cursor: "pointer",
                                        fontSize: "0.875rem",
                                        color: selectedOptions.includes(
                                            option.value
                                        )
                                            ? "#4f46e5"
                                            : "#4b5563",
                                        backgroundColor:
                                            selectedOptions.includes(
                                                option.value
                                            )
                                                ? "#f3f4f7"
                                                : "transparent",
                                        transition: "background-color 0.2s",
                                    }}
                                    onClick={() => handleOptionSelect(option)}
                                >
                                    {selectedOptions.includes(option.value) && (
                                        <svg
                                            style={{
                                                marginRight: "0.5rem",
                                                color: "#4f46e5",
                                                flexShrink: 0,
                                            }}
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            width="16"
                                            height="16"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                    <span
                                        style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            flex: 1,
                                        }}
                                    >
                                        {option.label}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div
                                style={{
                                    padding: "1rem",
                                    textAlign: "center",
                                    color: "#9ca3af",
                                    fontSize: "0.875rem",
                                }}
                            >
                                {mode === "tags"
                                    ? "Type to add a new tag"
                                    : "No options found"}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <div
                    style={{
                        marginTop: "0.5rem",
                        color: "#ef4444",
                        fontSize: "0.75rem",
                    }}
                >
                    {error}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
