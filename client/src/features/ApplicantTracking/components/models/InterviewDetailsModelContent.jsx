import React, { useState } from "react";
import { Table } from "antd";
import { TextButton } from "../../../../components";
import { EditIcon, DeleteIcon } from "../../../../utils/SvgIcon";

function InterviewDetailsModelContent({ isViewMode }) {
    // Sample data for General Interview
    const [generalInterview, setGeneralInterview] = useState([
        {
            key: 1,
            interviewer: "John Smith",
            forwardedDate: "2024-01-15",
            result: "Selected",
            rejectionRemarks: "-",
        },
        {
            key: 2,
            interviewer: "Sarah Johnson",
            forwardedDate: "2024-01-20",
            result: "Rejected",
            rejectionRemarks: "Lacks required experience",
        },
    ]);

    // Sample data for Interview 2
    const [interview2, setInterview2] = useState([
        {
            key: 1,
            interviewer: "Mike Davis",
            suitableDepartment: "Development",
            forwardedDate: "2024-01-25",
            rejectionRemarks: "-",
            result: "Selected",
        },
        {
            key: 2,
            interviewer: "Lisa Chen",
            suitableDepartment: "Testing",
            forwardedDate: "2024-01-28",
            rejectionRemarks: "Technical skills insufficient",
            result: "Rejected",
        },
    ]);

    // Sample data for Interview 3
    const [interview3, setInterview3] = useState([
        {
            key: 1,
            interviewDate: "2024-02-01",
            interviewer: "Robert Wilson",
            forwardedDate: "2024-02-05",
            result: "Selected",
            rejectionRemarks: "-",
        },
        {
            key: 2,
            interviewDate: "2024-02-03",
            interviewer: "Emily Brown",
            forwardedDate: "2024-02-07",
            result: "Rejected",
            rejectionRemarks: "Communication skills need improvement",
        },
    ]);

    // Table columns for General Interview
    const generalInterviewColumns = [
        {
            title: "Interviewer",
            dataIndex: "interviewer",
            key: "interviewer",
        },
        {
            title: "Forwarded Date",
            dataIndex: "forwardedDate",
            key: "forwardedDate",
        },
        {
            title: "Result",
            dataIndex: "result",
            key: "result",
            render: (text) => (
                <span
                    className={
                        text === "Selected" ? "text-green-600" : "text-red-600"
                    }
                >
                    {text}
                </span>
            ),
        },
        {
            title: "Rejection Remarks",
            dataIndex: "rejectionRemarks",
            key: "rejectionRemarks",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit("general", record)}
                        className="text-blue-600 hover:text-blue-800"
                        disabled={isViewMode}
                    >
                        <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete("general", record.key)}
                        className="text-red-600 hover:text-red-800"
                        disabled={isViewMode}
                    >
                        <DeleteIcon className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    // Table columns for Interview 2
    const interview2Columns = [
        {
            title: "Interviewer",
            dataIndex: "interviewer",
            key: "interviewer",
        },
        {
            title: "Suitable Department",
            dataIndex: "suitableDepartment",
            key: "suitableDepartment",
        },
        {
            title: "Forwarded Date",
            dataIndex: "forwardedDate",
            key: "forwardedDate",
        },
        {
            title: "Rejection Remarks",
            dataIndex: "rejectionRemarks",
            key: "rejectionRemarks",
        },
        {
            title: "Result",
            dataIndex: "result",
            key: "result",
            render: (text) => (
                <span
                    className={
                        text === "Selected" ? "text-green-600" : "text-red-600"
                    }
                >
                    {text}
                </span>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit("interview2", record)}
                        className="text-blue-600 hover:text-blue-800"
                        disabled={isViewMode}
                    >
                        <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete("interview2", record.key)}
                        className="text-red-600 hover:text-red-800"
                        disabled={isViewMode}
                    >
                        <DeleteIcon className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    // Table columns for Interview 3
    const interview3Columns = [
        {
            title: "Interview Date",
            dataIndex: "interviewDate",
            key: "interviewDate",
        },
        {
            title: "Interviewer",
            dataIndex: "interviewer",
            key: "interviewer",
        },
        {
            title: "Forwarded Date",
            dataIndex: "forwardedDate",
            key: "forwardedDate",
        },
        {
            title: "Result",
            dataIndex: "result",
            key: "result",
            render: (text) => (
                <span
                    className={
                        text === "Selected" ? "text-green-600" : "text-red-600"
                    }
                >
                    {text}
                </span>
            ),
        },
        {
            title: "Rejection Remarks",
            dataIndex: "rejectionRemarks",
            key: "rejectionRemarks",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit("interview3", record)}
                        className="text-blue-600 hover:text-blue-800"
                        disabled={isViewMode}
                    >
                        <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete("interview3", record.key)}
                        className="text-red-600 hover:text-red-800"
                        disabled={isViewMode}
                    >
                        <DeleteIcon className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    // Handler functions
    const handleAdd = (type) => {
        console.log(`Add ${type}`);
        // Add your logic to add new items
    };

    const handleReset = (type) => {
        console.log(`Reset ${type}`);
        // Add your logic to reset the table data
        if (type === "general") {
            setGeneralInterview([]);
        } else if (type === "interview2") {
            setInterview2([]);
        } else if (type === "interview3") {
            setInterview3([]);
        }
    };

    const handleEdit = (type, record) => {
        console.log(`Edit ${type}:`, record);
        // Add your logic to edit items
    };

    const handleDelete = (type, key) => {
        console.log(`Delete ${type} with key:`, key);
        // Add your logic to delete items
        if (type === "general") {
            setGeneralInterview(
                generalInterview.filter((item) => item.key !== key)
            );
        } else if (type === "interview2") {
            setInterview2(interview2.filter((item) => item.key !== key));
        } else if (type === "interview3") {
            setInterview3(interview3.filter((item) => item.key !== key));
        }
    };

    return (
        <div className="space-y-6">
            {/* General Interview Section */}
            <div>
                <h4 className="text-md font-semibold text-gray-800 mb-3">
                    General Interview
                </h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    {!isViewMode && (
                        <div className="mb-4 space-x-3">
                            <TextButton
                                text="Add"
                                onClick={() => handleAdd("general")}
                            />
                            <TextButton
                                text="Reset"
                                onClick={() => handleReset("general")}
                            />
                        </div>
                    )}
                    <Table
                        dataSource={generalInterview}
                        columns={generalInterviewColumns}
                        pagination={false}
                        size="small"
                        className="bg-white"
                    />
                </div>
            </div>

            {/* Interview 2 Section */}
            <div>
                <h4 className="text-md font-semibold text-gray-800 mb-3">
                    Interview 2
                </h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    {!isViewMode && (
                        <div className="mb-4 space-x-3">
                            <TextButton
                                text="Add"
                                onClick={() => handleAdd("interview2")}
                            />
                            <TextButton
                                text="Reset"
                                onClick={() => handleReset("interview2")}
                            />
                        </div>
                    )}
                    <Table
                        dataSource={interview2}
                        columns={interview2Columns}
                        pagination={false}
                        size="small"
                        className="bg-white"
                    />
                </div>
            </div>

            {/* Interview 3 Section */}
            <div>
                <h4 className="text-md font-semibold text-gray-800 mb-3">
                    Interview 3
                </h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    {!isViewMode && (
                        <div className="mb-4 space-x-3">
                            <TextButton
                                text="Add"
                                onClick={() => handleAdd("interview3")}
                            />
                            <TextButton
                                text="Reset"
                                onClick={() => handleReset("interview3")}
                            />
                        </div>
                    )}
                    <Table
                        dataSource={interview3}
                        columns={interview3Columns}
                        pagination={false}
                        size="small"
                        className="bg-white"
                    />
                </div>
            </div>
        </div>
    );
}

export default InterviewDetailsModelContent;
