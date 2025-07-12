import React, { useState, useRef, forwardRef } from "react";

import "./fileUploadStyles.css";

const FileUpload = forwardRef(
    (
        {
            label,
            accept = "*/*",
            multiple = false,
            maxFileSize = 10 * 1024 * 1024, // 10MB default
            maxFiles = 5,
            onFilesSelected,
            onFileRemove,
            onError,
            width = "100%",
            height = "100%",
            showPreview = true,
            required = false,
            className = "",
            buttonText = "Choose Files",
            dragDropText = "Drag & drop files here",
            error = "",
            size = "medium", // small, medium, large
            variant = "default", // default, outlined, minimal
            color = "primary", // primary, secondary, success, warning, danger
            ...rest
        },
        ref
    ) => {
        const [files, setFiles] = useState([]);
        const [isDragging, setIsDragging] = useState(false);
        const fileInputRef = useRef(null);
        const dropAreaRef = useRef(null);

        // Create a combined ref using forwardRef and internal ref
        const handleRef = (element) => {
            if (ref) {
                if (typeof ref === "function") {
                    ref(element);
                } else {
                    ref.current = element;
                }
            }
            fileInputRef.current = element;
        };

        // Convert bytes to readable format
        const formatFileSize = (bytes) => {
            if (bytes === 0) return "0 Bytes";
            const k = 1024;
            const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return (
                parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
            );
        };

        // Get file extension
        const getFileExtension = (filename) => {
            return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
        };

        // Get file icon based on file type
        const getFileIcon = (file) => {
            const extension = getFileExtension(file.name).toLowerCase();

            if (file.type.startsWith("image/")) {
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="file-icon image-icon"
                    >
                        <path
                            fillRule="evenodd"
                            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            }

            if (file.type.startsWith("video/")) {
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="file-icon video-icon"
                    >
                        <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
                    </svg>
                );
            }

            if (["pdf"].includes(extension)) {
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="file-icon pdf-icon"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM9.75 17.25a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-.75zm2.25-3a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-5.25z"
                            clipRule="evenodd"
                        />
                        <path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434A9.768 9.768 0 0116.5 4.5c1.603 0 3.068.566 4.22 1.5l-.675.675a3 3 0 01-3.182.773l-.441-.196A3 3 0 0014.25 5.25z" />
                    </svg>
                );
            }

            if (["doc", "docx", "txt", "rtf"].includes(extension)) {
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="file-icon document-icon"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
                            clipRule="evenodd"
                        />
                        <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                    </svg>
                );
            }

            // Default file icon
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="file-icon default-icon"
                >
                    <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                    <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                </svg>
            );
        };

        // Validate files
        const validateFiles = (fileList) => {
            const validatedFiles = [];
            const errors = [];

            // Check if adding more files exceeds maxFiles
            if (files.length + fileList.length > maxFiles) {
                errors.push(`You can upload a maximum of ${maxFiles} files`);
                onError && onError(errors);
                return { validatedFiles, errors };
            }

            // Check file types and sizes
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];

                // Check if file already exists in the list
                const isDuplicate = files.some(
                    (f) => f.name === file.name && f.size === file.size
                );
                if (isDuplicate) {
                    errors.push(`File "${file.name}" is already selected`);
                    continue;
                }

                // Check file size
                if (file.size > maxFileSize) {
                    errors.push(
                        `File "${
                            file.name
                        }" exceeds the maximum file size of ${formatFileSize(
                            maxFileSize
                        )}`
                    );
                    continue;
                }

                // Check file type if accept is specified
                if (accept !== "*/*") {
                    const acceptTypes = accept
                        .split(",")
                        .map((type) => type.trim());
                    const fileType = file.type;
                    const fileExt = `.${getFileExtension(
                        file.name
                    ).toLowerCase()}`;

                    const isAccepted = acceptTypes.some((type) => {
                        if (type.startsWith(".")) {
                            // Extension check
                            return type.toLowerCase() === fileExt;
                        } else if (type.endsWith("/*")) {
                            // Mime type category check (e.g., "image/*")
                            const category = type.split("/")[0];
                            return fileType.startsWith(`${category}/`);
                        } else {
                            // Exact mime type check
                            return type === fileType;
                        }
                    });

                    if (!isAccepted) {
                        errors.push(
                            `File "${file.name}" has an unsupported file type`
                        );
                        continue;
                    }
                }

                // File passed all checks
                validatedFiles.push(file);
            }

            if (errors.length > 0 && onError) {
                onError(errors);
            }

            return { validatedFiles, errors };
        };

        // Handle file selection
        const handleFileChange = (e) => {
            const fileList = e.target.files;
            if (!fileList || fileList.length === 0) return;

            const { validatedFiles, errors } = validateFiles(fileList);

            if (validatedFiles.length > 0) {
                const newFiles = [...files, ...validatedFiles];
                setFiles(newFiles);

                // Reset the input value to allow selecting the same file again
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }

                // Call the callback with the validated files
                if (onFilesSelected) {
                    onFilesSelected(newFiles);
                }
            }
        };

        // Handle file removal
        const handleRemoveFile = (index) => {
            const newFiles = [...files];
            const removedFile = newFiles.splice(index, 1)[0];
            setFiles(newFiles);

            // Call the callback with the updated files
            if (onFileRemove) {
                onFileRemove(removedFile, newFiles);
            }

            if (onFilesSelected) {
                onFilesSelected(newFiles);
            }
        };

        // Handle drag events
        const handleDragEnter = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
        };

        const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isDragging) setIsDragging(true);
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Only set dragging to false if the drag leaves the drop area
            // and not when entering a child element
            if (
                dropAreaRef.current &&
                !dropAreaRef.current.contains(e.relatedTarget)
            ) {
                setIsDragging(false);
            }
        };

        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const items = e.dataTransfer.items;
            const fileList = e.dataTransfer.files;

            // If dataTransfer.items is supported, use it (allows folder dropping)
            if (items && items.length > 0 && items[0].webkitGetAsEntry) {
                // TODO: Add folder support if needed
                handleFileChange({ target: { files: fileList } });
            } else if (fileList && fileList.length > 0) {
                // Fallback to files
                handleFileChange({ target: { files: fileList } });
            }
        };

        // Trigger file input click
        const handleButtonClick = () => {
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }
        };

        // Size class mapping
        const sizeClasses = {
            small: "file-upload-small",
            medium: "file-upload-medium",
            large: "file-upload-large",
        };

        // Variant class mapping
        const variantClasses = {
            default: "file-upload-default",
            outlined: "file-upload-outlined",
            minimal: "file-upload-minimal",
        };

        // Color class mapping
        const colorClasses = {
            primary: "file-upload-primary",
            secondary: "file-upload-secondary",
            success: "file-upload-success",
            warning: "file-upload-warning",
            danger: "file-upload-danger",
        };
        // Dynamic styles for container and image
        const containerStyle = {
            width: width,
            height: height,
        };

        return (
            <div
                className={`file-upload-container ${className}`}
                style={containerStyle}
            >
                {label && (
                    <label className="file-upload-label">
                        {label}
                        {required && <span className="required-mark">*</span>}
                    </label>
                )}

                <div
                    ref={dropAreaRef}
                    className={`file-upload-drop-area ${
                        isDragging ? "dragging" : ""
                    } ${error ? "has-error" : ""} ${
                        sizeClasses[size] || sizeClasses.medium
                    } ${variantClasses[variant] || variantClasses.default} ${
                        colorClasses[color] || colorClasses.primary
                    }`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        ref={handleRef}
                        className="file-upload-input"
                        onChange={handleFileChange}
                        accept={accept}
                        multiple={multiple}
                        {...rest}
                    />

                    <div className="file-upload-content">
                        <div className="file-upload-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="upload-icon"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="file-upload-text">
                            <p className="file-upload-drag-text">
                                {dragDropText}
                            </p>
                            <p className="file-upload-or">or</p>
                            <button
                                type="button"
                                className="file-upload-button"
                                onClick={handleButtonClick}
                            >
                                {buttonText}
                            </button>
                        </div>

                        {accept !== "*/*" && (
                            <p className="file-upload-hint">
                                Accepted file types:{" "}
                                {accept.split(",").join(", ")}
                            </p>
                        )}

                        <p className="file-upload-hint">
                            Max file size: {formatFileSize(maxFileSize)} | Max
                            files: {maxFiles}
                        </p>
                    </div>
                </div>

                {error && <div className="file-upload-error">{error}</div>}

                {files.length > 0 && showPreview && (
                    <div className="file-upload-preview">
                        <ul className="file-upload-preview-list">
                            {files.map((file, index) => (
                                <li
                                    key={`${file.name}-${index}`}
                                    className="file-upload-preview-item"
                                >
                                    <div className="file-upload-preview-info">
                                        {getFileIcon(file)}
                                        <div className="file-upload-preview-details">
                                            <span
                                                className="file-upload-preview-name"
                                                title={file.name}
                                            >
                                                {file.name}
                                            </span>
                                            <span className="file-upload-preview-size">
                                                {formatFileSize(file.size)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="file-upload-action-button remove-button"
                                        onClick={() => handleRemoveFile(index)}
                                        aria-label="Remove file"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className="remove-icon"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }
);

export default FileUpload;
