import React, { useState, useCallback } from "react";
import { CustomTabs } from "../../../components";
import DesignationsTab from "../components/Tabs/DesignationsTab";
import EducationLevelsTab from "../components/Tabs/EducationLevelsTab";
import EmployeeTypeTab from "../components/Tabs/EmployeeTypeTab";
import ExperienceLevelsTab from "../components/Tabs/ExperienceLevelsTab";
import HiringSourceTab from "../components/Tabs/HiringSourceTab";
import JobLocationsTypeTab from "../components/Tabs/JobLocationsTypeTab";
import WorkShiftTab from "../components/Tabs/WorkShiftTab";
import SkillsTab from "../components/Tabs/SkillsTab";

import DeleteConfirmationModel from "../components/models/DeleteConfirmationModel";
import RecruitmentSetupModal from "../components/models/recruitmentSetupModel";

function RecruitmentSetupPage() {
    const [selectedTab, setSelectedTab] = useState(0);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [rowData, setRowData] = useState(null);
    const [openAddEditModel, setOpenAddEditModel] = useState(false);
    const [modelType, setModelType] = useState(""); // 'view', 'add', 'edit'
    const [crudHandlers, setCrudHandlers] = useState({});

    const handleCloseStructureModel = useCallback(() => {
        setOpenAddEditModel(false);
        setRowData(null);
        setModelType("");
    }, []);

    // Function to receive CRUD handlers from tabs - now merges instead of overriding
    const setCrudHandlersForTab = useCallback((handlers) => {
        setCrudHandlers((prevHandlers) => ({
            ...prevHandlers,
            ...(handlers || {}),
        }));
    }, []);

    const tabs = [
        {
            id: "EmployeeType",
            label: "Employee Type",
            setupType: "EmployeeType",
            content: (
                <EmployeeTypeTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenAddEditModel={setOpenAddEditModel}
                    setRowData={setRowData}
                    setModelType={setModelType}
                    setCrudHandlers={setCrudHandlersForTab}
                />
            ),
        },
        {
            id: "ExperienceLevels",
            label: "Experience Levels",
            setupType: "ExperienceLevels",
            content: (
                <ExperienceLevelsTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenAddEditModel={setOpenAddEditModel}
                    setRowData={setRowData}
                    setModelType={setModelType}
                    setCrudHandlers={setCrudHandlersForTab}
                />
            ),
        },
        {
            id: "Designations",
            label: "Designations",
            setupType: "Designations",
            content: (
                <DesignationsTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenAddEditModel={setOpenAddEditModel}
                    setRowData={setRowData}
                    setModelType={setModelType}
                    setCrudHandlers={setCrudHandlersForTab}
                />
            ),
        },
        {
            id: "Skills",
            label: "Skills",
            setupType: "Skills",
            content: (
                <SkillsTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenAddEditModel={setOpenAddEditModel}
                    setRowData={setRowData}
                    setModelType={setModelType}
                    setCrudHandlers={setCrudHandlersForTab}
                />
            ),
        },
        {
            id: "EducationLevels",
            label: "Education Levels",
            setupType: "EducationLevels",
            content: (
                <EducationLevelsTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenAddEditModel={setOpenAddEditModel}
                    setRowData={setRowData}
                    setModelType={setModelType}
                    setCrudHandlers={setCrudHandlersForTab}
                />
            ),
        },
        {
            id: "HiringSource",
            label: "Hiring Source",
            setupType: "HiringSources",
            content: (
                <HiringSourceTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenAddEditModel={setOpenAddEditModel}
                    setRowData={setRowData}
                    setModelType={setModelType}
                    setCrudHandlers={setCrudHandlersForTab}
                />
            ),
        },
        {
            id: "WorkShift",
            label: "Work Shift",
            setupType: "WorkShift",
            content: (
                <WorkShiftTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenAddEditModel={setOpenAddEditModel}
                    setRowData={setRowData}
                    setModelType={setModelType}
                    setCrudHandlers={setCrudHandlersForTab}
                />
            ),
        },
        {
            id: "JobLocationsType",
            label: "Job Locations Type",
            setupType: "JobLocationsTypes",
            content: (
                <JobLocationsTypeTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenAddEditModel={setOpenAddEditModel}
                    setRowData={setRowData}
                    setModelType={setModelType}
                    setCrudHandlers={setCrudHandlersForTab}
                />
            ),
        },
    ];

    const currentSetupType = tabs[selectedTab].setupType;

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <CustomTabs
                tabs={tabs}
                defaultActiveTab={selectedTab}
                variant="indicator"
                onChange={setSelectedTab}
                indicatorColor="#4A90E2"
                activeTabStyle={{ color: "#4A90E2" }}
                contentStyle={{ marginTop: "0.2rem" }}
                contentClassName={"min-h-[760px]"}
            />

            <RecruitmentSetupModal
                rowData={rowData}
                openAddEditModel={openAddEditModel}
                setOpenAddEditModel={setOpenAddEditModel}
                modelType={modelType}
                handleCloseModel={handleCloseStructureModel}
                setupType={currentSetupType}
                crudHandlers={crudHandlers}
            />

            <DeleteConfirmationModel
                openDeleteModel={openDeleteModel}
                setOpenDeleteModel={setOpenDeleteModel}
                rowData={rowData}
                setupType={currentSetupType}
            />
        </div>
    );
}

export default RecruitmentSetupPage;
