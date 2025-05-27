import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    CopyIcon,
    EmployeeIdIcon,
    PhoneIcon,
    DepartmentIcon,
    DesignationIcon,
    EditIcon,
} from "../../../../../utils/SvgIcon";
import EmployeeDetailsInfo from "./EmployeeDetailsInfo";

function EmployeeInfo({ selectedEmployee }) {
    const [isOpen, setIsOpen] = useState(false);
    // use ref for track the outside click if dropdown is open
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const handleClick = () => {
        setIsOpen((prev) => !prev);
    };

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    // Function to handle outside click
    const handleOutsideClick = useCallback(
        (event) => {
            if (
                (dropdownRef.current &&
                    dropdownRef.current.contains(event.target)) ||
                (buttonRef.current && buttonRef.current.contains(event.target))
            ) {
                return;
            }
            handleClose(); // Fixed: Added parentheses to actually call the function
        },
        [handleClose]
    );

    // Add event listener for clicks outside the dropdown
    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        // Cleanup function to remove event listener
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isOpen, handleOutsideClick]); // Dependency array includes isOpen to re-run when dropdown state changes

    // Function to handle copy to clipboard
    const handleCopy = (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            // Use Clipboard API if available
            navigator.clipboard
                .writeText(text)
                .then(() => console.log("Copied to clipboard:", text))
                // TODO : hear call the tost message display the message copied to clipboard.
                .catch((err) => console.error("Clipboard write failed:", err));
        } else {
            // Fallback to execCommand
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.setAttribute("readonly", "");
            textarea.style.position = "absolute";
            textarea.style.left = "-9999px";
            document.body.appendChild(textarea);
            textarea.select();
            try {
                const successful = document.execCommand("copy");
                console.log(
                    successful
                        ? "Copied using fallback"
                        : "Fallback copy failed"
                );
                // TODO : hear call the tost message display the message for error handle the error correctly.
            } catch (err) {
                console.error("Fallback copy failed", err);
            }
            document.body.removeChild(textarea);
        }
    };

    return (
        <div className="">
            {/* Header with action buttons */}
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Employee Information</h2>
                <div className="flex space-x-2 relative">
                    {" "}
                    {/* Added relative positioning */}
                    <button className="px-3 py-1 flex flex-row items-center rounded-md text-blue-600 bg-blue-50 text-xs font-medium border border-blue-600">
                        <EditIcon className="mr-1 h-3.5 w-3.5" />
                        Edit
                    </button>
                    <button className="px-3 py-1 rounded-md text-green-600 bg-green-50 text-xs font-medium border border-green-600">
                        View
                    </button>
                    <button className="px-3 py-1 rounded-md text-purple-600 bg-purple-50 text-xs font-medium border border-purple-600">
                        Upload Photo
                    </button>
                    <button
                        ref={buttonRef}
                        className="px-3 py-1 rounded-md text-amber-600 bg-amber-50 text-xs font-medium border border-amber-600"
                        onClick={handleClick}
                    >
                        Share
                    </button>
                    {/* This opens a menu with a list of options, located below the share button. */}
                    {isOpen && (
                        <div
                            ref={dropdownRef} // Added ref to the dropdown
                            className={`profile-dropdown absolute right-5 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 top-full transition-all duration-300 ease-out ${
                                isOpen
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 -translate-y-2 pointer-events-none"
                            }`}
                        >
                            <ul>
                                {/* Profile menu item */}
                                <li>
                                    <a
                                        href="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                                    >
                                        <span className="flex items-center gap-2">
                                            Profile
                                        </span>
                                    </a>
                                </li>

                                {/* Settings menu item */}
                                <li>
                                    <a
                                        href="/settings"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                                    >
                                        <span className="flex items-center gap-2">
                                            Settings
                                        </span>
                                    </a>
                                </li>

                                {/* Sign out menu item with top border */}
                                <li className="border-t border-gray-100 mt-1 pt-1">
                                    <a
                                        href="/logout"
                                        className="block px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <span className="flex items-center gap-2">
                                            Sign out
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                    <button className="px-3 py-1 rounded-md text-red-600 bg-red-50 text-xs font-medium border border-red-600">
                        Deactivate
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="p-5 border-b border-gray-200 mb-3">
                <div className="flex items-center">
                    <img
                        src={selectedEmployee.avatar}
                        alt={selectedEmployee.name}
                        className="w-30 h-30 rounded-full mr-6"
                    />
                    <div className="flex-1">
                        {/* Name with copy icon */}
                        <div className="flex items-center mb-2">
                            <h3 className="text-lg font-medium mr-2">
                                {selectedEmployee.name}
                            </h3>
                        </div>

                        {/* Phone with icon */}
                        <div className="flex items-center text-gray-600 mb-3 text-sm">
                            <PhoneIcon className="w-4 h-4" />
                            <span className="mx-2">(555) 123-4567</span>
                            <button
                                onClick={() => handleCopy("(555) 123-4567")}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <CopyIcon className="w-4 h-4 text-blue-400" />
                            </button>
                        </div>

                        {/* Employee ID with icon */}
                        <div className="flex items-center text-gray-600 mb-3 text-sm">
                            <EmployeeIdIcon className="w-4 h-4" />
                            <span className="mx-2">
                                <span className="font-semibold">
                                    Employee Number:
                                </span>{" "}
                                #{selectedEmployee.punchCode}
                            </span>
                            <button
                                onClick={() =>
                                    handleCopy(selectedEmployee.punchCode)
                                }
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <CopyIcon className="w-4 h-4 text-blue-400" />
                            </button>
                        </div>

                        {/* Designation with icon */}
                        <div className="flex items-center text-gray-600 mb-3 text-sm">
                            <DesignationIcon className="w-4 h-4" />
                            <span className="mx-2">
                                <span className="font-semibold">
                                    Designation:{" "}
                                </span>
                                {selectedEmployee.designation}
                            </span>
                            <button
                                onClick={() =>
                                    handleCopy(selectedEmployee.designation)
                                }
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <CopyIcon className="w-4 h-4 text-blue-400" />
                            </button>
                        </div>

                        {/* Department with icon */}
                        <div className="flex items-center text-gray-600 mb-3 text-sm">
                            <DepartmentIcon className="w-4 h-4" />
                            <span className="mx-2">
                                <span className="font-semibold">
                                    Department:{" "}
                                </span>
                                {selectedEmployee.department}
                            </span>
                            <button
                                onClick={() =>
                                    handleCopy(selectedEmployee.department)
                                }
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <CopyIcon className="w-4 h-4 text-blue-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <EmployeeDetailsInfo selectedEmployee={selectedEmployee} />
        </div>
    );
}

export default EmployeeInfo;
