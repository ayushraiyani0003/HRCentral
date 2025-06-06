import { useState, useCallback, useMemo } from "react";

const useApplicantTrackingPage = () => {
    // TODO: remove this and replace with server data
    const [userLevels, setUserLevels] = useState([
        { page: "page_1", level: "level_1" },
        { page: "page_2", level: "level_1" },
        { page: "page_3", level: "level_1" },
    ]);

    // Continue your logic here

    return {
        userLevels,
        setUserLevels,
    };
};

export default useApplicantTrackingPage;
