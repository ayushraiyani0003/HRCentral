import React, { useState, useCallback } from "react";
import { CustomTabs, CustomTextInput, CustomModal } from "../../../components";
import {
    Home,
    Check,
    AlertCircle,
    User,
    Settings,
    Bell,
    Mail,
    Heart,
    Lock,
} from "lucide-react";
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
    const [rowData, setRowData] = useState([]);
    const [openAddEditModel, setOpenAddEditModel] = useState(false);
    const [modelType, setModelType] = useState(""); // 'view', 'add', 'edit'

    // const [uploadEmployeeModelOpen, setUploadEmployeeModelOpen] =
    //     useState(false);

    const handleCloseStructureModel = useCallback(() => {
        setOpenAddEditModel(false);
        setRowData([]);
        setModelType("");
    }, []);

    // Basic tabs example
    const tabs = [
        {
            label: "Employee Type",
            content: (
                <EmployeeTypeTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenAddEditModel={setOpenAddEditModel}
                    setRowData={setRowData}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Experience Levels",
            content: (
                <ExperienceLevelsTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenAddEditModel={setOpenAddEditModel}
                    setRowData={setRowData}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Designations",
            content: (
                <DesignationsTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenAddEditModel={setOpenAddEditModel}
                    setRowData={setRowData}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Skills",
            content: (
                <SkillsTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenAddEditModel={setOpenAddEditModel}
                    setRowData={setRowData}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Education Levels",
            content: (
                <EducationLevelsTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenAddEditModel={setOpenAddEditModel}
                    setRowData={setRowData}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Hiring Source",
            content: (
                <HiringSourceTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenAddEditModel={setOpenAddEditModel}
                    setRowData={setRowData}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Work Shift",
            content: (
                <WorkShiftTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenAddEditModel={setOpenAddEditModel}
                    setRowData={setRowData}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Job Locations Type",
            content: (
                <JobLocationsTypeTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenAddEditModel={setOpenAddEditModel}
                    setRowData={setRowData}
                    setModelType={setModelType}
                />
            ),
        },
    ];

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
            <DeleteConfirmationModel
                openDeleteModel={openDeleteModel}
                setOpenDeleteModel={setOpenDeleteModel}
                rowData={rowData}
            />
            <RecruitmentSetupModal
                companyStructure={rowData}
                openAddEditModel={openAddEditModel}
                setOpenAddEditModel={setOpenAddEditModel}
                modelType={modelType}
                existingStructures={[
                    { name: "Company", id: "company" },
                    { name: "Head Office", id: "head_office" },
                    { name: "Regional Office", v: "regional_office" },
                    { name: "Department", id: "department" },
                    { name: "Unit", id: "unit" },
                    { name: "Sub Unit", id: "sub_unit" },
                ]} // Array of existing structures for parent dropdown
                departmentHeads={[
                    { name: "Company", id: "company" },
                    { name: "Head Office", id: "head_office" },
                    { name: "Regional Office", id: "regional_office" },
                    { name: "Department", id: "department" },
                    { name: "Unit", id: "unit" },
                    { name: "Sub Unit", id: "sub_unit" },
                ]} // Array of department heads
                handleCloseStructureModel={handleCloseStructureModel}
            />
        </div>
    );
}

export default RecruitmentSetupPage;
