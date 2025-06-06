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
import AllCandidatesTab from "../components/Tabs/AllCandidatesTab";

import DeleteConfirmationModel from "../components/models/DeleteConfirmationModel";
import AddEditCandidatesModel from "../components/models/AddEditCandidatesModel/AddEditCandidatesModel"; // Fixed: Changed from AllCandidatesModel

import useApplicantTrackingPage from "../hooks/useApplicantTrackingPage";

function ApplicantTrackingPage() {
    const [selectedTab, setSelectedTab] = useState(0);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [candidate, setCandidate] = useState(null); // Fixed: Changed from array to null for single candidate
    const [openCandidateModal, setOpenCandidateModal] = useState(false); // Fixed: Changed from openCandidateModel
    const [modalType, setModalType] = useState(""); // Fixed: Changed from modelType to modalType for consistency

    // Uncomment if needed
    // const [uploadEmployeeModelOpen, setUploadEmployeeModelOpen] = useState(false);

    const { userLevels, setUserLevels } = useApplicantTrackingPage();

    // Function to get user level based on page
    const getUserLevelForPage = useCallback(
        (pageId) => {
            const userLevel = userLevels?.find(
                (level) => level.page === pageId
            );
            return userLevel ? userLevel.level : "level_1"; // Default to level_1 if not found
        },
        [userLevels]
    );

    const handleCloseStructureModel = useCallback(() => {
        setOpenCandidateModal(false);
        setCandidate(null); // Fixed: Changed from empty array to null
        setModalType("");
    }, []);

    // Basic tabs example
    const tabs = [
        {
            label: "All Candidates",
            content: (
                <AllCandidatesTab
                    setOpenDeleteModel={setOpenDeleteModel}
                    setOpenCandidateModal={setOpenCandidateModal} // Fixed: Updated prop name
                    setCandidate={setCandidate}
                    setModelType={setModalType} // This will set the modal type
                    userLevel={getUserLevelForPage("page_1")} // Get level for page_1
                />
            ),
        },
        {
            label: "New",
            content: (
                <>
                    Here, only display candidates who are newly added and
                    waiting for the interview.
                </>
            ),
        },
        {
            label: "Short Listed",
            content: (
                <>
                    Display only the candidates who have been shortlisted and
                    are waiting for an interview.
                    <p>
                        Discuss with HR: Are the shortlisted candidates
                        currently working? What is the logic behind shortlisting
                        them, etc.
                    </p>
                </>
            ),
        },
        {
            label: "Interview",
            content: (
                <>
                    Here, only display candidates who are currently in the
                    interview stage.
                </>
            ),
        },
        {
            label: "Offer",
            content: (
                <>
                    Here, only display candidates who have received an offer and
                    are waiting for further steps.
                </>
            ),
        },
        {
            label: "Hired",
            content: (
                <>
                    Here, only display candidates who have been hired after the
                    interview process.
                </>
            ),
        },
        {
            label: "Rejected",
            content: (
                <>
                    Here, only display candidates who have been rejected after
                    the interview process.
                </>
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
                contentClassName="min-h-[760px]"
            />

            <DeleteConfirmationModel
                openDeleteModel={openDeleteModel}
                setOpenDeleteModel={setOpenDeleteModel}
                companyStructure={candidate}
            />

            <AddEditCandidatesModel
                openCandidateModal={openCandidateModal} // Fixed: Updated prop name
                setOpenCandidateModal={setOpenCandidateModal} // Fixed: Updated prop name
                modalType={modalType} // Fixed: Updated prop name
                candidate={candidate} // Added: Pass candidate data to modal
            />
        </div>
    );
}

export default ApplicantTrackingPage;
