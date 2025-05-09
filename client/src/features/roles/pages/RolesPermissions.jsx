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
    const [roles, setRoles] = useState([
        {
            id: 1,
            roleName: "Admin",
            roleAssignedUserImages: [
                "https://i.pravatar.cc/40?img=1",
                "https://i.pravatar.cc/40?img=2",
                "https://i.pravatar.cc/40?img=3",
            ],
            totalUser: 3,
            permissions:
            [
                {
                    feature: "Administrator Access",
                    read: true,
                    write: true,
                    isAdmin: true,
                    description: "Grants full access to all system features"
                },
                {
                    feature: "User Management",
                    read: true,
                    write: true
                },
                {
                    feature: "Role Management",
                    read: true,
                    write: true
                },
                {
                    feature: "Content Management",
                    read: true,
                    write: true
                },
                {
                    feature: "Reports",
                    read: true,
                    write: true
                },
                {
                    feature: "Settings",
                    read: true,
                    write: true
                }
            ]
        },
        {
            id: 2,
            roleName: "Editor",
            roleAssignedUserImages: [
                "https://i.pravatar.cc/40?img=4",
                "https://i.pravatar.cc/40?img=5",
            ],
            totalUser: 2,
        },
        {
            id: 3,
            roleName: "Moderator",
            roleAssignedUserImages: [
                "https://i.pravatar.cc/40?img=6",
                "https://i.pravatar.cc/40?img=7",
                "https://i.pravatar.cc/40?img=8",
                "https://i.pravatar.cc/40?img=9",
            ],
            totalUser: 4,
        }
    ]); // Initial roles with complete data

    const handleAddRole = () => {
        setIsModalOpen(true);
        // Implement add role logic here
    };

    const handleDefaultPages= () => {
        setIsModalOpen(true);
        // Implement add role logic here
    };

    const handleDeleteRole = (id) => {
        setRoles((prevRoles) => prevRoles.filter((role) => role.id !== id));
    };

    const handleEditRole = (id) => {
        const roleToEdit = roles.find((role) => role.id === id);
        if (roleToEdit) {
            setSelectedRole(roleToEdit);
            setIsModalOpen(true);
        }
    };    

    // Function to handle closing the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRole(null);
        console.log("Modal closed");
    };
    
    const handleSaveRole = (roleData) => {
        // Process the role data here
        console.log("Role saved:", roleData);

        // do other stuf hear

        setIsModalOpen(false);
        setSelectedRole(null);
        // Add the new role to your roles state
        // setRoles([...roles, roleData]);
    };

    return (
        <div className="roles-permissions-page">
            <CustomContainer
                className="!p-4"
                title="Roles List"
                titleCssClass="!text-2xl !font-semibold"
                headerActions={
                    <CustomButton
                        onClick={handleDefaultPages}
                        title="Pages selected here will be default for new role creation"
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 px-4 py-2 text-white shadow-md active:scale-95 transition-all duration-200"
                    >
                        set Default Pages
                    </CustomButton>
                }
                description="A role provides access to predefined menus and features, so depending on the assigned role, an administrator can access what the user needs."
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
                        />
                    ))}
                    <RoleCard
                        isNewRoleAdd={true}
                        onNewRoleClick={handleAddRole}
                    />
                </div>
            </CustomContainer>
            <UserListContainer />
            <AddEditRoleModel
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveRole}
                initialData={selectedRole}
            />
        </div>
    );
}

export default RolesPermissions;
