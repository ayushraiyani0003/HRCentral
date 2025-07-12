import React, { useState, useCallback } from "react";
import { CustomTabs } from "../../../components";
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
            id: "BankList",
            label: "Bank List",
            setupType: "BankList",
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
            setupType: "Country",
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
            setupType: "Salutation",
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

            <SetupModal
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

export default SetupPage;
