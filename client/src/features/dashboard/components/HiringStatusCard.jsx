import React, { useState, useEffect } from "react";
import { CustomContainer, CustomDropdown, CustomBarChart } from "../../../components";

function HiringStatusCard({ className = "" }) {
    const [timePeriod, setTimePeriod] = useState("thisMonth");
    const [employeeData, setEmployeeData] = useState([]);

    // Dropdown options
    const timePeriodOptions = [
        { label: "Today", value: "today" },
        { label: "Yesterday", value: "yesterday" },
        { label: "This Week", value: "thisWeek" },
        { label: "Last Week", value: "lastWeek" },
        { label: "This Month", value: "thisMonth" },
        { label: "Last Month", value: "lastMonth" },
        { label: "This Year", value: "thisYear" },
        { label: "Last Year", value: "lastYear" }
    ];

    // Simulated data for each time period
const hiringStageData = {
    today: [
        { state: "Applicant", count: 10 },
        { state: "Interviewing", count: 5 },
        { state: "Hired", count: 2 },
        { state: "Rejected", count: 3 },
        { state: "Early Left", count: 1 }
    ],
    yesterday: [
        { state: "Applicant", count: 12 },
        { state: "Interviewing", count: 6 },
        { state: "Hired", count: 3 },
        { state: "Rejected", count: 4 },
        { state: "Early Left", count: 2 }
    ],
    thisWeek: [
        { state: "Applicant", count: 60 },
        { state: "Interviewing", count: 30 },
        { state: "Hired", count: 12 },
        { state: "Rejected", count: 10 },
        { state: "Early Left", count: 3 }
    ],
    lastWeek: [
        { state: "Applicant", count: 55 },
        { state: "Interviewing", count: 25 },
        { state: "Hired", count: 15 },
        { state: "Rejected", count: 8 },
        { state: "Early Left", count: 4 }
    ],
    thisMonth: [
        { state: "Applicant", count: 150 },
        { state: "Interviewing", count: 80 },
        { state: "Hired", count: 35 },
        { state: "Rejected", count: 20 },
        { state: "Early Left", count: 5 }
    ],
    lastMonth: [
        { state: "Applicant", count: 140 },
        { state: "Interviewing", count: 70 },
        { state: "Hired", count: 30 },
        { state: "Rejected", count: 18 },
        { state: "Early Left", count: 6 }
    ],
    thisYear: [
        { state: "Applicant", count: 1200 },
        { state: "Interviewing", count: 600 },
        { state: "Hired", count: 280 },
        { state: "Rejected", count: 150 },
        { state: "Early Left", count: 40 }
    ],
    lastYear: [
        { state: "Applicant", count: 1100 },
        { state: "Interviewing", count: 580 },
        { state: "Hired", count: 250 },
        { state: "Rejected", count: 160 },
        { state: "Early Left", count: 45 }
    ]
};

    useEffect(() => {
        // Simulate fetching data
        const data = hiringStageData[timePeriod] || [];
        setEmployeeData(data);
    }, [timePeriod]);

    const tooltipFormatter = (value) => `${value}`;
    const colors = ["#73946B", "#6495ED", "#3CB371", "#FF6F61", "#8B0000"];

    return (
        <CustomContainer
            className={`!m-0 !px-3 !py-2 h-full relative flex flex-col ${className}`}
            title="Hiring Status Overview"
            icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                </svg>
            }
            headerActions={
                <div className="mb-0 flex flex-row gap-2 items-center">
                    <CustomDropdown
                        options={timePeriodOptions}
                        value={timePeriod}
                        onChange={setTimePeriod}
                        isSearchable={false}
                        className="!w-40 !mb-0"
                        placeholder="Select time period"
                    />
                </div>
            }
            headerClassName="!m-0"
            headerBorder={true}
            elevation="medium"
            rounded="medium"
            padding="none"
            overflowContent={true}
            isFixedFooter={false}
        >
            <div className="p-0 flex-grow">
                <CustomBarChart
                    data={employeeData}
                    keys={["count"]}
                    labelKey="state"
                    unit="number"
                    stacked={false}
                    colors={colors}
                    colorByData={true}
                    isDifferentColor={true}
                    legendPosition="topright"
                    layout="horizontal"
                    roundedBars={true}
                    xTickFormatter={(tick) =>
                        tick.length > 10 ? tick.slice(0, 10) + "..." : tick
                    }
                    yTickCount={8}
                    tooltipFormatter={tooltipFormatter}
                    barSize={45}
                    isGridDisplay={true}
                    responsive={true}
                    showLegend={false}
                    showLabels={false}
                    xAxisLabel="Hiring Stage"
                    yAxisLabel="Candidates"
                    unitSymbol=""
                    yDomain={[0, "auto"]}
                    height={420}
                />
            </div>
        </CustomContainer>
    );
}

export default HiringStatusCard;
