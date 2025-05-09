import React, { useState, useEffect } from "react";
import { CustomModal, CustomTextInput } from "../../../components";
import { Info } from "lucide-react";

function AddEditRoleModel({ isOpen, onClose, onSave, initialData = null }) {
    const [roleName, setRoleName] = useState("");
    const [roleNameError, setRoleNameError] = useState(false);
    const [permissionError, setPermissionError] = useState(false);

    const defaultPermissions = [
        {
            feature: "Administrator Access",
            read: false,
            write: false,
            isAdmin: true,
            description: "Grants full access to all system features",
        },
        { feature: "User Management", read: false, write: false },
        { feature: "Role Management", read: false, write: false },
        { feature: "Content Management", read: false, write: false },
        { feature: "Reports", read: false, write: false },
        { feature: "Settings", read: false, write: false },
    ];

    const [permissions, setPermissions] = useState(defaultPermissions);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setRoleName(initialData.roleName || "");
                setPermissions(initialData.permissions?.length ? initialData.permissions : defaultPermissions);
            } else {
                setRoleName("");
                setPermissions(defaultPermissions);
            }
            setRoleNameError(false);
            setPermissionError(false);
        }
    }, [isOpen, initialData]);

    const handleSelectAll = (checked) => {
        setPermissions(
            permissions.map((perm) => ({
                ...perm,
                read: checked,
                write: checked,
            }))
        );
    };

    const handleTogglePermission = (index, type) => {
        const updatedPermissions = [...permissions];
        updatedPermissions[index][type] = !updatedPermissions[index][type];

        if (index === 0) {
            // Admin logic
            if (type === "read" && updatedPermissions[0].read) {
                updatedPermissions.forEach((p) => (p.read = true));
            } else if (type === "write" && updatedPermissions[0].write) {
                updatedPermissions.forEach((p) => {
                    p.read = true;
                    p.write = true;
                });
            }

            if (!updatedPermissions[0][type]) {
                if (type === "write") updatedPermissions[0].write = false;
                if (type === "read") {
                    updatedPermissions[0].read = false;
                    updatedPermissions[0].write = false;
                }
            }
        }

        setPermissions(updatedPermissions);
    };

    const handleSave = () => {
        const trimmedRoleName = roleName.trim();
        const isRoleNameValid = trimmedRoleName !== "";
        const isPermissionValid = permissions.some((p) => p.read || p.write);

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
                    <h3 className="font-medium text-lg mb-4">Role Permissions</h3>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-md">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                                        Feature
                                    </th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-700">
                                        Read
                                    </th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-700">
                                        Write
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {permissions.map((permission, index) => (
                                    <tr key={index} className="border-t border-gray-200">
                                        <td className="py-3 px-4 flex items-center">
                                            {permission.feature}
                                            {permission.isAdmin && (
                                                <div className="relative ml-2 group">
                                                    <Info size={16} className="text-blue-500" />
                                                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-sm p-2 rounded w-64">
                                                        {permission.description}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        {permission.isAdmin ? (
                                            <>
                                                <td className="py-3 px-4 text-center"></td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex items-center justify-center">
                                                        <input
                                                            type="checkbox"
                                                            className="h-4 w-4 text-blue-600 rounded mr-2"
                                                            onChange={(e) =>
                                                                handleSelectAll(e.target.checked)
                                                            }
                                                            checked={permissions.every((p) => p.read && p.write)}
                                                        />
                                                        <span className="text-xs text-gray-600">Select All</span>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex items-center justify-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={permission.read}
                                                            onChange={() => handleTogglePermission(index, "read")}
                                                            className="h-4 w-4 text-blue-600 rounded mr-2"
                                                        />
                                                        <span className="text-xs text-gray-600">Read</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex items-center justify-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={permission.write}
                                                            onChange={() => handleTogglePermission(index, "write")}
                                                            className="h-4 w-4 text-blue-600 rounded mr-2"
                                                            disabled={!permission.read}
                                                        />
                                                        <span className="text-xs text-gray-600">Write</span>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {permissionError && (
                        <p className="text-red-500 text-sm mt-2">
                            Please select at least one permission (Read or Write).
                        </p>
                    )}
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        {initialData ? "Update" : "Create"} Role
                    </button>
                </div>
            </div>
        </CustomModal>
    );
}

export default AddEditRoleModel;
