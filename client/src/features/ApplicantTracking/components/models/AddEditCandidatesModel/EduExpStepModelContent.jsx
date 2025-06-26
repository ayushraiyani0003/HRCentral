import React, { useState } from "react";
import { Table } from "antd";
import { TextButton } from "../../../../../components";
import {
    AddIcon,
    DeleteIcon,
    EditIcon,
    ViewIcon,
} from "../../../../../utils/SvgIcon";

import EduModel from "../EduModel";
import WorkHistoryModel from "../WorkHistoryModel";
import SkillModel from "../SkillModel";

function EduExpStepModelContent({ formData, handleInputChange, isViewMode }) {
    const [isEduFormOpen, setIsEduFormOpen] = useState(false);
    const [isWorkHisFormOpen, setIsWorkHisFormOpen] = useState(false);
    const [isSkillFormOpen, setIsSkillFormOpen] = useState(false);

    // Sample data for tables - you can replace with actual formData
    const [workHistory, setWorkHistory] = useState([
        {
            key: 1,
            jobTitle: "Software Developer",
            company: "Tech Corp",
            years: "2022-2024",
        },
        {
            key: 2,
            jobTitle: "Junior Developer",
            company: "StartUp Inc",
            years: "2020-2022",
        },
    ]);

    const [education, setEducation] = useState([
        {
            key: 1,
            institute: "ABC University",
            degree: "Bachelor of Computer Science",
            years: "2016-2020",
        },
        {
            key: 2,
            institute: "XYZ College",
            degree: "Diploma in IT",
            years: "2014-2016",
        },
    ]);

    const [skills, setSkills] = useState([
        {
            key: 1,
            skill: "React.js",
            years: "3 years",
        },
        {
            key: 2,
            skill: "Node.js",
            years: "2 years",
        },
        {
            key: 3,
            skill: "Python",
            years: "4 years",
        },
    ]);

    // Table columns for Work History
    const workHistoryColumns = [
        {
            title: "Job Title",
            dataIndex: "jobTitle",
            key: "jobTitle",
        },
        {
            title: "Company",
            dataIndex: "company",
            key: "company",
        },
        {
            title: "Years",
            dataIndex: "years",
            key: "years",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit("work", record)}
                        className="text-blue-600 hover:text-blue-800"
                        disabled={isViewMode}
                    >
                        <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete("work", record.key)}
                        className="text-red-600 hover:text-red-800"
                        disabled={isViewMode}
                    >
                        <DeleteIcon className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    // Table columns for Education
    const educationColumns = [
        {
            title: "Institute",
            dataIndex: "institute",
            key: "institute",
        },
        {
            title: "Degree/Diploma",
            dataIndex: "degree",
            key: "degree",
        },
        {
            title: "Years",
            dataIndex: "years",
            key: "years",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit("education", record)}
                        className="text-blue-600 hover:text-blue-800"
                        disabled={isViewMode}
                    >
                        <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete("education", record.key)}
                        className="text-red-600 hover:text-red-800"
                        disabled={isViewMode}
                    >
                        <DeleteIcon className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    // Table columns for Skills
    const skillsColumns = [
        {
            title: "Skill",
            dataIndex: "skill",
            key: "skill",
        },
        {
            title: "Experience",
            dataIndex: "years",
            key: "years",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit("skills", record)}
                        className="text-blue-600 hover:text-blue-800"
                        disabled={isViewMode}
                    >
                        <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete("skills", record.key)}
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
        // Debug only
        console.log(`Add ${type}`);
        // Add your logic to add new items
        // TODO: open the model for the seperate form
        // if type is education open the education model
        if (type === "education") {
            setIsEduFormOpen(true);
        }
        if (type === "work") {
            setIsWorkHisFormOpen(true);
        }
        if (type === "skills") {
            setIsSkillFormOpen(true);
        }
    };

    const handleReset = (type) => {
        // Debug only
        console.log(`Reset ${type}`);
        // Add your logic to reset the table data
        if (type === "work") {
            setWorkHistory([]);
        } else if (type === "education") {
            setEducation([]);
        } else if (type === "skills") {
            setSkills([]);
        }
    };

    const handleEdit = (type, record) => {
        // Debug only
        console.log(`Edit ${type}:`, record);
        // Add your logic to edit items

        // TODO: open the model for the seperate form
        // if type is education open the education model
        if (type === "education") {
            setIsEduFormOpen(true);
        }
        if (type === "work") {
            setIsWorkHisFormOpen(true);
        }
        if (type === "skills") {
            setIsSkillFormOpen(true);
        }
    };

    const handleDelete = (type, key) => {
        // Debug only
        console.log(`Delete ${type} with key:`, key);
        // Add your logic to delete items
        if (type === "work") {
            setWorkHistory(workHistory.filter((item) => item.key !== key));
        } else if (type === "education") {
            setEducation(education.filter((item) => item.key !== key));
        } else if (type === "skills") {
            setSkills(skills.filter((item) => item.key !== key));
        }
    };

    return (
        <div className="space-y-6">
            {/* Resume & Profile Section */}
            <div>
                <div className="grid grid-cols-1 gap-4">
                    {/* Resume Upload */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Resume
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) =>
                                handleInputChange("resume", e.target.files[0])
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isViewMode}
                        />
                    </div>

                    {/* Profile Summary */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Summary
                        </label>
                        <textarea
                            value={formData.profileSummary || ""}
                            onChange={(e) =>
                                handleInputChange(
                                    "profileSummary",
                                    e.target.value
                                )
                            }
                            placeholder="Brief summary of your professional background..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                            disabled={isViewMode}
                        />
                    </div>
                </div>
            </div>

            {/* Experience Details Section */}
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Total Experience Dropdown */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total Experience
                        </label>
                        <select
                            value={formData.totalExperience || ""}
                            onChange={(e) =>
                                handleInputChange(
                                    "totalExperience",
                                    e.target.value
                                )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isViewMode}
                        >
                            <option value="">Select experience</option>
                            <option value="0">Fresher</option>
                            <option value="1">1 year</option>
                            <option value="2">2 years</option>
                            <option value="3">3 years</option>
                            <option value="4">4 years</option>
                            <option value="5+">5+ years</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Work History Section */}
            <div>
                <h4 className="text-md font-semibold text-gray-800 mb-3">
                    Work History
                </h4>
                <p>
                    job title, company, from year, to year, current work hear
                    *check box* , other details
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    {!isViewMode && (
                        <div className="mb-4 space-x-3">
                            <TextButton
                                text="Add"
                                onClick={() => handleAdd("work")}
                            />
                            <TextButton
                                text="Reset"
                                onClick={() => handleReset("work")}
                            />
                        </div>
                    )}
                    <Table
                        dataSource={workHistory}
                        columns={workHistoryColumns}
                        pagination={false}
                        size="small"
                        className="bg-white"
                    />
                </div>
            </div>

            {/* Education Section */}
            <div>
                <h4 className="text-md font-semibold text-gray-800 mb-3">
                    Education
                </h4>
                <p>
                    institute, degree/diploma, from year, to year, result, is
                    current study hear.{" "}
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    {!isViewMode && (
                        <div className="mb-4 space-x-3">
                            <TextButton
                                text="Add"
                                onClick={() => handleAdd("education")}
                            />
                            <TextButton
                                text="Reset"
                                onClick={() => handleReset("education")}
                            />
                        </div>
                    )}
                    <Table
                        dataSource={education}
                        columns={educationColumns}
                        pagination={false}
                        size="small"
                        className="bg-white"
                    />
                </div>
            </div>

            {/* Skills Section */}
            <div>
                <h4 className="text-md font-semibold text-gray-800 mb-3">
                    Skills
                </h4>
                <p>in this name of skill and experience of year </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    {!isViewMode && (
                        <div className="mb-4 space-x-3">
                            <TextButton
                                text="Add"
                                onClick={() => handleAdd("skills")}
                            />
                            <TextButton
                                text="Reset"
                                onClick={() => handleReset("skills")}
                            />
                        </div>
                    )}
                    <Table
                        dataSource={skills}
                        columns={skillsColumns}
                        pagination={false}
                        size="small"
                        className="bg-white"
                    />
                </div>
            </div>
            <EduModel
                isFormOpen={isEduFormOpen}
                setIsFormOpen={setIsEduFormOpen}
            />
            <WorkHistoryModel
                isFormOpen={isWorkHisFormOpen}
                setIsFormOpen={setIsWorkHisFormOpen}
            />
            <SkillModel
                isFormOpen={isSkillFormOpen}
                setIsFormOpen={setIsSkillFormOpen}
            />
        </div>
    );
}

export default EduExpStepModelContent;
