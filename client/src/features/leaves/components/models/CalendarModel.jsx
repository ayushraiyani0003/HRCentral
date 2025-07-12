import React from "react";
import {
    CustomModal,
    FileUpload,
    CustomizableTimeline,
    CustomTextInput,
    ModernDateRangePicker,
    CustomDropdown,
} from "../../../../components";

function CalendarModel({
    CalendarModelOpen,
    setCalendarModelOpen,
    selectedDate,
}) {
    // Reset form when modal closes
    const handleModalClose = () => {
        setCalendarModelOpen(false);
    };

    return (
        <CustomModal
            isOpen={CalendarModelOpen}
            onClose={handleModalClose}
            title="Add New Employee"
            size="large"
            showCloseButton={true}
            closeOnOverlayClick={false} // Prevent accidental closes
            closeOnEscape={true}
            bodyClassName="!px-6 !py-3"
        >
            <div className="px-6 py-0">
                {/* Timeline Component */}
                open the model for disply the content
                {selectedDate}
            </div>
        </CustomModal>
    );
}

export default CalendarModel;
