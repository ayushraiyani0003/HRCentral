import { useState, useCallback, useMemo } from "react";

const useAllCandidatesTab = ({
    setOpenDeleteModel,
    setCandidate = () => {},
    setOpenCandidateModal = () => {}, // Fixed: Updated prop name
    setModelType = () => {},
}) => {
    const [searchValue, setSearchValue] = useState("");

    // Sample data for candidates with more fields including email
    const candidateData = useMemo(
        () => [
            {
                id: 1,
                firstName: "John",
                lastName: "Doe",
                applicationDate: "2024-12-01",
                position: "Software Engineer",
                hiringStage: "Interview",
                mobileNumber: "123-456-7890",
                email: "john.doe@email.com",
            },
            {
                id: 2,
                firstName: "Jane",
                lastName: "Smith",
                applicationDate: "2024-11-15",
                position: "Product Manager",
                hiringStage: "Screening",
                mobileNumber: "123-456-7891",
                email: "jane.smith@email.com",
            },
            {
                id: 3,
                firstName: "Mike",
                lastName: "Johnson",
                applicationDate: "2024-12-10",
                position: "UX Designer",
                hiringStage: "Applied",
                mobileNumber: "123-456-7892",
                email: "mike.johnson@email.com",
            },
            {
                id: 4,
                firstName: "Sarah",
                lastName: "Williams",
                applicationDate: "2024-11-28",
                position: "Data Analyst",
                hiringStage: "Final Round",
                mobileNumber: "123-456-7893",
                email: "sarah.williams@email.com",
            },
            {
                id: 5,
                firstName: "David",
                lastName: "Brown",
                applicationDate: "2024-12-05",
                position: "Marketing Specialist",
                hiringStage: "Hired",
                mobileNumber: "123-456-7894",
                email: "david.brown@email.com",
            },
        ],
        []
    );

    // Filter data based on search value - expanded to include more fields
    const filteredData = useMemo(() => {
        if (!searchValue.trim()) return candidateData;

        const term = searchValue.toLowerCase();
        return candidateData.filter((item) =>
            `${item.firstName} ${item.lastName} ${item.position} ${item.email} ${item.hiringStage}`
                .toLowerCase()
                .includes(term)
        );
    }, [searchValue, candidateData]);

    // Action handlers
    const handleAddNew = useCallback(() => {
        console.log("Add new candidate");
        setOpenCandidateModal(true);
        setModelType("add");
    }, [setOpenCandidateModal, setModelType]);

    const handleView = useCallback(
        (row) => {
            console.log("View candidate:", row);
            setOpenCandidateModal(true);
            setModelType("view");
            setCandidate(row);
        },
        [setOpenCandidateModal, setModelType, setCandidate]
    );

    const handleEdit = useCallback(
        (row) => {
            console.log("Edit candidate:", row);
            setOpenCandidateModal(true);
            setModelType("edit");
            setCandidate(row);
        },
        [setOpenCandidateModal, setModelType, setCandidate]
    );

    const handleDelete = useCallback(
        (row) => {
            console.log("Delete candidate:", row);
            setCandidate(row);
            setOpenDeleteModel(true);
        },
        [setCandidate, setOpenDeleteModel]
    );

    const handleSearch = useCallback((value) => {
        setSearchValue(value);
    }, []);

    return {
        // State
        searchValue,
        filteredData,

        // Handlers
        handleAddNew,
        handleView,
        handleEdit,
        handleDelete,
        handleSearch,
    };
};

export default useAllCandidatesTab;
