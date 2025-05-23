import React from "react";
import { CustomButton } from "../../../../../components";

function HeaderButtons(
    { onAddEmployee, onImportEmployees }
) {
    return (
        <div className="flex justify-start items-center p-2 pb-4 border-b-1 border-gray-200">
            <CustomButton
                variant="primary"
                size="medium"
                leftIcon={<div className="w-4 h-4">+</div>}
                onClick={onAddEmployee}
            >
                Add Employee
            </CustomButton>
            <CustomButton variant="secondary" size="medium" className="ml-4" onClick={onImportEmployees}>
                Import Employees
            </CustomButton>
        </div>
    );
}

export default HeaderButtons;
