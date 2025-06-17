import { useState, useCallback, useMemo } from "react";

const useDesignationsTab = ({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
}) => {
    const [searchValue, setSearchValue] = useState("");

    // Sample data for designations
    const designationData = useMemo(
        () => [
            {
                id: 1,
                name: "Information Technology (IT)",
            },
            {
                id: 2,
                name: "Human Resources (HR)",
            },
            {
                id: 3,
                name: "Fabrication",
            },
            {
                id: 4,
                name: "Manufacturing",
            },
            {
                id: 5,
                name: "Sales & Marketing",
            },
            {
                id: 6,
                name: "Finance & Accounting",
            },
            {
                id: 7,
                name: "Operations",
            },
            {
                id: 8,
                name: "Quality Assurance",
            },
            {
                id: 9,
                name: "Research & Development",
            },
            {
                id: 10,
                name: "Customer Service",
            },
            {
                id: 11,
                name: "Engineering",
            },
            {
                id: 12,
                name: "Administration",
            },
        ],
        []
    );

    // Filter data based on search value
    const filteredData = useMemo(() => {
        if (!searchValue.trim()) {
            return designationData;
        }
        const searchTerm = searchValue.toLowerCase().trim();
        return designationData.filter((item) => {
            return item.name.toLowerCase().includes(searchTerm);
        });
    }, [searchValue, designationData]);

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

export default useDesignationsTab;
