import React from "react";
import {
    CustomContainer,
    CustomTextInput,
    RichTextEditor,
    CustomModal,
} from "../../../components";

function EmailDetails({ email, onAction, onClose }) {
    if (!email) {
        return null;
    }

    // Helper function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        } else if (diffInHours < 168) {
            // Less than a week
            return date.toLocaleDateString("en-US", {
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        } else {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year:
                    date.getFullYear() !== now.getFullYear()
                        ? "numeric"
                        : undefined,
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        }
    };

    // Helper function to get file icon based on file type
    const getFileIcon = (fileType) => {
        if (fileType.includes("pdf")) return "📄";
        if (fileType.includes("image")) return "🖼️";
        if (fileType.includes("sheet") || fileType.includes("excel"))
            return "📊";
        if (fileType.includes("word") || fileType.includes("document"))
            return "📝";
        if (fileType.includes("zip") || fileType.includes("compressed"))
            return "🗜️";
        return "📎";
    };

    // Determine email type and display appropriate info
    const isInbox = !email.isDraft && !email.isSent;
    const isDraft = email.isDraft;
    const isSent = email.isSent;

    return (
        <CustomContainer
            className="w-full mx-auto"
            padding="none"
            elevation="none"
            backgroundColor="white"
            border={false}
        >
            {/* Header with action buttons */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Back"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>

                    {/* Status indicator */}
                    <div className="flex items-center gap-2">
                        {email.subject && (
                            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                                {email.subject}
                            </h1>
                        )}
                        {isDraft && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                Draft
                            </span>
                        )}
                        {isSent && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                Sent
                            </span>
                        )}
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                    {!isDraft && (
                        <>
                            <button
                                onClick={() => onAction("reply")}
                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Reply
                            </button>
                            <button
                                onClick={() => onAction("forward")}
                                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Forward
                            </button>
                        </>
                    )}
                    {isDraft && (
                        <button
                            onClick={() => onAction("continue")}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Continue Editing
                        </button>
                    )}
                </div>
            </div>

            {/* Email content */}
            <div className="p-6">
                {/* Sender/Recipient info */}
                <div className="mb-6">
                    <div className="flex items-start gap-4 mb-4">
                        {/* Profile picture placeholder */}
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {isInbox
                                ? email.senderName?.charAt(0)?.toUpperCase() ||
                                  "U"
                                : isSent
                                ? email.recipientName
                                      ?.charAt(0)
                                      ?.toUpperCase() || "U"
                                : "Me"}
                        </div>

                        <div className="flex-1 min-w-0">
                            {/* From/To line */}
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900">
                                    {isInbox
                                        ? email.senderName || "Unknown Sender"
                                        : isSent
                                        ? email.recipientName ||
                                          "Unknown Recipient"
                                        : "Me"}
                                </span>
                                <span className="text-gray-500 text-sm">
                                    {isInbox
                                        ? `<${email.senderEmail}>`
                                        : isSent
                                        ? `<${email.recipientEmail}>`
                                        : `<${email.senderEmail}>`}
                                </span>
                            </div>

                            {/* To/From details */}
                            <div className="text-sm text-gray-600">
                                {isInbox && (
                                    <div className="mb-1">
                                        <span className="text-gray-500">
                                            to me
                                        </span>
                                    </div>
                                )}
                                {isSent && (
                                    <div className="mb-1">
                                        <span className="text-gray-500">
                                            to{" "}
                                        </span>
                                        <span>
                                            {email.recipientName ||
                                                email.recipientEmail}
                                        </span>
                                    </div>
                                )}

                                {/* Timestamp */}
                                <div className="flex items-center gap-2 text-gray-500">
                                    <span>{formatDate(email.date)}</span>
                                    {!email.isRead && isInbox && (
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email body */}
                <div className="mb-6">
                    <div
                        className="prose max-w-none text-gray-800 leading-relaxed"
                        style={{ whiteSpace: "pre-wrap" }}
                    >
                        {email.content}
                    </div>
                </div>

                {/* Attachments */}
                {email.hasAttachment &&
                    email.attachments &&
                    email.attachments.length > 0 && (
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                Attachments ({email.attachments.length})
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {email.attachments.map((attachment, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <span className="text-2xl">
                                            {getFileIcon(attachment.fileType)}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-900 truncate">
                                                {attachment.fileName}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {attachment.fileSize}
                                            </div>
                                        </div>
                                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
            </div>

            {/* Mobile-friendly action buttons at bottom */}
            <div className="block sm:hidden border-t border-gray-200 p-4">
                <div className="flex gap-2">
                    {!isDraft && (
                        <>
                            <button
                                onClick={() => onAction("reply")}
                                className="flex-1 px-4 py-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Reply
                            </button>
                            <button
                                onClick={() => onAction("forward")}
                                className="flex-1 px-4 py-3 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Forward
                            </button>
                        </>
                    )}
                    {isDraft && (
                        <button
                            onClick={() => onAction("continue")}
                            className="w-full px-4 py-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Continue Editing
                        </button>
                    )}
                </div>
            </div>
        </CustomContainer>
    );
}

export default EmailDetails;
