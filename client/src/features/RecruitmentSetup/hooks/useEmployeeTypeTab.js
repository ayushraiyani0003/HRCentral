import { useState, useCallback, useMemo } from "react";

const useEmployeeTypeTab = ({
    setOpenDeleteModel,
    setEmployeeType = () => {},
    setOpenEmployeeTypeModel = () => {},
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
        setOpenEmployeeTypeModel(true);
        setModelType("add");
    }, [setOpenEmployeeTypeModel, setModelType]);

    const handleView = useCallback(
        (row) => {
            setOpenEmployeeTypeModel(true);
            setModelType("view");
            setEmployeeType(row);
        },
        [setOpenEmployeeTypeModel, setModelType, setEmployeeType]
    );

    const handleEdit = useCallback(
        (row) => {
            setOpenEmployeeTypeModel(true);
            setModelType("edit");
            setEmployeeType(row);
        },
        [setOpenEmployeeTypeModel, setModelType, setEmployeeType]
    );

    const handleDelete = useCallback(
        (row) => {
            setEmployeeType(row);
            setOpenDeleteModel(true);
        },
        [setEmployeeType, setOpenDeleteModel]
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
