import React from "react";
import {
    CustomContainer,
    CustomTextInput,
    RichTextEditor,
    CustomModal,
} from "../../../components";

// Helper function to format date
const formatEmailDate = (date) => {
    const emailDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // If today, show time
    if (emailDate.toDateString() === today.toDateString()) {
        return emailDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }
    // If yesterday, show "Yesterday"
    else if (emailDate.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }
    // Otherwise show date
    else {
        return emailDate.toLocaleDateString();
    }
};

// Helper function to get file icon based on extension
const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
        case "pdf":
            return "📄";
        case "doc":
        case "docx":
            return "📝";
        case "xls":
        case "xlsx":
            return "📊";
        case "ppt":
        case "pptx":
            return "📋";
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
            return "🖼️";
        case "zip":
        case "rar":
            return "🗜️";
        default:
            return "📎";
    }
};

// Email tile component
const EmailTile = ({ email, onEmailPress, isRead = false }) => {
    return (
        <div
            className={`email-tile border-b border-gray-200 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                !isRead ? "bg-white font-medium" : "bg-gray-50 font-normal"
            }`}
            onClick={() => onEmailPress(email)}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    {/* Subject */}
                    <div className="flex flex-row items-center gap-3">
                        <div
                            className={`text-sm min-w-70 max-w-70 truncate ${
                                !isRead
                                    ? "font-semibold text-gray-900"
                                    : "text-gray-700"
                            }`}
                        >
                            {email.subject}
                        </div>

                        {/* Content Preview */}
                        <div className="text-sm text-gray-600 line-clamp-1">
                            {email.content}
                        </div>

                        {/* Sender Info */}
                        <div className="flex items-center justify-end min-w-70 max-w-70 truncate">
                            <span
                                className={`text-sm ${
                                    !isRead
                                        ? "font-semibold text-gray-900"
                                        : "text-gray-700"
                                }`}
                            >
                                {email.senderName || email.senderEmail}
                            </span>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                {formatEmailDate(email.date)}
                            </span>
                        </div>
                    </div>

                    {/* Attachments */}
                    {email.attachments && email.attachments.length > 0 && (
                        <div className="flex items-center mt-2 flex-wrap gap-2">
                            {email.attachments.map((attachment, index) => (
                                <div
                                    key={index}
                                    className="flex items-center bg-gray-100 rounded-md px-2 py-1 text-xs"
                                >
                                    <span className="mr-1">
                                        {getFileIcon(attachment.fileName)}
                                    </span>
                                    <span className="text-gray-700 truncate max-w-32">
                                        {attachment.fileName}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Status indicators */}
                <div className="flex items-center ml-4 space-x-2">
                    {email.hasAttachment && (
                        <span className="text-gray-400">📎</span>
                    )}
                    {!isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                </div>
            </div>
        </div>
    );
};

function EmailIndex({
    index = "inbox", // "inbox", "draft", "sent"
    emails = [],
    onEmailPress,
    setShowComposeModal = () => {},
    onRefresh,
    searchQuery,
}) {
    // Filter emails based on search query
    const filteredEmails = emails.filter(
        (email) =>
            email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.senderEmail
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            (email.senderName &&
                email.senderName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())) ||
            email.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get title based on index
    const getTitle = () => {
        switch (index) {
            case "draft":
                return "Drafts";
            case "sent":
                return "Sent";
            case "inbox":
            default:
                return "Inbox";
        }
    };

    return (
        <CustomContainer
            title={getTitle()}
            className="email-index-container !b-0"
            headerActions={
                <div className="flex items-center space-x-3">
                    {/* Refresh Button */}
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                            title="Refresh"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                        </button>
                    )}

                    {/* Compose Button */}
                    {(index === "inbox" || index === "draft") && (
                        <button
                            onClick={() => setShowComposeModal(true)} // hear i get the error is setShowComposeModal is nopt a function
                            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            <span>Compose</span>
                        </button>
                    )}
                </div>
            }
            padding="small"
            elevation="none"
            border={false}
        >
            {/* Email List */}
            <div className="email-list">
                {filteredEmails.length === 0 ? (
                    <div className="text-center py-1">
                        <div className="text-gray-400 mb-4">
                            <svg
                                className="w-16 h-16 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                            {searchQuery
                                ? "No emails found"
                                : `No emails in ${getTitle().toLowerCase()}`}
                        </h3>
                        <p className="text-gray-500">
                            {searchQuery
                                ? "Try adjusting your search criteria"
                                : `Your ${getTitle().toLowerCase()} will appear here`}
                        </p>
                    </div>
                ) : (
                    filteredEmails.map((email, index) => (
                        <EmailTile
                            key={email.id || index}
                            email={email}
                            onEmailPress={onEmailPress}
                            isRead={email.isRead}
                        />
                    ))
                )}
            </div>
        </CustomContainer>
    );
}

export default EmailIndex;
