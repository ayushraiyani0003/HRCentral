import React, { useState } from "react";
import {
    PayRollChartCard,
    StatCards,
    TaskCard,
    TaskPanel,
} from "../components/";
import { CustomBarChart } from "../../../components";

function DashboardPage() {
    const data = [
        {
            date: "26-03-2025",
            todayTotalEmployees: 115,
            newJoined: 1,
            resigned: 0,
            jobApplicants: 10,
        },
        {
            date: "27-03-2025",
            todayTotalEmployees: 116,
            newJoined: 1,
            resigned: 0,
            jobApplicants: 12,
        },
        {
            date: "28-03-2025",
            todayTotalEmployees: 116,
            newJoined: 0,
            resigned: 0,
            jobApplicants: 8,
        },
        {
            date: "29-03-2025",
            todayTotalEmployees: 116,
            newJoined: 0,
            resigned: 0,
            jobApplicants: 9,
        },
        {
            date: "30-03-2025",
            todayTotalEmployees: 116,
            newJoined: 0,
            resigned: 0,
            jobApplicants: 7,
        },
        {
            date: "31-03-2025",
            todayTotalEmployees: 117,
            newJoined: 1,
            resigned: 0,
            jobApplicants: 11,
        },
        {
            date: "01-04-2025",
            todayTotalEmployees: 117,
            newJoined: 0,
            resigned: 0,
            jobApplicants: 13,
        },
        {
            date: "02-04-2025",
            todayTotalEmployees: 117,
            newJoined: 0,
            resigned: 0,
            jobApplicants: 6,
        },
        {
            date: "03-04-2025",
            todayTotalEmployees: 118,
            newJoined: 1,
            resigned: 0,
            jobApplicants: 14,
        },
        {
            date: "04-04-2025",
            todayTotalEmployees: 118,
            newJoined: 0,
            resigned: 0,
            jobApplicants: 9,
        },
        {
            date: "05-04-2025",
            todayTotalEmployees: 119,
            newJoined: 1,
            resigned: 0,
            jobApplicants: 8,
        },
        {
            date: "06-04-2025",
            todayTotalEmployees: 119,
            newJoined: 0,
            resigned: 0,
            jobApplicants: 12,
        },
        {
            date: "07-04-2025",
            todayTotalEmployees: 119,
            newJoined: 0,
            resigned: 0,
            jobApplicants: 10,
        },
        {
            date: "08-04-2025",
            todayTotalEmployees: 119,
            newJoined: 0,
            resigned: 0,
            jobApplicants: 7,
        },
        {
            date: "09-04-2025",
            todayTotalEmployees: 119,
            newJoined: 0,
            resigned: 0,
            jobApplicants: 13,
        },
        {
            date: "10-04-2025",
            todayTotalEmployees: 119,
            newJoined: 0,
            resigned: 0,
            jobApplicants: 11,
        },
        {
            date: "11-04-2025",
            todayTotalEmployees: 120,
            newJoined: 1,
            resigned: 0,
            jobApplicants: 10,
        },
        {
            date: "12-04-2025",
            todayTotalEmployees: 120,
            newJoined: 0,
            resigned: 0,
            jobApplicants: 9,
        },
        {
            date: "13-04-2025",
            todayTotalEmployees: 120,
            newJoined: 0,
            resigned: 0,
            jobApplicants: 12,
        },
        {
            date: "14-04-2025",
            todayTotalEmployees: 120,
            newJoined: 0,
            resigned: 0,
            jobApplicants: 10,
        },
        {
            date: "15-04-2025",
            todayTotalEmployees: 120,
            newJoined: 0,
            resigned: 0,
            jobApplicants: 11,
        },
        {
            date: "16-04-2025",
            todayTotalEmployees: 120,
            newJoined: 2,
            resigned: 0,
            jobApplicants: 13,
        },
        {
            date: "17-04-2025",
            todayTotalEmployees: 121,
            newJoined: 2,
            resigned: 1,
            jobApplicants: 6,
        },
        {
            date: "18-04-2025",
            todayTotalEmployees: 122,
            newJoined: 2,
            resigned: 1,
            jobApplicants: 8,
        },
        {
            date: "19-04-2025",
            todayTotalEmployees: 122,
            newJoined: 1,
            resigned: 1,
            jobApplicants: 7,
        },
        {
            date: "20-04-2025",
            todayTotalEmployees: 121,
            newJoined: 0,
            resigned: 1,
            jobApplicants: 13,
        },
        {
            date: "21-04-2025",
            todayTotalEmployees: 121,
            newJoined: 1,
            resigned: 1,
            jobApplicants: 12,
        },
        {
            date: "22-04-2025",
            todayTotalEmployees: 122,
            newJoined: 2,
            resigned: 1,
            jobApplicants: 9,
        },
        {
            date: "23-04-2025",
            todayTotalEmployees: 124,
            newJoined: 3,
            resigned: 1,
            jobApplicants: 8,
        },
        {
            date: "24-04-2025",
            todayTotalEmployees: 126,
            newJoined: 2,
            resigned: 0,
            jobApplicants: 13,
        },
        {
            date: "25-04-2025",
            todayTotalEmployees: 128,
            newJoined: 2,
            resigned: 0,
            jobApplicants: 12,
        },
        {
            date: "26-04-2025",
            todayTotalEmployees: 130,
            newJoined: 2,
            resigned: 0,
            jobApplicants: 5,
        },
        {
            date: "27-04-2025",
            todayTotalEmployees: 131,
            newJoined: 1,
            resigned: 0,
            jobApplicants: 9,
        },
        {
            date: "28-04-2025",
            todayTotalEmployees: 132,
            newJoined: 1,
            resigned: 0,
            jobApplicants: 11,
        },
        {
            date: "29-04-2025",
            todayTotalEmployees: 132,
            newJoined: 0,
            resigned: 0,
            jobApplicants: 6,
        },
        {
            date: "30-04-2025",
            todayTotalEmployees: 133,
            newJoined: 1,
            resigned: 0,
            jobApplicants: 11,
        },
        {
            date: "01-05-2025",
            todayTotalEmployees: 137,
            newJoined: 1,
            resigned: 1,
            jobApplicants: 6,
        },
        {
            date: "02-05-2025",
            todayTotalEmployees: 137,
            newJoined: 1,
            resigned: 1,
            jobApplicants: 6,
        },
        {
            date: "03-05-2025",
            todayTotalEmployees: 137,
            newJoined: 1,
            resigned: 1,
            jobApplicants: 6,
        },
        {
            date: "04-05-2025",
            todayTotalEmployees: 137,
            newJoined: 1,
            resigned: 1,
            jobApplicants: 6,
        },
        {
            date: "05-05-2025",
            todayTotalEmployees: 137,
            newJoined: 1,
            resigned: 1,
            jobApplicants: 6,
        },
        {
            date: "06-05-2025",
            todayTotalEmployees: 137,
            newJoined: 1,
            resigned: 1,
            jobApplicants: 6,
        },
        {
            date: "07-05-2025",
            todayTotalEmployees: 137,
            newJoined: 1,
            resigned: 1,
            jobApplicants: 6,
        },
        {
            date: "08-05-2025",
            todayTotalEmployees: 137,
            newJoined: 1,
            resigned: 1,
            jobApplicants: 6,
        },
        {
            date: "09-05-2025",
            todayTotalEmployees: 137,
            newJoined: 1,
            resigned: 1,
            jobApplicants: 6,
        },
        {
            date: "10-05-2025",
            todayTotalEmployees: 137,
            newJoined: 1,
            resigned: 1,
            jobApplicants: 6,
        },
        {
            date: "11-05-2025",
            todayTotalEmployees: 137,
            newJoined: 1,
            resigned: 1,
            jobApplicants: 6,
        },
        {
            date: "12-05-2025",
            todayTotalEmployees: 137,
            newJoined: 1,
            resigned: 1,
            jobApplicants: 6,
        },
        {
            date: "13-05-2025",
            todayTotalEmployees: 137,
            newJoined: 1,
            resigned: 1,
            jobApplicants: 6,
        },
        {
            date: "14-05-2025",
            todayTotalEmployees: 137,
            newJoined: 1,
            resigned: 1,
            jobApplicants: 6,
        },
        {
            date: "15-05-2025",
            todayTotalEmployees: 137,
            newJoined: 1,
            resigned: 1,
            jobApplicants: 6,
        },
    ];

    const [employeeData] = useState([
        { name: "John", payable: 1200, overtime: 300, expense: 250 },
        { name: "Sarah", payable: 1500, overtime: 200, expense: 400 },
        { name: "Mike", payable: 1100, overtime: 400, expense: 300 },
        { name: "Anna", payable: 1300, overtime: 150, expense: 350 },
        { name: "David", payable: 1400, overtime: 250, expense: 200 },
        { name: "Emily", payable: 1600, overtime: 100, expense: 500 },
        { name: "James", payable: 1250, overtime: 350, expense: 280 },
        { name: "Olivia", payable: 1550, overtime: 220, expense: 320 },
        { name: "Liam", payable: 1350, overtime: 180, expense: 400 },
        { name: "Sophia", payable: 1450, overtime: 270, expense: 330 },
        { name: "Daniel", payable: 1200, overtime: 310, expense: 210 },
        { name: "Chloe", payable: 1500, overtime: 230, expense: 390 },
    ]);

    const [attendanceData] = useState([
        { department: "HR", present: 85, },
        { department: "Engineering", present: 92,  },
        { department: "Sales", present: 78,  },
        { department: "Marketing", present: 88, },
        { department: "Finance", present: 90,  },
        { department: "Legal", present: 83,  },
        { department: "Operations", present: 87,  },
        { department: "Customer Service", present: 80,  },
        { department: "IT Support", present: 91,  },
        { department: "R&D", present: 86,  },
        { department: "QA", present: 89,  },
        { department: "Procurement", present: 82, },
        { department: "Administration", present: 84,  },
        { department: "Security", present: 93,  },
        { department: "Training", present: 79,  },
        { department: "Product", present: 88,  },
        { department: "Logistics", present: 81,  },
        { department: "Compliance", present: 90,  },
        { department: "Strategy", present: 85,  },
        { department: "Business Intelligence", present: 94, },
    ]);
    
    // Example of different unit types
    const [unitType] = useState("currency");
    const [attnunitType] = useState("percent");

    // Legend position state
    const [legendPosition] = useState("topright");

    // Chart orientation
    const [layout] = useState("horizontal");

    // Bar styling
    const [roundedBars] = useState(true);

    // Custom tooltip formatter
    const tooltipFormatter = (value) => {
        switch (unitType) {
            case "currency":
                return `$${value.toLocaleString()}`;
            case "percent":
                return `${value}%`;
            default:
                return value;
        }
    };
    const depTooltipFormatter = (value) => {
        switch (attnunitType) {
            case "currency":
                return `$${value.toLocaleString()}`;
            case "percent":
                return `${value}%`;
            default:
                return value;
        }
    };
    const customColors = [
        "#4A90E2", // calm blue
        "#50E3C2", // soft teal
        "#F5A623", // warm golden orange
    ];

    return (
        <div className="w-full p-0">
            <div className="w-full flex flex-col md:flex-row gap-3">
                <div className="w-full md:w-2/3 lg:w-3/4 gap-3 flex flex-col">
                    <StatCards
                        className="w-full h-full !m-0 !shadow-none"
                        employeesTrack={data}
                        yesterdayAttendance={600}
                    />

                    <div className="flex flex-row gap-3">
                        <div className="w-full md:w-1/2">
                            <PayRollChartCard
                                employeeData={employeeData}
                                unitType={unitType}
                                customColors={customColors}
                                legendPosition={legendPosition}
                                layout={layout}
                                roundedBars={roundedBars}
                                tooltipFormatter={tooltipFormatter}
                                keys={["payable", "overtime", "expense"]}
                                xAxisLabel={"Employees"}
                                labelKey={"name"}
                                yDomain={[0, "auto"]}
                            />
                        </div>
                        <div className="w-full md:w-1/2">
                            <PayRollChartCard
                                employeeData={attendanceData}
                                unitType={"percent"}
                                customColors={customColors}
                                legendPosition={legendPosition}
                                layout={layout}
                                roundedBars={roundedBars}
                                tooltipFormatter={depTooltipFormatter}
                                keys={["present", "absent"]}
                                xAxisLabel={"department"}
                                labelKey={"department"}
                                yDomain={[0, 120]}
                            />
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3 lg:w-1/4 mt-3 md:mt-0 overflow-hidden">
                    <TaskCard className="w-full h-full" />
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
