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
    isSearchable= true,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOptions, setSelectedOptions] = useState(
        Array.isArray(value) ? value : [value].filter(Boolean)
    );
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    // Update internal state when prop value changes
    useEffect(() => {
        if (mode === "single") {
            setSelectedOptions(value ? [value] : []);
        } else {
            setSelectedOptions(Array.isArray(value) ? value : []);
        }
    }, [value, mode]);

    // Handle dropdown toggle
    const toggleDropdown = () => {
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

    // Handle input change for search
    const handleInputChange = (e) => {
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

    // Filter options based on search term
    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle option selection
    const handleOptionSelect = (option) => {
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

    return (
        <div
            className={`custom-dropdown-container ${className}`}
            ref={dropdownRef}
        >
            {label && (
                <label className="custom-dropdown-label">
                    {label}
                    {required && <span className="required-mark">*</span>}
                </label>
            )}

            <div
                className={`custom-dropdown-wrapper ${
                    isOpen ? "focused" : ""
                } ${error ? "has-error" : ""}`}
                onClick={toggleDropdown}
            >
                <div className="custom-dropdown-selection">
                    {/* Display tags for multiple/tags mode */}
                    {(mode === "multiple" || mode === "tags") &&
                        getSelectedOptionObjects()
                            .slice(0, maxTagCount)
                            .map((option) => (
                                <span
                                    key={option.value}
                                    className="dropdown-tag"
                                >
                                    {option.label}
                                    <button
                                        type="button"
                                        className="dropdown-tag-remove"
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
                                </span>
                            ))}

                    {/* Display if more tags than maxTagCount */}
                    {selectedOptions.length > maxTagCount &&
                        mode !== "single" && (
                            <span className="dropdown-tag dropdown-more-tag">
                                +{selectedOptions.length - maxTagCount} more
                            </span>
                        )}

                    {/* Display text for single selection or no selection */}
                    <span className="dropdown-display-text">
                        {getDisplayText() || placeholder}
                    </span>
                </div>

                <div className="custom-dropdown-icons">
                    {selectedOptions.length > 0 && (
                        <button
                            type="button"
                            className="clear-dropdown-button"
                            onClick={handleClear}
                            aria-label="Clear selection"
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

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`dropdown-icon ${
                            isOpen ? "dropdown-icon-open" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        width="20"
                        height="20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="custom-dropdown-menu">
                    { isSearchable &&
                    <div className="dropdown-search-container">
                        <input
                            ref={inputRef}
                            type="text"
                            className="dropdown-search-input"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleInputChange}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
}
                    <div className="dropdown-options-list">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={`dropdown-option ${
                                        selectedOptions.includes(option.value)
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() => handleOptionSelect(option)}
                                >
                                    {selectedOptions.includes(option.value) && (
                                        <svg
                                            className="check-icon"
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
                                    <span className="option-label">
                                        {option.label}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="dropdown-no-options">
                                {mode === "tags"
                                    ? "Type to add a new tag"
                                    : "No options found"}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && <div className="dropdown-error-message">{error}</div>}
        </div>
    );
};

export default CustomDropdown;
