import React, { useState } from "react";
import { CustomTabs, CustomTextInput } from "../../../components";
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
import { EmployeesTabs, WorkHistoryTabs } from "../components/";
import ExitedEmployeeTabs from "../components/Tabs/ExitedEmployeeTabs/ExitedEmployeeTabs";

function EmployeePage() {
    const [selectedTab, setSelectedTab] = useState(1);

    // Basic tabs example
    const tabs = [
        {
            label: "Employees",
            content: <EmployeesTabs />,
        },
        {
            label: "Work History",
            content: (
                <WorkHistoryTabs />
            ),
        },
        {
            label: "Edited Employees",
            content: (<ExitedEmployeeTabs />
            ),
        },
    ];

    return (
        <div className="p-0 mx-auto space-y-12">
            {/* Basic tabs with indicator */}
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
            </div>
        </div>
    );
}

export default EmployeePage;
