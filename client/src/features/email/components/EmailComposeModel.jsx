import React, { useState, useEffect } from "react";
import {
    CustomTextInput,
    RichTextEditor,
    CustomModal,
} from "../../../components";
import { InfoIcon } from "../../../utils/SvgIcon";
import MultiEmailInput from "./MultiEmailInput"; // Import the new component

function EmailComposeModel({
    editData,
    setEditData,
    showComposeModal,
    setShowComposeModal,
    emailTo,
    setEmailTo,
    emailSubject,
    setEmailSubject,
    emailContent,
    setEmailContent,
    handleComposeClear,
    handleComposeSubmit,
}) {
    // Additional state for new features
    const [emailCc, setEmailCc] = useState("");
    const [emailBcc, setEmailBcc] = useState("");
    const [showCc, setShowCc] = useState(false);
    const [showBcc, setShowBcc] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [requestReadReceipt, setRequestReadReceipt] = useState(false);

    // Load edit data when editData changes
    useEffect(() => {
        if (editData && showComposeModal) {
            // Populate main fields
            setEmailSubject(editData.subject || "");
            setEmailContent(editData.content || "");

            // Handle attachments if they exist
            if (editData.attachments && editData.attachments.length > 0) {
                setAttachments(editData.attachments);
            }

            // If the editData has recipients (you might need to add these fields to your draft data structure)
            if (editData.recipientEmail) {
                setEmailTo(editData.recipientEmail);
            }
            if (editData.cc) {
                setEmailCc(editData.cc);
                setShowCc(true); // Show CC field if there's CC data
            }
            if (editData.bcc) {
                setEmailBcc(editData.bcc);
                setShowBcc(true); // Show BCC field if there's BCC data
            }

            // Handle read receipt if stored in editData
            if (editData.requestReadReceipt) {
                setRequestReadReceipt(editData.requestReadReceipt);
            }
        }
    }, [
        editData,
        showComposeModal,
        setEmailTo,
        setEmailSubject,
        setEmailContent,
    ]);

    // Clear edit data when modal closes or is cleared
    useEffect(() => {
        if (!showComposeModal && editData) {
            setEditData(null); // Clear edit data when modal closes
        }
    }, [showComposeModal, editData, setEditData]);

    // Handle file attachment
    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const newAttachments = files.map((file) => ({
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            file: file,
        }));
        setAttachments([...attachments, ...newAttachments]);
    };

    // Remove attachment
    const removeAttachment = (id) => {
        setAttachments(attachments.filter((att) => att.id !== id));
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Enhanced clear function - clears all data including CC/BCC
    const handleEnhancedClear = () => {
        setEmailCc("");
        setEmailBcc("");
        setShowCc(false);
        setShowBcc(false);
        setAttachments([]);
        setRequestReadReceipt(false);
        setEditData(null); // Clear edit data
        handleComposeClear();
    };

    // TODO: Handle the submit hear
    const handleEnhancedSubmit = () => {
        // Prepare email data with comma-separated email strings
        const emailData = {
            to: emailTo, // Already comma-separated from MultiEmailInput
            cc: emailCc, // Already comma-separated from MultiEmailInput
            bcc: emailBcc, // Already comma-separated from MultiEmailInput
            subject: emailSubject,
            content: emailContent,
            attachments: attachments,
            requestReadReceipt: requestReadReceipt,
            // Include edit data ID if editing
            ...(editData && { id: editData.id, isDraft: editData.isDraft }),
        };

        console.log("Email data being sent to server:", emailData);

        // Call the original submit handler with enhanced data
        handleComposeSubmit(emailData);
    };

    // TODO:handle the Draft hear

    // Determine if we're in edit mode
    const isEditMode = editData && editData.id;

    return (
        <CustomModal
            isOpen={showComposeModal}
            onClose={() => setShowComposeModal(false)}
            title={isEditMode ? "✏️ Edit Draft Email" : "✍️ Compose New Email"}
            size="large"
            footer={
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={() => {
                            handleEnhancedClear();
                            setShowComposeModal(false);
                        }}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleEnhancedClear}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={handleEnhancedSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        disabled={!emailTo.trim() || !emailSubject.trim()}
                    >
                        <span>💾</span>
                        Draft Email
                    </button>
                    <button
                        onClick={handleEnhancedSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        disabled={!emailTo.trim() || !emailSubject.trim()}
                    >
                        <span>📧</span>
                        Send Email
                    </button>
                </div>
            }
        >
            <div className="space-y-4">
                {/* Edit Mode Indicator */}
                {isEditMode && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-600">✏️</span>
                            <span className="text-sm font-medium text-yellow-800">
                                Editing Draft: {editData.subject || "Untitled"}
                            </span>
                            <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                                Draft ID: {editData.id}
                            </span>
                        </div>
                    </div>
                )}

                {/* To Field - Using MultiEmailInput */}
                <MultiEmailInput
                    label="To"
                    placeholder="Enter recipient email addresses"
                    value={emailTo}
                    onChange={setEmailTo}
                    required={true}
                />

                {/* CC/BCC Toggle Buttons */}
                <div className="flex gap-2 items-center">
                    <button
                        onClick={() => setShowCc(!showCc)}
                        className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                    >
                        + {showCc ? "Hide" : "Add"} Copy (CC)
                        {emailCc && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                Has data
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setShowBcc(!showBcc)}
                        className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                    >
                        + {showBcc ? "Hide" : "Add"} Blind Copy (BCC)
                        {emailBcc && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                Has data
                            </span>
                        )}
                    </button>

                    <button title="Enter CC and BCC fields with multiple email addresses. Use Enter, comma, or space to separate emails.">
                        <InfoIcon className="text-xs text-gray-500 hover:text-gray-700" />
                    </button>
                </div>

                {/* CC Field - Using MultiEmailInput */}
                {showCc && (
                    <div className="relative">
                        <MultiEmailInput
                            label="Copy (CC)"
                            placeholder="Enter CC recipients (visible to all recipients)"
                            value={emailCc}
                            onChange={setEmailCc}
                        />
                    </div>
                )}

                {/* BCC Field - Using MultiEmailInput */}
                {showBcc && (
                    <div className="relative">
                        <MultiEmailInput
                            label="Blind Copy (BCC)"
                            placeholder="Enter BCC recipients (hidden from other recipients)"
                            value={emailBcc}
                            onChange={setEmailBcc}
                        />
                    </div>
                )}

                {/* Subject Field */}
                <CustomTextInput
                    label="Subject"
                    placeholder="Enter email subject"
                    value={emailSubject}
                    onChange={setEmailSubject}
                    required={true}
                />

                {/* File Attachment */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">
                            Attachments:
                        </label>
                        <label className="cursor-pointer px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-1">
                            <span>📎</span>
                            Attach Files
                            <input
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                                accept="*/*"
                            />
                        </label>
                    </div>

                    {/* Attachment List */}
                    {attachments.length > 0 && (
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {attachments.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">📄</span>
                                        <div>
                                            <div className="text-sm font-medium text-gray-700">
                                                {attachment.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {formatFileSize(
                                                    attachment.size
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            removeAttachment(attachment.id)
                                        }
                                        className="text-red-500 hover:text-red-700 text-sm"
                                        title="Remove attachment"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Message Content */}
                <RichTextEditor
                    label="Message"
                    placeholder="Type your email message here..."
                    value={emailContent}
                    onChange={setEmailContent}
                    required={true}
                    toolbarOptions={[
                        "bold",
                        "italic",
                        "underline",
                        "list",
                        "link",
                        "color",
                        "align",
                    ]}
                    minHeight="200px"
                    maxHeight="400px"
                />

                {/* Email Summary */}
                {(emailTo.length > 0 ||
                    emailCc.length > 0 ||
                    emailBcc.length > 0 ||
                    attachments.length > 0) && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="text-sm font-medium text-blue-800 mb-2">
                            📋 Email Summary:
                            <div className="text-xs text-blue-700 space-y-2 mt-2">
                                {/* TO Emails */}
                                {emailTo && (
                                    <div className="flex flex-wrap gap-2">
                                        {emailTo
                                            .split(",")
                                            .map((email, idx) => (
                                                <div
                                                    key={`to-${idx}`}
                                                    className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                                                >
                                                    TO:{" "}
                                                    {email
                                                        .trim()
                                                        .replace(/e/g, "text")}
                                                </div>
                                            ))}
                                    </div>
                                )}

                                {/* CC & BCC Emails */}
                                {(emailCc || emailBcc) && (
                                    <div className="flex flex-wrap gap-2">
                                        {emailCc &&
                                            emailCc
                                                .split(",")
                                                .map((email, idx) => (
                                                    <div
                                                        key={`cc-${idx}`}
                                                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                                                    >
                                                        CC:{" "}
                                                        {email
                                                            .trim()
                                                            .replace(
                                                                /e/g,
                                                                "text"
                                                            )}
                                                    </div>
                                                ))}
                                        {emailBcc &&
                                            emailBcc
                                                .split(",")
                                                .map((email, idx) => (
                                                    <div
                                                        key={`bcc-${idx}`}
                                                        className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                                                    >
                                                        BCC:{" "}
                                                        {email
                                                            .trim()
                                                            .replace(
                                                                /e/g,
                                                                "text"
                                                            )}
                                                    </div>
                                                ))}
                                    </div>
                                )}

                                {/* Attachments */}
                                {attachments.length > 0 && (
                                    <div>
                                        • {attachments.length} attachment(s)
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Email Signature Note */}
                <div className="text-xs text-gray-500 italic">
                    💡 Tip: Your email signature will be automatically added
                    when sending.
                </div>
            </div>
        </CustomModal>
    );
}

export default EmailComposeModel;
