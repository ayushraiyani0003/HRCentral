import { useState, useCallback, useMemo } from "react";

const useWorkShiftTab = ({
    setOpenDeleteModel,
    setWorkShift = () => {},
    setOpenWorkShiftModel = () => {},
    setModelType = () => {},
}) => {
    const [searchValue, setSearchValue] = useState("");

    // Sample data for work shifts
    const workShiftData = useMemo(
        () => [
            { id: 1, name: "Morning Shift", timeRange: "9:00 AM to 5:00 PM" },
            { id: 2, name: "Evening Shift", timeRange: "1:00 PM to 9:00 PM" },
            { id: 3, name: "Night Shift", timeRange: "10:00 PM to 6:00 AM" },
            { id: 4, name: "Weekend Shift", timeRange: "10:00 AM to 4:00 PM" },
            { id: 5, name: "Flexible Shift", timeRange: "Flexible Timing" },
        ],
        []
    );

    const filteredData = useMemo(() => {
        const searchTerm = searchValue.toLowerCase().trim();
        if (!searchTerm) return workShiftData;
        return workShiftData.filter(
            (item) =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.timeRange.toLowerCase().includes(searchTerm)
        );
    }, [searchValue, workShiftData]);

    const handleAddNew = useCallback(() => {
        setOpenWorkShiftModel(true);
        setModelType("add");
    }, [setOpenWorkShiftModel, setModelType]);

    const handleView = useCallback(
        (row) => {
            setOpenWorkShiftModel(true);
            setModelType("view");
            setWorkShift(row);
        },
        [setOpenWorkShiftModel, setModelType, setWorkShift]
    );

    const handleEdit = useCallback(
        (row) => {
            setOpenWorkShiftModel(true);
            setModelType("edit");
            setWorkShift(row);
        },
        [setOpenWorkShiftModel, setModelType, setWorkShift]
    );

    const handleDelete = useCallback(
        (row) => {
            setWorkShift(row);
            setOpenDeleteModel(true);
        },
        [setWorkShift, setOpenDeleteModel]
    );

    const handleSearch = useCallback((value) => {
        setSearchValue(value);
    }, []);

    return {
        searchValue,
        filteredData,
        handleAddNew,
        handleView,
        handleEdit,
        handleDelete,
        handleSearch,
    };
};

export default useWorkShiftTab;
