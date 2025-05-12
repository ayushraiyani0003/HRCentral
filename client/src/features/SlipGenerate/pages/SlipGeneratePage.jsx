import React, { useState, useEffect } from "react";
import {
    CustomContainer,
    FileUpload,
    ImagePreview,
    CustomTable,
} from "../../../components";
import { useSlipGenerator } from "../hooks/useSlipGenerator";

function SlipGeneratePage() {
    const {
        selectedFiles,
        handleFileUpload,
        startSlipGeneration,
        loading,
        streaming,
        isProcessing,
        success,
        completed,
        error,
        progress,
        progressPercentage,
        zipFiles,
        slipData,
    } = useSlipGenerator();

    console.log(slipData);
    

    const [tableData, setTableData] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        generated: 0,
        failed: 0,
        pending: 0,
    });

    const previewImage =
        "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg";
    const SampleExcelFileDownload = { name: "Sample Excel File", url: "#" };

    const columns = [
        { header: "Sr No", accessor: "srNo", key: "srNo" },
        { header: "Punch Code", accessor: "punchCode", key: "punchCode" },
        { header: "Name", accessor: "name", key: "name" },
        { header: "Phone No", accessor: "phoneNo", key: "phoneNo" },
        {
            key: "status",
            header: "Status",
            accessor: "status",
            cell: (row) => {
                let statusColor = "gray";
                if (row.status === "success") statusColor = "green";
                else if (row.status === "failed") statusColor = "red";
                else if (row.status === "pending") statusColor = "orange";
                else if (row.status === "processing") statusColor = "blue";

                return (
                    <div className="status-cell !justify-normal gap-2">
                        <span
                            className={`status-indicator ${statusColor}`}
                        ></span>
                        <span>{row.status}</span>
                    </div>
                );
            },
        },
        {
            key: "errorMessage",
            header: "Reason",
            accessor: "errorMessage",
            cell: (row) => (
                <div className="whitespace-pre-wrap text-sm text-gray-700">
                    {row.errorMessage || "--"}
                </div>
            ),
        },
    ];

    useEffect(() => {
        if (slipData && slipData.length > 0) {
            setTableData(slipData);

            // Calculate statistics dynamically
            const total = slipData.length;
            const generated = slipData.filter(
                (d) => d.status === "success"
            ).length;
            const failed = slipData.filter(
                (d) => d.status === "failed"
            ).length;
            const pending = slipData.filter(
                (d) => d.status === "pending"
            ).length;

            setStats({ total, generated, failed, pending });
        }
    }, [slipData]);

    const StatCard = ({ title, value, color, icon }) => (
        <div
            className={`bg-white rounded-lg shadow-md p-4 border-l-4 border-${color}-500 flex items-center`}
        >
            <div className={`bg-${color}-100 p-3 rounded-full mr-4`}>
                <span className={`text-${color}-500`}>{icon}</span>
            </div>
            <div>
                <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );

    return (
        <CustomContainer title="Slip Generate" className="h-full">
            <div className="flex flex-col space-y-4">
                <div className="upload-section flex flex-row gap-3">
                    <div className="flex-1">
                        <FileUpload
                            onFilesSelected={handleFileUpload}
                            accept=".excel,.xls,.xlsx"
                            multiple={false}
                            maxFileSize={200 * 1024 * 1024}
                            maxFiles={1}
                            buttonText="Choose Excel File"
                            dragDropText="Drag & drop Excel file here"
                            label="Upload Excel file (containing all details to generate the slip)"
                            errorText="Please select a valid Excel file"
                            showPreview={true}
                        />
                    </div>
                    <div className="flex-1">
                        <ImagePreview
                            label="Expected Excel File Structure"
                            className="h-full"
                            src={previewImage}
                            size="small"
                            height="285px"
                            showControls={true}
                            showInfo={false}
                            showCaption={true}
                            showThumbnails={true}
                            extraFileDownload={SampleExcelFileDownload}
                        />
                    </div>
                </div>

                {selectedFiles && selectedFiles.length > 0 && (
                    <div className="flex justify-center mt-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                            onClick={startSlipGeneration}
                            disabled={isProcessing}
                        >
                            {loading
                                ? "Uploading..."
                                : streaming
                                ? "Processing..."
                                : "Upload"}
                        </button>
                    </div>
                )}
            </div>

            <div className="my-6 border-t border-gray-200"></div>

            {/* Show error message if any */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {/* Progress bar */}
            <div className="w-full mt-4 flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    File Generate Progress
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-[9px] shadow-inner overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-blue-700 h-[9px] transition-all duration-500 ease-in-out"
                        style={{
                            width: `${progressPercentage}%`,
                        }}
                    ></div>
                </div>
                <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                    {progressPercentage}%
                </span>
            </div>

            {/* Display zip files for download if available */}
            {zipFiles && zipFiles.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Download Generated Slips:</h3>
                    <div className="flex flex-wrap gap-2">
                        {zipFiles.map((zipFile, index) => (
                            <a
                                key={index}
                                href={zipFile.url}
                                download={zipFile.name}
                                className="bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-3 rounded text-sm flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                {zipFile.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            <div className="my-6 border-t border-gray-200"></div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-[16%]">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Slip Statistics
                    </h2>
                    <div className="flex flex-col gap-4">
                        <StatCard
                            title="Total Slips"
                            value={stats.total}
                            color="blue"
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            }
                        />
                        <StatCard
                            title="Generated"
                            value={stats.generated}
                            color="green"
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            }
                        />
                        <StatCard
                            title="Failed"
                            value={stats.failed}
                            color="red"
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            }
                        />
                        <StatCard
                            title="Pending"
                            value={stats.pending}
                            color="amber"
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            }
                        />
                    </div>
                </div>

                <div className="lg:w-[100%]">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Slip Generation Status
                    </h2>
                    <CustomTable
                        columns={columns}
                        data={tableData}
                        pagination={true}
                        itemsPerPage={10}
                        searchable={true}
                        filterableColumns={["status", "errorMessage"]}
                        loading={isProcessing}
                    />
                </div>
            </div>
        </CustomContainer>
    );
}

export default SlipGeneratePage;
