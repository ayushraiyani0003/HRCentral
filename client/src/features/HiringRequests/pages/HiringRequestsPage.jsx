import React, { useState, useCallback } from "react";
import { CustomTabs, CustomTextInput, CustomModal } from "../../../components";
import AllVacanciesTab from "../components/Tabs/AllVacanciesTab";
import OpenVacanciesTab from "../components/Tabs/OpenVacanciesTab";
import PendingApprovalTab from "../components/Tabs/PendingApprovalTab";
import ApprovedRequestsTab from "../components/Tabs/ApprovedRequestsTab";
import OnHoldTab from "../components/Tabs/OnHoldTab";
import CompletedVacanciesTab from "../components/Tabs/CompletedVacanciesTab";
import CancelledRequestsTab from "../components/Tabs/CancelledRequestsTab";
import ReportsAnalyticsTab from "../components/Tabs/ReportsAnalyticsTab";

function HiringRequestsPage() {
    const [selectedTab, setSelectedTab] = useState(0);

    const tabs = [
        {
            label: "All Requisition",
            content: <AllVacanciesTab />,
        },
        {
            label: "Open Requisition",
            content: <OpenVacanciesTab />,
        },
        {
            label: "Pending Approval",
            content: <PendingApprovalTab />,
        },
        {
            label: "Approved Requests",
            content: <ApprovedRequestsTab />,
        },
        {
            label: "On Hold",
            content: <OnHoldTab />,
        },
        {
            label: "Closed Vacancies",
            content: <CompletedVacanciesTab />,
        },
        {
            label: "Cancelled Requests",
            content: <CancelledRequestsTab />,
        },
        {
            label: "Reports & Analytics",
            content: <ReportsAnalyticsTab />,
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
            {/* <DeleteConfirmationModel
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
            /> */}
        </div>
    );
}

export default HiringRequestsPage;
