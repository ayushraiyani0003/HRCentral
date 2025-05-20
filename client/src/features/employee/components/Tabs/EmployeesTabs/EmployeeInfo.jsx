import React from "react";
import {
    CopyIcon,
    EmployeeIdIcon,
    PhoneIcon,
    DepartmentIcon,
    DesignationIcon,
} from "../../../../../utils/SvgIcon";

function EmployeeInfo({ selectedEmployee }) {
    // Function to handle copy to clipboard
    const handleCopy = (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            // Use Clipboard API if available
            navigator.clipboard
                .writeText(text)
                .then(() => console.log("Copied to clipboard:", text))
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
                <div className="flex space-x-2">
                    <button className="px-3 py-1 rounded-md text-blue-600 bg-blue-50 text-xs font-medium border border-blue-600">
                        Edit
                    </button>
                    <button className="px-3 py-1 rounded-md text-green-600 bg-green-50 text-xs font-medium border border-green-600">
                        View
                    </button>
                    <button className="px-3 py-1 rounded-md text-purple-600 bg-purple-50 text-xs font-medium border border-purple-600">
                        Upload Photo
                    </button>
                    <button className="px-3 py-1 rounded-md text-amber-600 bg-amber-50 text-xs font-medium border border-amber-600">
                        Extra
                    </button>
                    <button className="px-3 py-1 rounded-md text-red-600 bg-red-50 text-xs font-medium border border-red-600">
                        Deactivate
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="p-6">
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
                                <CopyIcon className="w-4 h-4" />
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
                                <CopyIcon className="w-4 h-4" />
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
                                <CopyIcon className="w-4 h-4" />
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
                                <CopyIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeInfo;
