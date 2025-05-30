import { useState, useCallback, useMemo } from "react";

const useJobLocationsTypeTab = ({
    setOpenDeleteModel,
    setJobLocationType = () => {},
    setOpenJobLocationTypeModel = () => {},
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
        setOpenJobLocationTypeModel(true);
        setModelType("add");
    }, [setOpenJobLocationTypeModel, setModelType]);

    const handleView = useCallback(
        (row) => {
            setOpenJobLocationTypeModel(true);
            setModelType("view");
            setJobLocationType(row);
        },
        [setOpenJobLocationTypeModel, setModelType, setJobLocationType]
    );

    const handleEdit = useCallback(
        (row) => {
            setOpenJobLocationTypeModel(true);
            setModelType("edit");
            setJobLocationType(row);
        },
        [setOpenJobLocationTypeModel, setModelType, setJobLocationType]
    );

    const handleDelete = useCallback(
        (row) => {
            setJobLocationType(row);
            setOpenDeleteModel(true);
        },
        [setJobLocationType, setOpenDeleteModel]
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
