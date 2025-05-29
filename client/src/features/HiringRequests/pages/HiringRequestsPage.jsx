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
import DeleteConfirmationModel from "../components/Models/DeleteConfirmationModel";
import RequisitionModel from "../components/Models/RequisitionModel";

function HiringRequestsPage() {
    const [selectedTab, setSelectedTab] = useState(0);

    // Modal states
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [requisitionModel, setRequisitionModel] = useState(false);
    const [requisitionData, setRequisitionData] = useState(null);
    const [modelType, setModelType] = useState(""); // 'view', 'add', 'edit'

    const handleCloseStructureModel = useCallback(() => {
        setRequisitionModel(false);
        setRequisitionData(null);
        setModelType("");
    }, []);

    const handleCloseDeleteModel = useCallback(() => {
        setOpenDeleteModel(false);
        setRequisitionData(null);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (requisitionData) {
            console.log("Deleting Requisition:", requisitionData);
            // Add your delete logic here
            // You might want to call an API endpoint to delete the record

            // Close the modal after deletion
            handleCloseDeleteModel();

            // You might want to refresh the data or show a success message
            // toast.success("Record deleted successfully");
        }
    }, [requisitionData, handleCloseDeleteModel]);

    const tabs = [
        {
            label: "All Requisition",
            content: (
                <AllVacanciesTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setRequisitionData={setRequisitionData}
                    setRequisitionModel={setRequisitionModel}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Open Requisition",
            content: (
                <OpenVacanciesTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setRequisitionData={setRequisitionData}
                    setRequisitionModel={setRequisitionModel}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Pending Approval",
            content: (
                <PendingApprovalTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setRequisitionData={setRequisitionData}
                    setRequisitionModel={setRequisitionModel}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Approved Requests",
            content: (
                <ApprovedRequestsTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setRequisitionData={setRequisitionData}
                    setRequisitionModel={setRequisitionModel}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "On Hold",
            content: (
                <OnHoldTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setRequisitionData={setRequisitionData}
                    setRequisitionModel={setRequisitionModel}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Closed Vacancies",
            content: (
                <CompletedVacanciesTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setRequisitionData={setRequisitionData}
                    setRequisitionModel={setRequisitionModel}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Cancelled Requests",
            content: (
                <CancelledRequestsTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setRequisitionData={setRequisitionData}
                    setRequisitionModel={setRequisitionModel}
                    setModelType={setModelType}
                />
            ),
        },
        {
            label: "Reports & Analytics",
            content: (
                <ReportsAnalyticsTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setRequisitionData={setRequisitionData}
                    setRequisitionModel={setRequisitionModel}
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

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModel
                openDeleteModel={openDeleteModel}
                setOpenDeleteModel={handleCloseDeleteModel}
                requisition={requisitionData}
                onConfirmDelete={handleConfirmDelete}
            />

            {/* Requisition Modal for View/Add/Edit */}
            <RequisitionModel
                requisition={requisitionData}
                requisitionModel={requisitionModel}
                setRequisitionModel={handleCloseStructureModel}
                modelType={modelType}
                departments={[
                    { name: "Company", id: "company" },
                    { name: "Head Office", id: "head_office" },
                    { name: "Regional Office", id: "regional_office" },
                    { name: "Department", id: "department" },
                    { name: "Unit", id: "unit" },
                    { name: "Sub Unit", id: "sub_unit" },
                    { name: "Eng", id: "eng" },
                ]} // Array of existing structures for parent dropdown
                designations={[
                    { name: "John Smith", id: "john_smith" },
                    { name: "Emily Davis", id: "emily_davis" },
                    { name: "David Brown", id: "david_brown" },
                    { name: "Lisa Turner", id: "lisa_turner" },
                    { name: "Andrew Wilson", id: "andrew_wilson" },
                    { name: "it", id: "it" },
                ]} // Array of department heads
                handleCloseStructureModel={handleCloseStructureModel}
                employees={[
                    { name: "John Smith", id: "john_smith" },
                    { name: "Emily Davis", id: "emily_davis" },
                    { name: "David Brown", id: "david_brown" },
                    { name: "Lisa Turner", id: "lisa_turner" },
                    { name: "Andrew Wilson", id: "andrew_wilson" },
                ]} // Array of department heads
            />
        </div>
    );
}

export default HiringRequestsPage;
