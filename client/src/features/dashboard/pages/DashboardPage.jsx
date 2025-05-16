import React, { useState } from "react";
import { StatCards, TaskCard, TaskPanel } from "../components/";
import { CustomButton, SlidingPanel } from "../../../components";

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
    return (
        <div className="w-full p-0">
            <div className="w-full flex flex-col md:flex-row gap-3">
                <div className="w-full md:w-2/3 lg:w-3/4">
                    <StatCards
                        className="w-full h-full"
                        employeesTrack={data}
                        yesterdayAttendance={600}
                    />
                </div>
                <div className="w-full md:w-1/3 lg:w-1/4 mt-3 md:mt-0 overflow-hidden">
                    <TaskCard className="w-full h-full" />
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
