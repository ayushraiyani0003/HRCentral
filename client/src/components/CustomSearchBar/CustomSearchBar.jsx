import React, { useState, forwardRef, useRef, useEffect } from "react";
import { searchIcon } from "../../utils/SvgIcon";
import "./customSearchBarStyles.css";

// refer this code for implements the search bar
// ex: <div className="w-full max-w-md">
//                 <h2 className="text-2xl font-bold mb-6 text-gray-800">
//                     Custom Search Bar Examples
//                 </h2>

//                 {/* Default search bar */}
//                 <div className="mb-8">
//                     <h3 className="text-lg font-medium mb-3 text-gray-700">
//                         Default Search Bar
//                     </h3>
//                     <CustomSearchBar
//                         placeholder="Search anything..."
//                         value={searchValue}
//                         onChange={setSearchValue}
//                         onSearch={handleSearch}
//                         onClear={handleClear}
//                         loading={isLoading}
//                     />

//                     {/* Display search results */}
//                     {searchResults.length > 0 && (
//                         <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
//                             <h4 className="font-medium mb-2">
//                                 Search Results:
//                             </h4>
//                             <ul className="list-disc pl-5">
//                                 {searchResults.map((result) => (
//                                     <li key={result.id} className="mb-1">
//                                         {result.title}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     )}
//                 </div>

//                 {/* Small, rounded search bar */}
//                 <div className="mb-8">
//                     <h3 className="text-lg font-medium mb-3 text-gray-700">
//                         Small Rounded Search Bar
//                     </h3>
//                     <CustomSearchBar
//                         placeholder="Search..."
//                         size="small"
//                         rounded={true}
//                     />
//                 </div>

//                 {/* Large search bar */}
//                 <div className="mb-8">
//                     <h3 className="text-lg font-medium mb-3 text-gray-700">
//                         Large Search Bar
//                     </h3>
//                     <CustomSearchBar
//                         placeholder="Search for products..."
//                         size="large"
//                     />
//                 </div>

//                 {/* Disabled search bar */}
//                 <div className="mb-8">
//                     <h3 className="text-lg font-medium mb-3 text-gray-700">
//                         Disabled Search Bar
//                     </h3>
//                     <CustomSearchBar
//                         placeholder="Search disabled"
//                         disabled={true}
//                     />
//                 </div>
//             </div>

const CustomSearchBar = forwardRef(
    (
        {
            placeholder = "Search...",
            value = "",
            onChange,
            onSearch,
            onClear,
            className = "",
            disabled = false,
            loading = false,
            allowClear = true,
            size = "medium", // small, medium, large
            rounded = false,
            debounceTime = 300, // Delay for real-time search
            ...rest
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const inputRef = useRef(ref);
        const debounceTimerRef = useRef(null);

        // Handle focus state
        const handleFocus = () => setIsFocused(true);
        const handleBlur = () => setIsFocused(false);

        // Handle input change with debounced search
        const handleChange = (e) => {
            const newValue = e.target.value;

            // Update input value immediately
            if (onChange) {
                onChange(newValue);
            }

            // Debounce the search operation
            if (onSearch) {
                // Clear previous timer
                if (debounceTimerRef.current) {
                    clearTimeout(debounceTimerRef.current);
                }

                // Set new timer for search
                debounceTimerRef.current = setTimeout(() => {
                    if (newValue.trim()) {
                        onSearch(newValue);
                    }
                }, debounceTime);
            }
        };

        // Clean up debounce timer on unmount
        useEffect(() => {
            return () => {
                if (debounceTimerRef.current) {
                    clearTimeout(debounceTimerRef.current);
                }
            };
        }, []);

        // Handle pressing Enter to search immediately
        const handleKeyDown = (e) => {
            if (e.key === "Enter" && onSearch && value.trim()) {
                // Clear any pending debounce timer
                if (debounceTimerRef.current) {
                    clearTimeout(debounceTimerRef.current);
                }

                // Trigger search immediately
                onSearch(value);
            }
        };

        // Clear input handler
        const handleClear = (e) => {
            e.stopPropagation();

            // Clear any pending search
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            if (onClear) {
                onClear();
            } else if (onChange) {
                onChange("");

                // Also trigger search with empty value if search is enabled
                if (onSearch) {
                    onSearch("");
                }
            }

            // Focus the input after clearing
            if (inputRef.current) {
                inputRef.current.focus();
            }
        };

        // Get appropriate size class
        const getSizeClass = () => {
            switch (size) {
                case "small":
                    return "search-bar-small";
                case "large":
                    return "search-bar-large";
                default:
                    return "search-bar-medium";
            }
        };

        return (
            <div
                className={`search-bar-container ${getSizeClass()} ${
                    rounded ? "search-bar-rounded" : ""
                } ${className}`}
            >
                <div
                    className={`search-bar-wrapper ${
                        isFocused ? "focused" : ""
                    } ${disabled ? "disabled" : ""}`}
                >
                    <div className="search-icon-wrapper">{searchIcon}</div>

                    <input
                        ref={inputRef}
                        type="text"
                        className="search-input"
                        placeholder={placeholder}
                        value={value}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                        {...rest}
                    />

                    <div className="search-bar-actions">
                        {loading && (
                            <div className="search-loading-spinner">
                                <svg
                                    className="spinner-icon"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="spinner-path"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        fill="none"
                                        strokeWidth="3"
                                    />
                                </svg>
                            </div>
                        )}

                        {allowClear && value && (
                            <button
                                type="button"
                                className="clear-search-button"
                                onClick={handleClear}
                                aria-label="Clear search"
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
                    </div>
                </div>
            </div>
        );
    }
);

export default CustomSearchBar;
