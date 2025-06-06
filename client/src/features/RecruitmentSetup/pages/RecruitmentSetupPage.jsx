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
import CompanyStructureDetailsModel from "../components/models/CompanyStructureDetailsModel";

function RecruitmentSetupPage() {
    const [selectedTab, setSelectedTab] = useState(0);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [companyStructure, setCompanyStructure] = useState([]);
    const [openStructureModel, setOpenStructureModel] = useState(false);
    const [modelType, setModelType] = useState(""); // 'view', 'add', 'edit'

    // const [uploadEmployeeModelOpen, setUploadEmployeeModelOpen] =
    //     useState(false);

    const handleCloseStructureModel = useCallback(() => {
        setOpenStructureModel(false);
        setCompanyStructure([]);
        setModelType("");
    }, []);

    // Basic tabs example
    const tabs = [
        {
            label: "Employee Type",
            content: (
                <EmployeeTypeTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenStructureModel={setOpenStructureModel}
                    setCompanyStructure={setCompanyStructure}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Experience Levels",
            content: (
                <ExperienceLevelsTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenStructureModel={setOpenStructureModel}
                    setCompanyStructure={setCompanyStructure}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Designations",
            content: (
                <DesignationsTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenStructureModel={setOpenStructureModel}
                    setCompanyStructure={setCompanyStructure}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Skills",
            content: (
                <SkillsTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenStructureModel={setOpenStructureModel}
                    setCompanyStructure={setCompanyStructure}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Education Levels",
            content: (
                <EducationLevelsTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenStructureModel={setOpenStructureModel}
                    setCompanyStructure={setCompanyStructure}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Hiring Source",
            content: (
                <HiringSourceTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenStructureModel={setOpenStructureModel}
                    setCompanyStructure={setCompanyStructure}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Work Shift",
            content: (
                <WorkShiftTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenStructureModel={setOpenStructureModel}
                    setCompanyStructure={setCompanyStructure}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Job Locations Type",
            content: (
                <JobLocationsTypeTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenStructureModel={setOpenStructureModel}
                    setCompanyStructure={setCompanyStructure}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Hiring Stage",
            content: <>Add hear for add Hiring stage</>,
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
                companyStructure={companyStructure}
            />
            <CompanyStructureDetailsModel
                companyStructure={companyStructure}
                openStructureModel={openStructureModel}
                setOpenStructureModel={setOpenStructureModel}
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
