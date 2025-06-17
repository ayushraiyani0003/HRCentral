import { useState, useCallback, useMemo } from "react";

const useHiringSourceTab = ({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
}) => {
    const [searchValue, setSearchValue] = useState("");

    // Sample data for hiring sources
    const hiringSourceData = useMemo(
        () => [
            {
                id: 1,
                name: "LinkedIn",
            },
            {
                id: 2,
                name: "Indeed",
            },
            {
                id: 3,
                name: "Glassdoor",
            },
            {
                id: 4,
                name: "Facebook Ads",
            },
            {
                id: 5,
                name: "Instagram",
            },
            {
                id: 6,
                name: "Twitter",
            },
            {
                id: 7,
                name: "Company Website",
            },
            {
                id: 8,
                name: "Employee Referral",
            },
            {
                id: 9,
                name: "Job Fair",
            },
            {
                id: 10,
                name: "Recruitment Agency",
            },
            {
                id: 11,
                name: "University Career Center",
            },
            {
                id: 12,
                name: "Google Ads",
            },
            {
                id: 13,
                name: "Monster",
            },
            {
                id: 14,
                name: "ZipRecruiter",
            },
            {
                id: 15,
                name: "AngelList",
            },
            {
                id: 16,
                name: "Stack Overflow Jobs",
            },
            {
                id: 17,
                name: "Naukri",
            },
            {
                id: 18,
                name: "Direct Application",
            },
        ],
        []
    );

    // Filter data based on search value
    const filteredData = useMemo(() => {
        if (!searchValue.trim()) {
            return hiringSourceData;
        }
        const searchTerm = searchValue.toLowerCase().trim();
        return hiringSourceData.filter((item) => {
            return item.name.toLowerCase().includes(searchTerm);
        });
    }, [searchValue, hiringSourceData]);

    // Action handlers
    const handleAddNew = useCallback(() => {
        setOpenAddEditModel(true);
        setModelType("add");
    }, [setOpenAddEditModel, setModelType]);

    const handleView = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("view");
            setRowData(row);
        },
        [setOpenAddEditModel, setModelType, setRowData]
    );

    const handleEdit = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("edit");
            setRowData(row);
        },
        [setOpenAddEditModel, setModelType, setRowData]
    );

    const handleDelete = useCallback(
        (row) => {
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

export default useHiringSourceTab;
