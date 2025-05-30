import { useState, useCallback, useMemo } from "react";

const useSkillsTab = ({
    setOpenDeleteModel,
    setSkill = () => {},
    setOpenSkillModel = () => {},
    setModelType = () => {},
}) => {
    const [searchValue, setSearchValue] = useState("");

    // Sample data for skills
    const skillsData = useMemo(
        () => [
            {
                id: 1,
                name: "JavaScript",
            },
            {
                id: 2,
                name: "React",
            },
            {
                id: 3,
                name: "Node.js",
            },
            {
                id: 4,
                name: "Python",
            },
            {
                id: 5,
                name: "Java",
            },
            {
                id: 6,
                name: "SQL",
            },
            {
                id: 7,
                name: "HTML/CSS",
            },
            {
                id: 8,
                name: "Project Management",
            },
            {
                id: 9,
                name: "Communication",
            },
            {
                id: 10,
                name: "Problem Solving",
            },
            {
                id: 11,
                name: "Leadership",
            },
            {
                id: 12,
                name: "Team Collaboration",
            },
            {
                id: 13,
                name: "Data Analysis",
            },
            {
                id: 14,
                name: "Microsoft Office",
            },
            {
                id: 15,
                name: "Customer Service",
            },
        ],
        []
    );

    // Filter data based on search value
    const filteredData = useMemo(() => {
        if (!searchValue.trim()) {
            return skillsData;
        }
        const searchTerm = searchValue.toLowerCase().trim();
        return skillsData.filter((item) => {
            return item.name.toLowerCase().includes(searchTerm);
        });
    }, [searchValue, skillsData]);

    // Action handlers
    const handleAddNew = useCallback(() => {
        setOpenSkillModel(true);
        setModelType("add");
    }, [setOpenSkillModel, setModelType]);

    const handleView = useCallback(
        (row) => {
            setOpenSkillModel(true);
            setModelType("view");
            setSkill(row);
        },
        [setOpenSkillModel, setModelType, setSkill]
    );

    const handleEdit = useCallback(
        (row) => {
            setOpenSkillModel(true);
            setModelType("edit");
            setSkill(row);
        },
        [setOpenSkillModel, setModelType, setSkill]
    );

    const handleDelete = useCallback(
        (row) => {
            setSkill(row);
            setOpenDeleteModel(true);
        },
        [setSkill, setOpenDeleteModel]
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

export default useSkillsTab;
