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
import { CalendarTab, LeavePageModels } from "../components/";
import CalendarModel from "../components/models/CalendarModel";
// import ExitedEmployeeTabs from "../components/Tabs/ExitedEmployeeTabs/ExitedEmployeeTabs";

function LeavesPage() {
    const [selectedTab, setSelectedTab] = useState(3);
    const [addEmployeeModelOpen, setAddEmployeeModelOpen] = useState(false);
    const [uploadEmployeeModelOpen, setUploadEmployeeModelOpen] = useState();
    const [calendarModelOpen, setCalendarModelOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null); 

    // Basic tabs example // each page add marzin top 3*0.25rem etc  px mt-3
    const tabs = [
        {
            label: "Employees",
            content: (
                // <EmployeesTabs
                //     setAddEmployeeModelOpen={setAddEmployeeModelOpen}
                //     setUploadEmployeeModelOpen={setUploadEmployeeModelOpen}
                // />
                <div>hello</div>
            ),
        },
        {
            label: "Work History",
            content: <div>hello</div>,
        },
        {
            label: "Edited Employees",
            content: <div>hello</div>,
        },
        {
            label: "Leave calender",
            content: <CalendarTab
            setCalendarModelOpen={setCalendarModelOpen}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            />,
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
            <LeavePageModels
                addEmployeeModelOpen={addEmployeeModelOpen}
                setAddEmployeeModelOpen={setAddEmployeeModelOpen}
                uploadEmployeeModelOpen={uploadEmployeeModelOpen}
                setUploadEmployeeModelOpen={setUploadEmployeeModelOpen}
            />
            <CalendarModel
                CalendarModelOpen={calendarModelOpen}
                setCalendarModelOpen={setCalendarModelOpen}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />
        </div>
    );
}

export default LeavesPage;
