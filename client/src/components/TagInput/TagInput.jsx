import React, { useState, useRef, useEffect } from "react";
import "./tagInputStyles.css";

// Usage:

// const TagInputDemo = () => {
//     const [selectedTags, setSelectedTags] = useState([]);
//     const [skillTags, setSkillTags] = useState(["JavaScript", "React"]);
//     const [categoryTags, setCategoryTags] = useState([]);
//     const [tagError, setTagError] = useState("");

//     // Available suggestions
//     const skillSuggestions = [
//         "JavaScript",
//         "TypeScript",
//         "React",
//         "Vue",
//         "Angular",
//         "Node.js",
//         "Python",
//         "Java",
//         "C#",
//         "Ruby",
//         "PHP",
//         "HTML",
//         "CSS",
//         "Sass",
//         "Less",
//         "GraphQL",
//         "REST API",
//         "MongoDB",
//         "MySQL",
//         "PostgreSQL",
//         "Redis",
//         "AWS",
//         "Azure",
//         "Docker",
//         "Kubernetes",
//         "Git",
//         "WebSockets",
//         "Express",
//     ];

//     const categorySuggestions = [
//         "Frontend",
//         "Backend",
//         "DevOps",
//         "Mobile",
//         "Database",
//         "UI/UX",
//         "Security",
//         "Testing",
//         "Machine Learning",
//         "Data Science",
//         "Cloud",
//         "Blockchain",
//         "Game Development",
//         "IoT",
//         "AR/VR",
//     ];

//     // Custom color mapping
//     const categoryColorMapping = {
//         Frontend: "blue",
//         Backend: "green",
//         DevOps: "purple",
//         Mobile: "yellow",
//         Database: "red",
//         Security: "red",
//         Testing: "green",
//         Cloud: "blue",
//     };

//     // Tag validation
//     const validateTag = (tag) => {
//         if (tag.length < 2) {
//             setTagError("Tags must be at least 2 characters long");
//             return false;
//         }
//         setTagError("");
//         return true;
//     };

//     // Handle tag changes
//     const handleTagsChange = (newTags) => {
//         setSelectedTags(newTags);
//     };

//     // Handle skill tags changes
//     const handleSkillTagsChange = (newTags) => {
//         setSkillTags(newTags);
//     };

//     // Handle category tags changes
//     const handleCategoryTagsChange = (newTags) => {
//         setCategoryTags(newTags);
//     };

//     // Section styling
//     const sectionStyle = {
//         marginBottom: "2rem",
//     };

//     const sectionTitleStyle = {
//         fontSize: "1rem",
//         fontWeight: "600",
//         color: "#4b5563",
//         marginBottom: "1rem",
//     };

//     return (
//         <div
//             style={{
//                 padding: "2rem",
//                 maxWidth: "600px",
//                 backgroundColor: "white",
//                 borderRadius: "0.5rem",
//                 boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//             }}
//         >
//             <h2
//                 style={{
//                     marginBottom: "1.5rem",
//                     fontSize: "1.5rem",
//                     fontWeight: "600",
//                     color: "#374151",
//                 }}
//             >
//                 Tag Input Component
//             </h2>

//             {/* Basic Tag Input */}
//             <div style={sectionStyle}>
//                 <h3 style={sectionTitleStyle}>Basic Example</h3>
//                 <TagInput
//                     label="Tags"
//                     placeholder="Click to add or select tags..."
//                     value={selectedTags}
//                     onChange={handleTagsChange}
//                     suggestions={skillSuggestions}
//                     validateTag={validateTag}
//                     error={tagError}
//                     allowCustomTags={true}
//                 />

//                 <div
//                     style={{
//                         fontSize: "0.875rem",
//                         color: "#6b7280",
//                         marginTop: "0.5rem",
//                     }}
//                 >
//                     Click to open dropdown. Type to add custom tags or select
//                     from suggestions. Press Enter, Tab, or comma to add a tag.
//                 </div>
//             </div>

//             {/* Skills Tag Input */}
//             <div style={sectionStyle}>
//                 <h3 style={sectionTitleStyle}>Skills with Max Limit</h3>
//                 <TagInput
//                     label="Skills"
//                     placeholder="Click to select skills..."
//                     value={skillTags}
//                     onChange={handleSkillTagsChange}
//                     suggestions={skillSuggestions}
//                     maxTags={5}
//                     required={true}
//                 />

//                 <div
//                     style={{
//                         fontSize: "0.875rem",
//                         color: "#6b7280",
//                         marginTop: "0.5rem",
//                     }}
//                 >
//                     Limited to 5 tags. You've selected: {skillTags.length} / 5
//                 </div>
//             </div>

//             {/* Categories with Custom Colors */}
//             <div style={sectionStyle}>
//                 <h3 style={sectionTitleStyle}>Categories with Custom Colors</h3>
//                 <TagInput
//                     label="Categories"
//                     placeholder="Click to select categories..."
//                     value={categoryTags}
//                     onChange={handleCategoryTagsChange}
//                     suggestions={categorySuggestions}
//                     colorMapping={categoryColorMapping}
//                     allowCustomTags={false}
//                 />

//                 <div
//                     style={{
//                         fontSize: "0.875rem",
//                         color: "#6b7280",
//                         marginTop: "0.5rem",
//                     }}
//                 >
//                     Only predefined categories can be selected. Custom colors
//                     are applied to specific tags.
//                 </div>
//             </div>

//             {/* Disabled Example */}
//             <div style={sectionStyle}>
//                 <h3 style={sectionTitleStyle}>Disabled State</h3>
//                 <TagInput
//                     label="Readonly Tags"
//                     placeholder="You cannot modify these tags"
//                     value={["Readonly", "Disabled", "Cannot Modify"]}
//                     onChange={() => {}}
//                     disabled={true}
//                 />
//             </div>
//         </div>
//     );
// };

const TagInput = ({
    label,
    placeholder = "Add tags...",
    value = [],
    onChange,
    onBlur,
    suggestions = [],
    maxTags = null,
    required = false,
    disabled = false,
    error = "",
    validateTag = () => true,
    allowCustomTags = true,
    colorMapping = {}, // Map tag values to specific color classes
    className = "",
    suggestionsFilter = (query, suggestions) => {
        const lowerQuery = query.toLowerCase();
        return suggestions.filter(
            (item) =>
                !value.includes(item) && item.toLowerCase().includes(lowerQuery)
        );
    },
    ...rest
}) => {
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    const containerRef = useRef(null);

    // Update filtered suggestions when input changes or when clicked
    useEffect(() => {
        if (isOpen) {
            if (inputValue.trim()) {
                const filtered = suggestionsFilter(inputValue, suggestions);
                setFilteredSuggestions(filtered);
            } else {
                const filtered = suggestions.filter(
                    (item) => !value.includes(item)
                );
                setFilteredSuggestions(filtered);
            }
            setActiveIndex(-1);
        }
    }, [inputValue, value, suggestions, suggestionsFilter, isOpen]);

    // Check if max tags limit is reached
    const isMaxTagsReached = maxTags !== null && value.length >= maxTags;

    // Handle input change
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    // Add a tag when Enter is pressed or from suggestions
    const addTag = (tagValue) => {
        const trimmedTag = tagValue.trim();

        if (!trimmedTag || (maxTags !== null && value.length >= maxTags)) {
            return false;
        }

        // Check if tag already exists
        if (value.includes(trimmedTag)) {
            return false;
        }

        // Validate tag
        if (!validateTag(trimmedTag)) {
            return false;
        }

        // Add the tag
        onChange([...value, trimmedTag]);
        setInputValue("");
        return true;
    };

    // Remove a tag
    const removeTag = (tagToRemove, event) => {
        event.stopPropagation();
        onChange(value.filter((tag) => tag !== tagToRemove));
        inputRef.current?.focus();
    };

    // Handle keyboard navigation in suggestions
    const handleKeyDown = (e) => {
        // Enter key - add tag from input or select suggestion
        if (e.key === "Enter") {
            e.preventDefault();

            if (activeIndex >= 0 && activeIndex < filteredSuggestions.length) {
                // Select active suggestion
                addTag(filteredSuggestions[activeIndex]);
            } else if (allowCustomTags && inputValue.trim()) {
                // Add custom tag from input
                addTag(inputValue);
            }
        }
        // Comma key - add tag
        else if (e.key === "," && allowCustomTags) {
            e.preventDefault();
            if (inputValue.trim()) {
                addTag(inputValue);
            }
        }
        // Backspace key - remove last tag if input is empty
        else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            onChange(value.slice(0, -1));
        }
        // Escape key - close dropdown
        else if (e.key === "Escape") {
            setIsOpen(false);
            inputRef.current?.blur();
        }
        // Arrow down - navigate down in suggestions
        else if (e.key === "ArrowDown" && isOpen) {
            e.preventDefault();
            setActiveIndex((prevIndex) =>
                prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : 0
            );
        }
        // Arrow up - navigate up in suggestions
        else if (e.key === "ArrowUp" && isOpen) {
            e.preventDefault();
            setActiveIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : filteredSuggestions.length - 1
            );
        }
    };

    // Handle clicks outside to close dropdown
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setIsOpen(false);

                if (onBlur) {
                    onBlur();
                }
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [onBlur]);

    // Scroll active suggestion into view
    useEffect(() => {
        if (dropdownRef.current && activeIndex >= 0) {
            const activeElement = dropdownRef.current.children[activeIndex];
            if (activeElement) {
                activeElement.scrollIntoView({
                    block: "nearest",
                    behavior: "smooth",
                });
            }
        }
    }, [activeIndex]);

    // Handle input focus - do NOT open dropdown automatically
    const handleFocus = () => {
        // Only set focused state but don't open dropdown
    };

    // Handle container click - focus input and toggle dropdown
    const handleContainerClick = () => {
        if (!disabled) {
            inputRef.current?.focus();
            toggleDropdown();
        }
    };

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    // Get tag color class
    const getTagColorClass = (tag) => {
        if (colorMapping[tag]) {
            return `tag-${colorMapping[tag]}`;
        }
        // Default colors based on tag text
        const hashCode = tag.split("").reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        const index = Math.abs(hashCode) % 5; // 5 default colors
        return `tag-color-${index}`;
    };

    return (
        <div className={`tag-input-container ${className}`}>
            {label && (
                <label className="tag-input-label">
                    {label}
                    {required && <span className="required-mark">*</span>}
                </label>
            )}

            <div
                ref={containerRef}
                className={`tag-input-wrapper ${isOpen ? "focused" : ""} ${
                    error ? "has-error" : ""
                } ${disabled ? "disabled" : ""}`}
                onClick={handleContainerClick}
            >
                <div className="tag-input-tags">
                    {value.map((tag) => (
                        <span
                            key={tag}
                            className={`tag-item ${getTagColorClass(tag)}`}
                        >
                            {tag}
                            {!disabled && (
                                <button
                                    type="button"
                                    className="tag-remove"
                                    onClick={(e) => removeTag(tag, e)}
                                    aria-label={`Remove ${tag}`}
                                >
                                    ×
                                </button>
                            )}
                        </span>
                    ))}

                    {!isMaxTagsReached && (
                        <input
                            ref={inputRef}
                            type="text"
                            className="tag-input-field"
                            value={inputValue}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onKeyDown={handleKeyDown}
                            placeholder={value.length === 0 ? placeholder : ""}
                            disabled={disabled}
                            {...rest}
                        />
                    )}

                    {/* Dropdown indicator */}
                    <button
                        type="button"
                        className="tag-dropdown-indicator"
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown();
                        }}
                        disabled={disabled}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`chevron-icon ${isOpen ? "open" : ""}`}
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                </div>

                {isOpen && filteredSuggestions.length > 0 && (
                    <div className="tag-suggestions" ref={dropdownRef}>
                        {filteredSuggestions.map((suggestion, index) => (
                            <div
                                key={suggestion}
                                className={`tag-suggestion-item ${
                                    index === activeIndex ? "active" : ""
                                }`}
                                onClick={() => {
                                    addTag(suggestion);
                                    inputRef.current?.focus();
                                }}
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}

                {isOpen &&
                    inputValue &&
                    allowCustomTags &&
                    filteredSuggestions.length === 0 && (
                        <div className="tag-suggestions">
                            <div
                                className="tag-suggestion-item tag-create-new"
                                onClick={() => {
                                    addTag(inputValue);
                                    inputRef.current?.focus();
                                }}
                            >
                                Create: "{inputValue}"
                            </div>
                        </div>
                    )}
            </div>

            {error && <div className="tag-input-error">{error}</div>}

            {maxTags !== null && (
                <div className="tag-count">
                    {value.length} / {maxTags}
                </div>
            )}
        </div>
    );
};

export default TagInput;
