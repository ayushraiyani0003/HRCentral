import React, { useState } from "react";
import { CustomModal } from "../../../../components";

function SkillModel({ isFormOpen, setIsFormOpen }) {
    return (
        <CustomModal
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            title="Work History Modal"
        >
            <p>This is the modal content.</p>
        </CustomModal>
    );
}

export default SkillModel;
