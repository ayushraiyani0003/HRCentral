import { useState, useCallback, useMemo } from "react";

const useEducationLevelsTab = ({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
}) => {
    const [searchValue, setSearchValue] = useState("");

    // Sample data for education levels
    const educationLevelData = useMemo(
        () => [
            {
                id: 1,
                name: "High School Diploma",
            },
            {
                id: 2,
                name: "Associate Degree",
            },
            {
                id: 3,
                name: "Bachelor's Degree",
            },
            {
                id: 4,
                name: "Master's Degree",
            },
            {
                id: 5,
                name: "Doctoral Degree (PhD)",
            },
            {
                id: 6,
                name: "Professional Certification",
            },
            {
                id: 7,
                name: "Trade/Vocational Certificate",
            },
            {
                id: 8,
                name: "Diploma",
            },
            {
                id: 9,
                name: "Post Graduate Diploma",
            },
            {
                id: 10,
                name: "Not Specified",
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
        console.log("Add new education level");

        setOpenAddEditModel(true);
        setModelType("add");
    }, [setOpenAddEditModel, setModelType]);

    const handleView = useCallback(
        (row) => {
            console.log("View education level");
            setOpenAddEditModel(true);
            setModelType("view");
            setRowData(row);
        },
        [setOpenAddEditModel, setModelType, setRowData]
    );

    const handleEdit = useCallback(
        (row) => {
            console.log("Edit education level");
            setOpenAddEditModel(true);
            setModelType("edit");
            setRowData(row);
        },
        [setOpenAddEditModel, setModelType, setRowData]
    );

    const handleDelete = useCallback(
        (row) => {
            console.log(row);

            console.log("Delete education level");
            setRowData(row);
            setOpenDeleteModel(true);
        },
        [setRowData, setOpenDeleteModel]
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
