import React, { useState } from "react";
import { CustomModal } from "../../../../components";

function WorkHistoryModel({ isFormOpen, setIsFormOpen }) {
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

export default WorkHistoryModel;
