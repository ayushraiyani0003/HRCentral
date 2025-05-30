import { useState, useCallback, useMemo } from "react";

const useExperienceLevelsTab = ({
    setOpenDeleteModel,
    setExperienceLevel = () => {},
    setOpenExperienceLevelModel = () => {},
    setModelType = () => {},
}) => {
    const [searchValue, setSearchValue] = useState("");

    // Sample data for experience levels
    const experienceLevelData = useMemo(
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
                name: "Mid Level",
            },
            {
                id: 5,
                name: "Senior Level",
            },
            {
                id: 6,
                name: "Lead/Principal",
            },
            {
                id: 7,
                name: "Executive",
            },
        ],
        []
    );

    // Filter data based on search value
    const filteredData = useMemo(() => {
        if (!searchValue.trim()) {
            return experienceLevelData;
        }
        const searchTerm = searchValue.toLowerCase().trim();
        return experienceLevelData.filter((item) => {
            return item.name.toLowerCase().includes(searchTerm);
        });
    }, [searchValue, experienceLevelData]);

    // Action handlers
    const handleAddNew = useCallback(() => {
        setOpenExperienceLevelModel(true);
        setModelType("add");
    }, [setOpenExperienceLevelModel, setModelType]);

    const handleView = useCallback(
        (row) => {
            setOpenExperienceLevelModel(true);
            setModelType("view");
            setExperienceLevel(row);
        },
        [setOpenExperienceLevelModel, setModelType, setExperienceLevel]
    );

    const handleEdit = useCallback(
        (row) => {
            setOpenExperienceLevelModel(true);
            setModelType("edit");
            setExperienceLevel(row);
        },
        [setOpenExperienceLevelModel, setModelType, setExperienceLevel]
    );

    const handleDelete = useCallback(
        (row) => {
            setExperienceLevel(row);
            setOpenDeleteModel(true);
        },
        [setExperienceLevel, setOpenDeleteModel]
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

export default useExperienceLevelsTab;
