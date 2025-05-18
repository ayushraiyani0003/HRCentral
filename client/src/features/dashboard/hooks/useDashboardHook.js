import { useState } from "react";

const useEmployeeDashboardData = () => {
    const [data] = useState([
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
    ]);

    const [employeeData] = useState([
        { name: "Jan", payable: 1200, overtime: 300, expense: 250 },
        { name: "Feb", payable: 1500, overtime: 200, expense: 400 },
        { name: "Mar", payable: 1100, overtime: 400, expense: 300 },
        { name: "Apr", payable: 1300, overtime: 150, expense: 350 },
        { name: "May", payable: 1400, overtime: 250, expense: 200 },
        { name: "Jun", payable: 1600, overtime: 100, expense: 500 },
        { name: "Jul", payable: 1250, overtime: 350, expense: 280 },
        { name: "Aug", payable: 1550, overtime: 220, expense: 320 },
        { name: "Sup", payable: 1350, overtime: 180, expense: 400 },
        { name: "Act", payable: 1450, overtime: 270, expense: 330 },
        { name: "Nov", payable: 1200, overtime: 310, expense: 210 },
        { name: "Dec", payable: 1500, overtime: 230, expense: 390 },
    ]);

    const [attendanceData] = useState([
        { department: "HR", present: 85 },
        { department: "Engineering", present: 92 },
        { department: "Sales", present: 78 },
        { department: "Marketing", present: 88 },
        { department: "Finance", present: 90 },
        { department: "Legal", present: 83 },
        { department: "Operations", present: 87 },
        { department: "Customer Service", present: 80 },
        { department: "IT Support", present: 91 },
        { department: "R&D", present: 86 },
        { department: "QA", present: 89 },
        { department: "Procurement", present: 82 },
        { department: "Administration", present: 84 },
        { department: "Security", present: 93 },
        { department: "Training", present: 79 },
        { department: "Product", present: 88 },
        { department: "Logistics", present: 81 },
        { department: "Compliance", present: 90 },
        { department: "Strategy", present: 85 },
        { department: "Business Intelligence", present: 94 },
    ]);

    const [unitType] = useState("currency");
    const [attnUnitType] = useState("percent");
    const [legendPosition] = useState("topright");
    const [layout] = useState("horizontal");
    const [roundedBars] = useState(true);

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
        switch (attnUnitType) {
            case "currency":
                return `$${value.toLocaleString()}`;
            case "percent":
                return `${value}%`;
            default:
                return value;
        }
    };

    const customColors = ["#4A90E2", "#50E3C2", "#F5A623"];

    // i pass for the drag the component and this data is get from the database with Role
    // Dashboard layout state - you can customize this initial layout
        const [dashboardLayout, setDashboardLayout] = useState({
            main1: ["stats"],
            main2:["attendanceChart"],
            main3: ["salaryChart" ],
            main4:["recruiteeList"],
            main5:[""],
            main6: [],
            sidebar1: ["employmentStatus"],
            sidebar2: ["tasks", ],
            sidebar3: ["goals",],
            sidebar4: [],
            sidebar5: [],
            bottomZone1: [],
            bottomZone2: [],
            bottomZone3: [],
            bottomZone4: [],
            bottomZone5: [],
            bottomZone6: [],
        });

    return {
        data,
        employeeData,
        attendanceData,
        unitType,
        legendPosition,
        layout,
        roundedBars,
        tooltipFormatter,
        depTooltipFormatter,
        customColors,
        dashboardLayout,
        setDashboardLayout,
    };
};

export default useEmployeeDashboardData;
