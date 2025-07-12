import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import {
    fetchAllRoles,
    fetchRoleById,
    createRole,
    updateRole,
    deleteRole,
    bulkRoleOperations,
    openRoleForm,
    closeRoleForm,
    toggleBulkSelectMode,
    toggleRoleSelection,
    selectAllRoles,
    deselectAllRoles,
    clearError,
    resetState,
    selectRoles,
    selectSelectedRole,
    selectLoading,
    selectError,
    selectUI,
} from "../../../store/rolesPermissionsSlice";

const useRolesPermissions = () => {
    const dispatch = useDispatch();

    // Redux state selectors
    const roles = useSelector(selectRoles);
    const selectedRole = useSelector(selectSelectedRole);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const ui = useSelector(selectUI);

    // Memoized selectors to prevent unnecessary rerenders
    const selectedRoles = useMemo(() => {
        if (!Array.isArray(roles) || !ui?.selectedRoleIds) return [];
        return roles.filter((role) => ui.selectedRoleIds.includes(role.id));
    }, [roles, ui?.selectedRoleIds]);

    // Memoized selector for role by ID
    const getRoleById = useMemo(() => {
        return (roleId) => {
            if (!Array.isArray(roles)) return null;
            return roles.find((role) => role.id === roleId);
        };
    }, [roles]);

    // Memoized selector for role selection status
    const isRoleSelected = useMemo(() => {
        return (roleId) => {
            return ui?.selectedRoleIds?.includes(roleId) || false;
        };
    }, [ui?.selectedRoleIds]);

    // Local state for role data and permissions
    const [roleData, setRoleData] = useState([
        { page: "roles-users", level: "level_2" },
    ]);

    // Get current user's access level for "roles-users" page
    const rolesUsersPermission = roleData.find(
        (item) => item.page === "roles-users"
    );
    const userLevel = rolesUsersPermission?.level || "level_1";
    const isReadOnly = userLevel === "level_1";

    // Load roles on component mount
    useEffect(() => {
        dispatch(fetchAllRoles());
    }, [dispatch]);

    // Role management functions
    const handleAddRole = () => {
        if (isReadOnly) return;
        dispatch(openRoleForm());
    };

    const handleDeleteRole = async (id) => {
        if (isReadOnly) return;

        try {
            const resultAction = await dispatch(deleteRole(id));
            if (deleteRole.fulfilled.match(resultAction)) {
                // console.log("Role deleted successfully");
                // Optionally refresh roles list
                dispatch(fetchAllRoles());
            } else {
                console.error("Failed to delete role:", resultAction.payload);
            }
        } catch (error) {
            console.error("Failed to delete role:", error);
        }
    };

    const handleEditRole = async (id) => {
        if (isReadOnly) return;

        try {
            const resultAction = await dispatch(fetchRoleById(id));
            if (fetchRoleById.fulfilled.match(resultAction)) {
                dispatch(openRoleForm());
            } else {
                console.error(
                    "Failed to fetch role for editing:",
                    resultAction.payload
                );
            }
        } catch (error) {
            console.error("Failed to fetch role for editing:", error);
        }
    };

    // Function to handle closing the modal
    const handleCloseModal = () => {
        if (isReadOnly) return;
        dispatch(closeRoleForm());
    };

    const handleSaveRole = async (roleDataForm) => {
        if (isReadOnly) return;

        // console.log("Original form data:", roleDataForm);

        // Transform permissions data - ensure each permission has unique identifier
        const transformedData = roleDataForm.permissions
            .filter((permission, index) => !isNaN(permission.selectedLevel))
            .map((permission, index) => ({
                id: permission.id || `${permission.feature}_${index}`, // Ensure unique ID
                page_name: permission.feature
                    .toLowerCase()
                    .replace(/\s+/g, "_"),
                level: `level_${permission.selectedLevel + 1}`,
            }));

        // console.log("Transformed permissions:", transformedData);

        const rolePayload = {
            name: roleDataForm.roleName,
            permissions: transformedData,
        };

        // console.log("Final payload:", rolePayload);

        try {
            let resultAction;

            if (selectedRole?.id) {
                // Update existing role
                resultAction = await dispatch(
                    updateRole({
                        roleId: selectedRole.id,
                        roleData: rolePayload,
                    })
                );

                if (updateRole.fulfilled.match(resultAction)) {
                    // console.log("Role updated successfully");
                    dispatch(closeRoleForm());
                    // Don't auto-refresh, let the state update handle it
                } else {
                    console.error(
                        "Failed to update role:",
                        resultAction.payload
                    );
                    throw new Error(
                        resultAction.payload || "Failed to update role"
                    );
                }
            } else {
                // Create new role
                resultAction = await dispatch(createRole(rolePayload));

                if (createRole.fulfilled.match(resultAction)) {
                    // console.log("Role created successfully");
                    dispatch(closeRoleForm());
                    // Don't auto-refresh, let the state update handle it
                } else {
                    console.error(
                        "Failed to create role:",
                        resultAction.payload
                    );
                    throw new Error(
                        resultAction.payload || "Failed to create role"
                    );
                }
            }

            return rolePayload;
        } catch (error) {
            console.error("Failed to save role:", error);
            throw error;
        }
    };

    // Bulk operations
    const handleBulkDelete = async () => {
        if (
            isReadOnly ||
            !ui.selectedRoleIds ||
            ui.selectedRoleIds.length === 0
        )
            return;

        const operations = ui.selectedRoleIds.map((id) => ({
            type: "delete",
            roleId: id,
        }));

        try {
            const resultAction = await dispatch(bulkRoleOperations(operations));
            if (bulkRoleOperations.fulfilled.match(resultAction)) {
                // console.log("Bulk delete completed successfully");
                dispatch(fetchAllRoles()); // Refresh roles list
            } else {
                console.error(
                    "Failed to bulk delete roles:",
                    resultAction.payload
                );
            }
        } catch (error) {
            console.error("Failed to bulk delete roles:", error);
        }
    };

    const handleToggleBulkSelect = () => {
        if (isReadOnly) return;
        dispatch(toggleBulkSelectMode());
    };

    const handleToggleRoleSelection = (roleId) => {
        if (isReadOnly) return;
        dispatch(toggleRoleSelection(roleId));
    };

    const handleSelectAllRoles = () => {
        if (isReadOnly) return;
        dispatch(selectAllRoles());
    };

    const handleDeselectAllRoles = () => {
        if (isReadOnly) return;
        dispatch(deselectAllRoles());
    };

    const handleClearError = () => {
        dispatch(clearError());
    };

    const handleResetState = () => {
        dispatch(resetState());
    };

    // Refresh roles
    const refreshRoles = () => {
        dispatch(fetchAllRoles());
    };

    return {
        // Redux state
        roles,
        selectedRole,
        loading,
        error,
        ui,
        selectedRoles,

        // Modal state (from Redux UI)
        isModalOpen: ui.roleFormOpen,
        setIsModalOpen: (isOpen) =>
            isOpen ? dispatch(openRoleForm()) : dispatch(closeRoleForm()),

        // Local state
        roleData,
        setRoleData,
        userLevel,
        isReadOnly,

        // Role management functions
        handleAddRole,
        handleDeleteRole,
        handleEditRole,
        handleCloseModal,
        handleSaveRole,

        // Bulk operations
        handleBulkDelete,
        handleToggleBulkSelect,
        handleToggleRoleSelection,
        handleSelectAllRoles,
        handleDeselectAllRoles,

        // Utility functions
        getRoleById,
        isRoleSelected,
        handleClearError,
        handleResetState,
        refreshRoles,

        // Bulk selection state
        bulkSelectMode: ui.bulkSelectMode,
        selectedRoleIds: ui.selectedRoleIds,

        // Async actions (if you need direct access)
        actions: {
            fetchAllRoles: () => dispatch(fetchAllRoles()),
            fetchRoleById: (id) => dispatch(fetchRoleById(id)),
            createRole: (data) => dispatch(createRole(data)),
            updateRole: (id, data) =>
                dispatch(updateRole({ roleId: id, roleData: data })),
            deleteRole: (id) => dispatch(deleteRole(id)),
            bulkRoleOperations: (operations) =>
                dispatch(bulkRoleOperations(operations)),
        },
    };
};

export default useRolesPermissions;
