import React from "react";
import { CustomButton, CustomContainer } from "../../../components";
import { DeleteIcon } from "../../../utils/SvgIcon";
import ladyLaptopImage from "../../../assets/images/role&permission/lady-with-laptop-light.png";

// Import CSS for custom styling
import "./RoleCard.css";
import { Link } from "react-router-dom";

function RoleCard({
    isNewRoleAdd = false,
    onNewRoleClick,
    totalUser = 0,
    onEditRoleClick,
    onDeleteClick,
    roleName = "Default Role",
    roleAssignedUserImages = [
        "https://i.pravatar.cc/40?img=1",
        "https://i.pravatar.cc/40?img=2",
        "https://i.pravatar.cc/40?img=3",
        "https://i.pravatar.cc/40?img=4",
        "https://i.pravatar.cc/40?img=4",
        "https://i.pravatar.cc/40?img=4",
    ],
}) {
    return (
        <CustomContainer
            style={{
                height: "auto",
                minHeight: "140px",
                backgroundColor: "#f9fafb",
            }}
            className="role-card !m-0 !p-4 !shadow-sm !hover:shadow-md transition-all duration-300"
        >
            {isNewRoleAdd ? (
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 py-2">
                    {/* First column: SVG illustration */}
                    <div className="laptop-image flex justify-center md:justify-start">
                        <img
                            src={ladyLaptopImage}
                            alt="Lady with laptop"
                            className="lady-with-laptop"
                        />
                    </div>

                    {/* Second column: Button and description */}
                    <div className="flex flex-col items-center md:items-end gap-3 h-full">
                        <CustomButton
                            children={"Add New Role"}
                            icon={<DeleteIcon />}
                            className="bg-indigo-500 hover:bg-indigo-600 focus:outline-none !focus:ring-0 !focus:ring-offset-0 transition-colors duration-300 w-full md:w-auto"
                            onClick={onNewRoleClick}
                        />
                        <span className="text-gray-600 text-center md:text-right text-sm">
                            Add new role,
                            <br />
                            if it doesn't exist.
                        </span>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col justify-between h-full py-2">
                    {/* Top row (users + avatars) */}
                    <div className="flex flex-row flex-wrap justify-between items-center gap-2">
                        <span className="text-sm font-normal text-gray-600">
                            Total {totalUser} users
                        </span>
                        <div className="flex -space-x-3 overflow-hidden">
                            {roleAssignedUserImages
                                .slice(
                                    0,
                                    roleAssignedUserImages.length === 5 ? 5 : 4
                                )
                                .map((imgUrl, idx) => (
                                    <img
                                        key={idx}
                                        className="avatar-img inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-sm hover:cursor-pointer"
                                        src={imgUrl}
                                        alt={`User ${idx + 1}`}
                                    />
                                ))}
                            {roleAssignedUserImages.length > 5 && (
                                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-xs font-medium text-gray-700 ring-2 ring-white shadow-sm">
                                    +{roleAssignedUserImages.length - 5}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Bottom row (role name + edit/delete) */}
                    <div className="flex flex-row justify-between items-end mt-4">
                        <div className="flex flex-col">
                            <h1 className="text-lg font-medium text-gray-800">
                                {roleName}
                            </h1>
                            <span
                                onClick={onEditRoleClick}
                                className="edit-link text-sm font-normal text-indigo-500 hover:text-indigo-600 cursor-pointer transition-colors duration-200"
                            >
                                Edit Role
                            </span>
                        </div>
                        <button
                            onClick={onDeleteClick}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-red-500 transition-colors duration-200 focus:outline-none"
                            aria-label="Delete role"
                        >
                            <DeleteIcon />
                        </button>
                    </div>
                </div>
            )}
        </CustomContainer>
    );
}

export default RoleCard;
