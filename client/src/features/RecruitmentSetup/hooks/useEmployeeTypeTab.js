import { useState, useCallback, useMemo } from "react";

const useEmployeeTypeTab = ({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
}) => {
    const [searchValue, setSearchValue] = useState("");

    // Sample data for employee types
    const employeeTypeData = useMemo(
        () => [
            {
                id: 1,
                name: "Full-time",
            },
            {
                id: 2,
                name: "Part-time",
            },
            {
                id: 3,
                name: "Contract",
            },
            {
                id: 4,
                name: "Temporary",
            },
        ],
        []
    );

    // Filter data based on search value
    const filteredData = useMemo(() => {
        if (!searchValue.trim()) {
            return employeeTypeData;
        }

        const searchTerm = searchValue.toLowerCase().trim();

        return employeeTypeData.filter((item) => {
            return item.name.toLowerCase().includes(searchTerm);
        });
    }, [searchValue, employeeTypeData]);

    // Action handlers
    const handleAddNew = useCallback(() => {
        console.log("Add new employee type");

        setOpenAddEditModel(true);
        setModelType("add");
    }, [setOpenAddEditModel, setModelType]);

    const handleView = useCallback(
        (row) => {
            console.log("View employee type");
            setOpenAddEditModel(true);
            setModelType("view");
            setRowData(row);
        },
        [setOpenAddEditModel, setModelType, setRowData]
    );

    const handleEdit = useCallback(
        (row) => {
            console.log("Edit employee type");
            setOpenAddEditModel(true);
            setModelType("edit");
            setRowData(row);
        },
        [setOpenAddEditModel, setModelType, setRowData]
    );

    const handleDelete = useCallback(
        (row) => {
            console.log(row);

            console.log("Delete employee type");
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

export default useEmployeeTypeTab;
