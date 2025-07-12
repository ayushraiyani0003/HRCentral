import React, { useState } from "react";
import { CustomModal } from "../../../../components";

function EduModel({ isFormOpen, setIsFormOpen }) {
    return (
        <CustomModal
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            title="Education Modal"
        >
            <p>This is the modal content.</p>
        </CustomModal>
    );
}

export default EduModel;
