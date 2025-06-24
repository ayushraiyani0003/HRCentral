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
import BankListTab from "../components/Tabs/BankListTab";
import CountryTab from "../components/Tabs/CountryTab";
import SalutationTab from "../components/Tabs/SalutationTab";
import DeleteConfirmationModel from "../components/models/DeleteConfirmationModel";
import SetupModal from "../components/models/SetupModel";

function SetupPage() {
    const [selectedTab, setSelectedTab] = useState(0);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [rowData, setRowData] = useState(null);
    const [openAddEditModel, setOpenAddEditModel] = useState(false);
    const [modelType, setModelType] = useState(""); // 'view', 'add', 'edit'

    // Store CRUD handlers from the current tab
    const [crudHandlers, setCrudHandlers] = useState({});

    console.log("rowData", rowData);
    console.log("openDeleteModel", openDeleteModel);
    console.log("openAddEditModel", openAddEditModel);
    console.log("modelType", modelType);

    const handleCloseStructureModel = useCallback(() => {
        setOpenAddEditModel(false);
        setRowData(null);
        setModelType("");
    }, []);

    // Function to receive CRUD handlers from tabs
    const setCrudHandlersForTab = useCallback((handlers) => {
        setCrudHandlers(handlers);
    }, []);

    // Basic tabs example
    const tabs = [
        {
            id: "BankList",
            label: "Bank List",
            content: (
                <BankListTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenAddEditModel={setOpenAddEditModel}
                    setRowData={setRowData}
                    setModelType={setModelType}
                    setCrudHandlers={setCrudHandlersForTab}
                />
            ),
        },
        {
            id: "Country",
            label: "Country",
            content: (
                <CountryTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenAddEditModel={setOpenAddEditModel}
                    setRowData={setRowData}
                    setModelType={setModelType}
                    setCrudHandlers={setCrudHandlersForTab}
                />
            ),
        },
        {
            id: "Salutation",
            label: "Salutation",
            content: (
                <SalutationTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenAddEditModel={setOpenAddEditModel}
                    setRowData={setRowData}
                    setModelType={setModelType}
                    setCrudHandlers={setCrudHandlersForTab}
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
            <SetupModal
                rowData={rowData}
                openAddEditModel={openAddEditModel}
                setOpenAddEditModel={setOpenAddEditModel}
                modelType={modelType}
                handleCloseModel={handleCloseStructureModel}
                setupType={tabs[selectedTab].label}
                // Pass CRUD handlers
                handleCreateCountry={crudHandlers.handleCreateCountry}
                handleUpdateCountry={crudHandlers.handleUpdateCountry}
                // Add other CRUD handlers as needed
                handleCreateBank={crudHandlers.handleCreateBank}
                handleUpdateBank={crudHandlers.handleUpdateBank}
                handleCreateSalutation={crudHandlers.handleCreateSalutation}
                handleUpdateSalutation={crudHandlers.handleUpdateSalutation}
            />
            <DeleteConfirmationModel
                openDeleteModel={openDeleteModel}
                setOpenDeleteModel={setOpenDeleteModel}
                rowData={rowData}
                // Pass delete handler
                handleDelete={
                    crudHandlers.handleDeleteCountry ||
                    crudHandlers.handleDeleteBank ||
                    crudHandlers.handleDeleteSalutation
                }
            />
        </div>
    );
}

export default SetupPage;
