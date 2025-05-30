import { useState, useCallback, useMemo } from "react";

const useEducationLevelsTab = ({
    setOpenDeleteModel,
    setEducationLevel = () => {},
    setOpenEducationLevelModel = () => {},
    setModelType = () => {},
}) => {
    const [searchValue, setSearchValue] = useState("");

    // Sample data for education levels
    const educationLevelData = useMemo(
        () => [
            {
                id: 1,
                name: "Not Applicable",
            },
            {
                id: 2,
                name: "Internship",
            },
            {
                id: 3,
                name: "Entry Level",
            },
            {
                id: 4,
                name: "Associate Degree",
            },
            {
                id: 5,
                name: "Bachelor's Degree",
            },
            {
                id: 6,
                name: "Master's Degree",
            },
            {
                id: 7,
                name: "Doctoral Degree (PhD)",
            },
            {
                id: 8,
                name: "Professional Certification",
            },
            {
                id: 9,
                name: "High School Diploma",
            },
            {
                id: 10,
                name: "Trade/Vocational Certificate",
            },
        ],
        []
    );

    // Filter data based on search value
    const filteredData = useMemo(() => {
        if (!searchValue.trim()) {
            return educationLevelData;
        }
        const searchTerm = searchValue.toLowerCase().trim();
        return educationLevelData.filter((item) => {
            return item.name.toLowerCase().includes(searchTerm);
        });
    }, [searchValue, educationLevelData]);

    // Action handlers
    const handleAddNew = useCallback(() => {
        setOpenEducationLevelModel(true);
        setModelType("add");
    }, [setOpenEducationLevelModel, setModelType]);

    const handleView = useCallback(
        (row) => {
            setOpenEducationLevelModel(true);
            setModelType("view");
            setEducationLevel(row);
        },
        [setOpenEducationLevelModel, setModelType, setEducationLevel]
    );

    const handleEdit = useCallback(
        (row) => {
            setOpenEducationLevelModel(true);
            setModelType("edit");
            setEducationLevel(row);
        },
        [setOpenEducationLevelModel, setModelType, setEducationLevel]
    );

    const handleDelete = useCallback(
        (row) => {
            setEducationLevel(row);
            setOpenDeleteModel(true);
        },
        [setEducationLevel, setOpenDeleteModel]
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

export default useEducationLevelsTab;
