import React from "react";
import { CustomContainer, TextButton } from "../../../components";
import { ArrowRight, Eye } from "lucide-react";

function RecruiteeListCard({ className = "" }) {
    // Sample data - replace with your actual data
    const recruitees = [
        {
            id: 1,
            name: "John Doe",
            position: "Software Engineer",
            status: "Hired",
        },
        {
            id: 2,
            name: "Jane Smith",
            position: "Product Manager",
            status: "Cancelled",
        },
        {
            id: 3,
            name: "Mike Johnson",
            position: "UX Designer",
            status: "Interviewed",
        },
        {
            id: 4,
            name: "Sarah Wilson",
            position: "Data Analyst",
            status: "Screened",
        },
        {
            id: 5,
            name: "Tom Brown",
            position: "DevOps Engineer",
            status: "Hired",
        },
        {
            id: 6,
            name: "Tom Brown",
            position: "DevOps Engineer",
            status: "Hired",
        },
        {
            id: 7,
            name: "Tom Brown",
            position: "DevOps Engineer",
            status: "Hired",
        },
        {
            id: 8,
            name: "Towdfm Brodwn",
            position: "DevOps Engineer",
            status: "Hired",
        },
        {
            id: 9,
            name: "Towdfm Brodwn",
            position: "DevOps Engineer",
            status: "Hired",
        },
        {
            id: 10,
            name: "Towdfm Brodwn",
            position: "DevOps Engineer",
            status: "Hired",
        },
        {
            id: 11,
            name: "Towdfm Brodwn",
            position: "DevOps Engineer",
            status: "Hired",
        },
        {
            id: 12,
            name: "Tow Brown",
            position: "It Engineer",
            status: "Hired",
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "Init":
                return "text-blue-600 bg-blue-100";
            case "Screened":
                return "text-yellow-700 bg-yellow-100";
            case "Interviewed":
                return "text-purple-700 bg-purple-100";
            case "Hired":
                return "text-green-600 bg-green-100";
            case "Cancelled":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const handleViewDetails = (recruiteeId) => {
        // console.log(`View details for recruitee ${recruiteeId}`);
    };

    return (
        <CustomContainer
            className={`!m-0 !px-3 !py-2 h-full relative flex flex-col ${className}`}
            title="Recruitee List"
            icon={
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                </svg>
            }
            headerActions={
                <div className="mb-0 flex flex-row gap-2 items-center">
                    <p className="text-sm text-gray-500">
                        {recruitees.length} recruitees found
                    </p>
                    <TextButton
                        text="View All"
                        // onClick={() => console.log("View Recruitee List")}
                        icon={<ArrowRight size={16} />}
                        iconEnd={true}
                    />
                </div>
            }
            headerBorder={true}
            elevation="medium"
            rounded="medium"
            padding="none" // Changed to none to control padding inside
            overflowContent={true} // Enable overflow content
            isFixedFooter={false}
        >
            <div className="flex flex-col w-full relative h-full max-h-110 overflow-scroll custom-scrollbar">
                {recruitees.map((recruitee) => (
                    <div
                        key={recruitee.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 px-2 bg-white border-b border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-2 sm:gap-0 mb-2"
                    >
                        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-start sm:items-center sm:gap-3">
                            <p className="text-sm font-medium text-gray-900 truncate w-full sm:w-auto sm:min-w-0 sm:max-w-xs">
                                {recruitee.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate w-full sm:w-auto sm:text-center">
                                {recruitee.position}
                            </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 mt-2 sm:mt-0">
                            <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    recruitee.status
                                )}`}
                            >
                                {recruitee.status}
                            </span>

                            <button
                                onClick={() => handleViewDetails(recruitee.id)}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                            >
                                <Eye size={14} className="mr-1.5" />
                                View
                            </button>
                        </div>
                    </div>
                ))}

                {recruitees.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">
                            No recruitees found
                        </p>
                    </div>
                )}
            </div>
        </CustomContainer>
    );
}

export default RecruiteeListCard;
