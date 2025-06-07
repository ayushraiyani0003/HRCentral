import React from "react";
import CustomContainer from "../../../components/CustomContainer/CustomContainer";
import "./RolesPermissions.css";
import RoleCard from "../components/RoleCard";
import { CustomButton } from "../../../components";
import UserListContainer from "../components/UserListContainer";
import AddEditRoleModel from "../components/AddEditRoleModel";
import useRolesPermissions from "../hooks/useRolesPermissions";

function RolesPermissions() {
    const {
        roles,
        userLevel,
        isReadOnly,
        handleAddRole,
        handleEditRole,
        handleDeleteRole,
        handleSaveRole,
        isModalOpen,
        handleCloseModal,
        selectedRole,
    } = useRolesPermissions();

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
                    {roles.map((role) => {
                        return (
                            <RoleCard
                                key={role.id}
                                roleName={role.name || role.roleName}
                                roleAssignedUserImages={
                                    role.roleAssignedUserImages
                                }
                                totalUser={role.totalUser}
                                onEditRoleClick={() => handleEditRole(role.id)}
                                onDeleteClick={() => handleDeleteRole(role.id)}
                                userLevel={userLevel} // Pass user level to RoleCard
                            />
                        );
                    })}
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
