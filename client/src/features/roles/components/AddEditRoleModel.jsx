import React, { useState, useEffect } from "react";
import { CustomModal, CustomTextInput } from "../../../components";
import { Info } from "lucide-react";

function AddEditRoleModel({ isOpen, onClose, onSave, initialData = null }) {
    const [roleName, setRoleName] = useState("");
    const [roleNameError, setRoleNameError] = useState(false);
    const [permissionError, setPermissionError] = useState(false);

    console.log(initialData);

    const defaultPermissions = [
        {
            feature: "Administrator Access",
            description: "Grants full access to all system features",
            isAdmin: true,
            levels: ["Full Access"],
        },
        {
            feature: "User Management",
            levels: [
                "View Users",
                "Create Users",
                "Edit Users",
                "Delete Users",
                "Manage Roles",
                "Export Data",
            ],
        },
        {
            feature: "Content Management",
            levels: [
                "View Content",
                "Create Content",
                "Edit Content",
                "Delete Content",
                "Publish Content",
                "Archive Content",
                "Moderate Comments",
                "Manage Categories",
                "SEO Settings",
                "Content Analytics",
            ],
        },
        {
            feature: "Reports",
            levels: ["View Reports", "Generate Reports", "Export Reports"],
        },
        {
            feature: "Settings",
            levels: [
                "View Settings",
                "Edit Basic Settings",
                "Edit Advanced Settings",
                "System Configuration",
                "Security Settings",
                "Backup Management",
            ],
        },
        {
            feature: "Dashboard",
            levels: [
                "View Dashboard",
                "Customize Dashboard",
                "Advanced Analytics",
            ],
        },
        {
            feature: "Notifications",
            levels: [
                "View Notifications",
                "Send Notifications",
                "Manage Templates",
                "Schedule Notifications",
                "Analytics",
            ],
        },
        {
            feature: "File Management",
            levels: [
                "View Files",
                "Upload Files",
                "Delete Files",
                "Organize Folders",
                "Share Files",
                "Version Control",
                "Storage Management",
            ],
        },
        {
            feature: "API Access",
            levels: ["Read API", "Write API", "Admin API"],
        },
        {
            feature: "Audit Logs",
            levels: ["View Logs", "Export Logs", "Configure Logging"],
        },
    ];

    const [permissions, setPermissions] = useState(defaultPermissions);

    // Helper function to parse and map database permissions to component format
    const parsePermissionsFromDatabase = (dbPermissions) => {
        try {
            // Parse the JSON string if it's a string
            const parsedPermissions =
                typeof dbPermissions === "string"
                    ? JSON.parse(dbPermissions)
                    : dbPermissions;

            if (!Array.isArray(parsedPermissions)) {
                return defaultPermissions;
            }

            // Create a copy of default permissions
            const mappedPermissions = defaultPermissions.map((defaultPerm) => ({
                ...defaultPerm,
                selectedLevel: -1, // Initialize as no selection
            }));

            // Map database permissions to the component format
            parsedPermissions.forEach((dbPerm) => {
                // Find matching feature in default permissions
                const featureIndex = mappedPermissions.findIndex(
                    (perm) =>
                        perm.feature.toLowerCase().replace(/\s+/g, "_") ===
                            dbPerm.page_name ||
                        perm.feature === dbPerm.page_name ||
                        perm.feature.toLowerCase() ===
                            dbPerm.page_name.toLowerCase().replace(/_/g, " ")
                );

                if (featureIndex !== -1) {
                    // Extract level number from level string (e.g., "level_6" -> 5 for 0-based index)
                    const levelMatch = dbPerm.level.match(/level_(\d+)/);
                    if (levelMatch) {
                        const levelNumber = parseInt(levelMatch[1], 10);
                        // Convert to 0-based index (level_1 = index 0, level_6 = index 5)
                        mappedPermissions[featureIndex].selectedLevel =
                            levelNumber - 1;
                    }
                }
            });

            return mappedPermissions;
        } catch (error) {
            console.error("Error parsing permissions from database:", error);
            return defaultPermissions;
        }
    };

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setRoleName(initialData.name || initialData.roleName || "");

                // Parse and set permissions from database
                if (initialData.permissions) {
                    const parsedPermissions = parsePermissionsFromDatabase(
                        initialData.permissions
                    );
                    setPermissions(parsedPermissions);
                } else {
                    setPermissions(defaultPermissions);
                }
            } else {
                setRoleName("");
                setPermissions(defaultPermissions);
            }
            setRoleNameError(false);
            setPermissionError(false);
        }
    }, [isOpen, initialData]);

    const handleTogglePermission = (pageIndex, levelIndex) => {
        const updatedPermissions = [...permissions];

        // Initialize selectedLevel if not exists
        if (updatedPermissions[pageIndex].selectedLevel === undefined) {
            updatedPermissions[pageIndex].selectedLevel = -1; // -1 means no selection
        }

        // If clicking the same level, deselect it
        if (updatedPermissions[pageIndex].selectedLevel === levelIndex) {
            updatedPermissions[pageIndex].selectedLevel = -1;
        } else {
            // Select the new level
            updatedPermissions[pageIndex].selectedLevel = levelIndex;
        }

        // Admin logic - if admin is selected, grant highest level to all other pages
        if (pageIndex === 0 && updatedPermissions[0].selectedLevel === 0) {
            updatedPermissions.forEach((perm, idx) => {
                if (idx !== 0) {
                    perm.selectedLevel = perm.levels.length - 1; // Highest level
                }
            });
        }

        setPermissions(updatedPermissions);
    };

    const isLevelAccessible = (pageIndex, levelIndex) => {
        const page = permissions[pageIndex];
        const selectedLevel =
            page.selectedLevel !== undefined ? page.selectedLevel : -1;

        // If no level is selected, only show the current level as selectable
        if (selectedLevel === -1) {
            return false;
        }

        // If a level is selected, show all levels up to and including the selected level
        return levelIndex <= selectedLevel;
    };

    const isLevelSelected = (pageIndex, levelIndex) => {
        const page = permissions[pageIndex];
        return page.selectedLevel === levelIndex;
    };

    const handleSave = () => {
        const trimmedRoleName = roleName.trim();
        const isRoleNameValid = trimmedRoleName !== "";
        const isPermissionValid = permissions.some(
            (p) => p.selectedLevel !== undefined && p.selectedLevel >= 0
        );

        setRoleNameError(!isRoleNameValid);
        setPermissionError(!isPermissionValid);

        if (!isRoleNameValid || !isPermissionValid) return;

        onSave({ roleName: trimmedRoleName, permissions });
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? "Edit Role" : "Add Role"}
            size="large"
            className="outline-none"
        >
            <div className="p-0 flex flex-col space-y-6">
                <div>
                    <CustomTextInput
                        label="Role Name"
                        placeholder="Enter role name"
                        value={roleName}
                        onChange={setRoleName}
                        required
                        className="!mb-0"
                    />
                    {roleNameError && (
                        <p className="text-red-500 text-sm mt-1">
                            Role Name is required.
                        </p>
                    )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-lg">
                            Role Permissions
                        </h3>
                    </div>

                    {/* Scrollable permissions container */}
                    <div className="max-h-96 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {permissions.map((page, pageIndex) => (
                            <div
                                key={pageIndex}
                                className="bg-white rounded-lg border border-gray-200 p-4"
                            >
                                {/* Page header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                        <h4 className="font-semibold text-gray-900">
                                            {page.feature}
                                        </h4>
                                        {page.isAdmin && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {page.selectedLevel !== undefined &&
                                        page.selectedLevel >= 0
                                            ? `Level ${page.selectedLevel + 1}`
                                            : "No Access"}
                                    </span>
                                </div>

                                {/* Page description */}
                                {page.description && (
                                    <p className="text-sm text-gray-600 mb-3 flex items-start space-x-1">
                                        <Info className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                                        <span>{page.description}</span>
                                    </p>
                                )}

                                {/* Permission levels - radio button style with hierarchical access */}
                                <div className="flex flex-wrap gap-2">
                                    {page.levels.map((level, levelIndex) => {
                                        const isSelected = isLevelSelected(
                                            pageIndex,
                                            levelIndex
                                        );
                                        const hasAccess = isLevelAccessible(
                                            pageIndex,
                                            levelIndex
                                        );

                                        return (
                                            <label
                                                key={levelIndex}
                                                className={`flex items-center space-x-2 px-3 py-2 rounded-md border cursor-pointer transition-all min-w-fit ${
                                                    isSelected
                                                        ? "bg-blue-100 border-blue-300 text-blue-800"
                                                        : hasAccess
                                                        ? "bg-green-50 border-green-200 text-green-700"
                                                        : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`page-${pageIndex}`}
                                                    checked={isSelected}
                                                    onChange={() =>
                                                        handleTogglePermission(
                                                            pageIndex,
                                                            levelIndex
                                                        )
                                                    }
                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm font-medium whitespace-nowrap">
                                                    {level}
                                                    {hasAccess &&
                                                        !isSelected && (
                                                            <span className="ml-1 text-xs text-green-600">
                                                                ✓
                                                            </span>
                                                        )}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {permissionError && (
                        <p className="text-red-500 text-sm mt-3 flex items-center space-x-1">
                            <Info className="w-4 h-4" />
                            <span>
                                Please select at least one permission level.
                            </span>
                        </p>
                    )}
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        {initialData ? "Update" : "Create"} Role
                    </button>
                </div>
            </div>
        </CustomModal>
    );
}

export default AddEditRoleModel;
