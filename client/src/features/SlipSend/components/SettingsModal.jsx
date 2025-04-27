import React, { useState, useEffect } from "react";
import { useUpload } from "../hooks/useUpload";
import {
    CustomModal,
    CustomTextInput,
    CustomButton,
} from "../../../components";
import "./settingsModal.css";

const SettingsModal = ({ isOpen, onClose, settings, onSave }) => {
    // Use upload hook to access contact information
    const { contacts } = useUpload();
    const totalContacts = contacts?.length || 0;
    
    const [formSettings, setFormSettings] = useState({
        batchSize: 100,
        pdfInterval: 10,
        batchInterval: 30,
    });

    useEffect(() => {
        if (settings) {
            setFormSettings({ ...settings });
        }
    }, [settings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Convert string values to numbers for these fields
        const numValue = parseInt(value, 10);

        if (!isNaN(numValue)) {
            setFormSettings({
                ...formSettings,
                [name]: numValue,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formSettings);
    };

    // Function to calculate estimated time
    const calculateEstimatedTime = () => {
        // Using the settings to estimate total duration in seconds
        if (!totalContacts) return "Calculating...";

        const batchCount = Math.ceil(totalContacts / formSettings.batchSize);
        const totalPdfTime = totalContacts * formSettings.pdfInterval;
        const totalBatchPauseTime =
            (batchCount - 1) * formSettings.batchInterval;

        const totalSeconds = totalPdfTime + totalBatchPauseTime;

        // Convert to hours and minutes
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        return `${hours}h ${minutes}m`;
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title="Distribution Settings"
            size="small"
        >
            <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group">
                    <label htmlFor="batchSize">Batch Size</label>
                    <CustomTextInput
                        id="batchSize"
                        name="batchSize"
                        type="number"
                        value={formSettings.batchSize}
                        onChange={handleChange}
                        min={1}
                        max={200}
                        required
                    />
                    <small>
                        Number of PDFs to send before pausing (recommended: 100)
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="pdfInterval">PDF Interval (seconds)</label>
                    <CustomTextInput
                        id="pdfInterval"
                        name="pdfInterval"
                        type="number"
                        value={formSettings.pdfInterval}
                        onChange={handleChange}
                        min={3}
                        max={30}
                        required
                    />
                    <small>Time between each PDF send (recommended: 10s)</small>
                </div>

                <div className="form-group">
                    <label htmlFor="batchInterval">
                        Batch Interval (seconds)
                    </label>
                    <CustomTextInput
                        id="batchInterval"
                        name="batchInterval"
                        type="number"
                        value={formSettings.batchInterval}
                        onChange={handleChange}
                        min={5}
                        max={300}
                        required
                    />
                    <small>Pause time between batches (recommended: 30s)</small>
                </div>

                <div className="estimated-time">
                    <span className="label">Estimated Total Time: </span>
                    <span className="value">{calculateEstimatedTime()}</span>
                </div>

                <div className="modal-actions">
                    <CustomButton
                        type="button"
                        onClick={onClose}
                        variant="secondary"
                    >
                        Cancel
                    </CustomButton>
                    <CustomButton type="submit" variant="primary">
                        Save Settings
                    </CustomButton>
                </div>
            </form>
        </CustomModal>
    );
};

export default SettingsModal;