import React, { useState, useEffect } from "react";
import EmailIndex from "./EmailIndex";
import EmailDetails from "./EmailDetails";
import {
    CustomContainer,
    CustomTextInput,
    RichTextEditor,
    CustomModal,
} from "../../../components";
import EmailSettings from "./EmailSettings";
import EmailHelp from "./EmailHelp";

function EmailMainSection({
    activeMenu,
    setShowComposeModal = () => {},
    searchQuery,
    setSelectedDraftEmail,
}) {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [showEmailDetails, setShowEmailDetails] = useState(false);

    // Handle activeMenu changes - close email details when menu changes
    useEffect(() => {
        if (showEmailDetails) {
            setShowEmailDetails(false);
            setSelectedEmail(null);
        }
    }, [activeMenu]);

    // Sample email data - replace with your actual data source
    const [emailData, setEmailData] = useState({
        inbox: [
            {
                id: "1",
                senderEmail: "john.doe@company.com",
                senderName: "John Doe",
                subject:
                    "Project Update - Q4 Planning how tho this is work can you chekc . . . is work fine",
                content:
                    "Hi team, I wanted to share the latest updates on our Q4 planning session. We've made significant progress on the roadmap and I'd like to schedule a follow-up meeting to discuss the implementation timeline. Please let me know your availability for next week.",
                contentPreview:
                    "Hi team, I wanted to share the latest updates on our Q4 planning session...",
                date: new Date().toISOString(),
                isRead: false,
                isImportant: true,
                hasAttachment: true,
                attachments: [
                    {
                        fileName: "Q4_Planning_Document.pdf",
                        fileSize: "2.3MB",
                        fileType: "application/pdf",
                    },
                    {
                        fileName: "Roadmap_Timeline.xlsx",
                        fileSize: "456KB",
                        fileType:
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    },
                ],
            },
            {
                id: "2",
                senderEmail: "sarah.wilson@marketing.com",
                senderName: "Sarah Wilson",
                subject: "Marketing Campaign Results",
                content:
                    "Great news! Our latest marketing campaign has exceeded expectations. The conversion rate increased by 25% and we've seen a significant boost in brand awareness. I've attached the detailed analytics report for your review.",
                contentPreview:
                    "Great news! Our latest marketing campaign has exceeded expectations...",
                date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                isRead: true,
                isImportant: false,
                hasAttachment: true,
                attachments: [
                    {
                        fileName: "Campaign_Analytics_Report.pdf",
                        fileSize: "1.8MB",
                        fileType: "application/pdf",
                    },
                ],
            },
            {
                id: "3",
                senderEmail: "support@techservice.com",
                senderName: "Tech Support",
                subject: "System Maintenance Notification",
                content:
                    "This is to inform you that we will be performing scheduled maintenance on our servers this weekend. The maintenance window is from Saturday 2:00 AM to Sunday 6:00 AM EST. During this time, some services may be temporarily unavailable.",
                contentPreview:
                    "This is to inform you that we will be performing scheduled maintenance...",
                date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                isRead: true,
                isImportant: false,
                hasAttachment: false,
                attachments: [],
            },
            {
                id: "4",
                senderEmail: "hr@company.com",
                senderName: "HR Department",
                subject: "Employee Benefits Update",
                content:
                    "We're excited to announce updates to our employee benefits package. Starting next month, we're adding new healthcare options and increasing our retirement contribution matching. Please review the attached documents and let us know if you have any questions.",
                contentPreview:
                    "We're excited to announce updates to our employee benefits package...",
                date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
                isRead: false,
                isImportant: true,
                hasAttachment: true,
                attachments: [
                    {
                        fileName: "Benefits_Package_2024.pdf",
                        fileSize: "3.2MB",
                        fileType: "application/pdf",
                    },
                    {
                        fileName: "Healthcare_Options.docx",
                        fileSize: "892KB",
                        fileType:
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    },
                ],
            },
        ],
        draft: [
            {
                id: "draft1",
                senderEmail: "me@mycompany.com",
                senderName: "Me",
                subject: "Re: Project Timeline Discussion",
                recipientEmail: "client@external.com",
                recipientName: "Client Name",
                cc: "team@company.com,ayush@gmail.com",
                bcc: "support@techservice.com, hello@mycompany.com",
                content:
                    "Thank you for the detailed project timeline. I have reviewed the milestones and have a few suggestions that might help optimize our delivery schedule. Would you be available for a quick call tomorrow to discuss?",
                contentPreview:
                    "Thank you for the detailed project timeline. I have reviewed...",
                date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                isRead: true,
                isImportant: false,
                hasAttachment: false,
                attachments: [],
                isDraft: true,
            },
            {
                id: "draft2",
                senderEmail: "me@mycompany.com",
                senderName: "Me",
                subject: "Weekly Team Update",
                content:
                    "Hi team, Here's our weekly update: 1. Completed tasks from last week 2. Current priorities 3. Upcoming deadlines 4. Any blockers or challenges Please add any additional items you'd like to discuss in our Monday meeting.",
                contentPreview:
                    "Hi team, Here's our weekly update: 1. Completed tasks...",
                date: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                isRead: true,
                isImportant: false,
                hasAttachment: false,
                attachments: [],
                isDraft: true,
            },
        ],
        sent: [
            {
                id: "sent1",
                recipientEmail: "client@external.com",
                recipientName: "Client Name",
                subject: "Proposal Submission - Web Development Project",
                content:
                    "Dear Client, I hope this email finds you well. I'm pleased to submit our proposal for your web development project. We've carefully reviewed your requirements and believe our solution will meet all your needs while staying within budget. Please find the detailed proposal attached.",
                contentPreview:
                    "Dear Client, I hope this email finds you well. I'm pleased to submit...",
                date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                isRead: true,
                isImportant: true,
                hasAttachment: true,
                attachments: [
                    {
                        fileName: "Web_Development_Proposal.pdf",
                        fileSize: "4.1MB",
                        fileType: "application/pdf",
                    },
                ],
                isSent: true,
            },
            {
                id: "sent2",
                recipientEmail: "team@company.com",
                recipientName: "Development Team",
                subject: "Code Review Guidelines Update",
                content:
                    "Team, I've updated our code review guidelines based on the feedback from last month's retrospective. The main changes include: stricter linting rules, mandatory security checks, and improved documentation requirements. Please review and let me know if you have any concerns.",
                contentPreview:
                    "Team, I've updated our code review guidelines based on the feedback...",
                date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                isRead: true,
                isImportant: false,
                hasAttachment: true,
                attachments: [
                    {
                        fileName: "Code_Review_Guidelines_v2.docx",
                        fileSize: "1.2MB",
                        fileType:
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    },
                ],
                isSent: true,
            },
        ],
    });

    // Get current emails based on selected view
    const getCurrentEmails = () => {
        return emailData[activeMenu] || [];
    };

    // Handle email selection
    const handleEmailPress = (email) => {
        // if  activeMenu === "draft" || then open the emails in the draft wirth files info.
        if (activeMenu === "draft") {
            setShowComposeModal(true);
            setSelectedDraftEmail(email);
            console.log(email);

            return;
        }
        setSelectedEmail(email);
        setShowEmailDetails(true);

        // Mark email as read if it's from inbox and unread
        if (activeMenu === "inbox" && !email.isRead) {
            markEmailAsRead(email.id);
        }
    };

    // Mark email as read
    const markEmailAsRead = (emailId) => {
        setEmailData((prevData) => ({
            ...prevData,
            [activeMenu]: prevData[activeMenu].map((email) =>
                email.id === emailId ? { ...email, isRead: true } : email
            ),
        }));
    };

    // Handle email refresh
    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            // Simulate API call to fetch fresh emails
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // In real implementation, you would fetch fresh data from your API
            console.log("Emails refreshed for view:", activeMenu);
        } catch (error) {
            console.error("Error refreshing emails:", error);
        } finally {
            setRefreshing(false);
        }
    };

    // Handle email actions from EmailDetails
    const handleEmailAction = (action, email) => {
        switch (action) {
            case "reply":
                // Handle reply logic
                console.log("Reply to:", email);
                break;
            case "forward":
                // Handle forward logic
                console.log("Forward:", email);
                break;
            case "delete":
                handleDeleteEmail(email.id);
                break;
            case "markImportant":
                handleToggleImportant(email.id);
                break;
            case "markUnread":
                handleMarkUnread(email.id);
                break;
            default:
                console.log("Unknown action:", action);
        }
    };

    // Delete email
    const handleDeleteEmail = (emailId) => {
        setEmailData((prevData) => ({
            ...prevData,
            [activeMenu]: prevData[activeMenu].filter(
                (email) => email.id !== emailId
            ),
        }));
        setShowEmailDetails(false);
        setSelectedEmail(null);
    };

    // Toggle important status
    const handleToggleImportant = (emailId) => {
        setEmailData((prevData) => ({
            ...prevData,
            [activeMenu]: prevData[activeMenu].map((email) =>
                email.id === emailId
                    ? { ...email, isImportant: !email.isImportant }
                    : email
            ),
        }));
    };

    // Mark email as unread
    const handleMarkUnread = (emailId) => {
        setEmailData((prevData) => ({
            ...prevData,
            [activeMenu]: prevData[activeMenu].map((email) =>
                email.id === emailId ? { ...email, isRead: false } : email
            ),
        }));
    };

    return (
        <div className="email-main-section w-full">
            {showEmailDetails && selectedEmail ? (
                // If showing email details
                <EmailDetails
                    email={selectedEmail}
                    onAction={handleEmailAction}
                    onClose={() => setShowEmailDetails(false)}
                />
            ) : (
                <CustomContainer className="h-full" padding="none">
                    {/* Main Content Area */}
                    <div className="flex h-full w-full">
                        {/* Email List Panel */}
                        {activeMenu === "settings" ? (
                            <EmailSettings />
                        ) : activeMenu === "help" ? (
                            <EmailHelp />
                        ) : (
                            <div className="w-full border-r border-gray-200 transition-all duration-300">
                                <EmailIndex
                                    index={activeMenu}
                                    emails={getCurrentEmails()}
                                    onEmailPress={handleEmailPress}
                                    setShowComposeModal={setShowComposeModal}
                                    onRefresh={handleRefresh}
                                    searchQuery={searchQuery}
                                />
                                {refreshing && (
                                    <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                                        <div className="flex items-center space-x-2 text-blue-600">
                                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            <span>Refreshing...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Loading Overlay */}
                    {loading && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-gray-700">
                                    Sending email...
                                </span>
                            </div>
                        </div>
                    )}
                </CustomContainer>
            )}
        </div>
    );
}

export default EmailMainSection;
