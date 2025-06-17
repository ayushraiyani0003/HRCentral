import { useState, useCallback, useMemo } from "react";

const useJobLocationsTypeTab = ({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
}) => {
    const [searchValue, setSearchValue] = useState("");

    const jobLocationTypeData = useMemo(
        () => [
            { id: 1, name: "Remote" },
            { id: 2, name: "Hybrid" },
            { id: 3, name: "On-site" },
        ],
        []
    );

    const filteredData = useMemo(() => {
        const term = searchValue.toLowerCase().trim();
        return term
            ? jobLocationTypeData.filter((item) =>
                  item.name.toLowerCase().includes(term)
              )
            : jobLocationTypeData;
    }, [searchValue, jobLocationTypeData]);

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
        searchValue,
        filteredData,
        handleAddNew,
        handleView,
        handleEdit,
        handleDelete,
        handleSearch,
    };
};

export default useJobLocationsTypeTab;
