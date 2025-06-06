import React, { useState } from "react";
import CustomContainer from "../../../components/CustomContainer/CustomContainer";
import "./RolesPermissions.css";
import RoleCard from "../components/RoleCard";
import { CustomButton } from "../../../components";
import UserListContainer from "../components/UserListContainer";
import AddEditRoleModel from "../components/AddEditRoleModel";

function RolesPermissions() {
    // for open and close the model.
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [roleData, setRoleData] = useState([
        { page: "roles-users", level: "level_2" },
    ]); // in this level_1 or level_2

    const [roles, setRoles] = useState([
        {
            id: 1,
            roleName: "Admin",

            totalUser: 3,
            permissions: [
                {
                    feature: "Administrator Access",
                    read: true,
                    write: true,
                    isAdmin: true,
                    description: "Grants full access to all system features",
                },
                {
                    feature: "User Management",
                    read: true,
                    write: true,
                },
                {
                    feature: "Role Management",
                    read: true,
                    write: true,
                },
                {
                    feature: "Content Management",
                    read: true,
                    write: true,
                },
                {
                    feature: "Reports",
                    read: true,
                    write: true,
                },
                {
                    feature: "Settings",
                    read: true,
                    write: true,
                },
            ],
        },
        {
            id: 2,
            roleName: "Editor",

            totalUser: 2,
        },
        {
            id: 3,
            roleName: "Moderator",

            totalUser: 4,
        },
    ]); // Initial roles with complete data

    // Get current user's access level for "roles-users" page
    const rolesUsersPermission = roleData.find(
        (item) => item.page === "roles-users"
    );
    const userLevel = rolesUsersPermission?.level || "level_1";
    const isReadOnly = userLevel === "level_1";

    const handleAddRole = () => {
        // Prevent modal opening for level_1 users
        if (isReadOnly) return;

        setIsModalOpen(true);
        // Implement add role logic here
    };

    const handleDeleteRole = (id) => {
        // Prevent deletion for level_1 users
        if (isReadOnly) return;

        setRoles((prevRoles) => prevRoles.filter((role) => role.id !== id));
    };

    const handleEditRole = (id) => {
        // Prevent editing for level_1 users
        if (isReadOnly) return;

        const roleToEdit = roles.find((role) => role.id === id);
        if (roleToEdit) {
            setSelectedRole(roleToEdit);
            setIsModalOpen(true);
        }
    };

    // Function to handle closing the modal
    const handleCloseModal = () => {
        // Prevent modal operations for level_1 users
        if (isReadOnly) return;

        setIsModalOpen(false);
        setSelectedRole(null);
        // console.log("Modal closed"); // debug only
    };

    const handleSaveRole = (roleData) => {
        // Prevent saving for level_1 users
        if (isReadOnly) return;

        console.log(roleData);

        const transformedData = roleData.permissions
            .filter((permission) => !isNaN(permission.selectedLevel)) // Filter out invalid levels
            .map((permission) => ({
                page_name: permission.feature
                    .toLowerCase()
                    .replace(/\s+/g, "_"), // Replace spaces with underscores
                level: `level_${permission.selectedLevel + 1}`,
            }));

        console.log("Transformed data:", transformedData);

        setIsModalOpen(false);
        setSelectedRole(null);

        // Return the fully structured role object
        return {
            roleName: roleData.roleName,
            permissions: transformedData,
        };
    };

    return (
        <div className="roles-permissions-page">
            <CustomContainer
                className="!p-4"
                title="Roles List"
                titleCssClass="!text-2xl !font-semibold"
                description={
                    isReadOnly
                        ? "You have read-only access to view roles and permissions. Contact your administrator for editing privileges."
                        : "A role provides access to predefined menus and features, so depending on the assigned role, an administrator can access what the user needs."
                }
            >
                <div className="grids-width grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {roles.map((role) => (
                        <RoleCard
                            key={role.id}
                            roleName={role.roleName}
                            roleAssignedUserImages={role.roleAssignedUserImages}
                            totalUser={role.totalUser}
                            onEditRoleClick={() => handleEditRole(role.id)}
                            onDeleteClick={() => handleDeleteRole(role.id)}
                            userLevel={userLevel} // Pass user level to RoleCard
                        />
                    ))}
                    {/* Only show "Add New Role" card for level_2 users */}
                    {!isReadOnly && (
                        <RoleCard
                            isNewRoleAdd={true}
                            onNewRoleClick={handleAddRole}
                            userLevel={userLevel}
                        />
                    )}
                </div>
            </CustomContainer>
            <UserListContainer userLevel={userLevel} />
            {/* Only render modal for level_2 users and when it should be open */}
            {!isReadOnly && (
                <AddEditRoleModel
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveRole}
                    initialData={selectedRole}
                />
            )}
        </div>
    );
}

export default RolesPermissions;
