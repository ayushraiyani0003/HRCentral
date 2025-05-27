import React, { useState, forwardRef, useRef, useEffect } from "react";
import "./richTextEditorStyles.css";

// Usage:
{
    /* <h2>Rich Text Editor Example</h2>
            
            <RichTextEditor
                label="Comment"
                placeholder="Enter your formatted comment here..."
                value={content}
                onChange={handleChange}
                onClear={handleClear}
                required={true}
                error={error}
                toolbarOptions={["bold", "italic", "underline", "list"]}
                minHeight="150px"
                maxHeight="400px"
            />
            
            <div style={{ marginTop: "2rem" }}>
                <h3>Preview</h3>
                {content ? (
                    <div
                        style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.5rem",
                            padding: "1rem",
                            backgroundColor: "#f9fafb"
                        }}
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                ) : (
                    <p style={{ color: "#9ca3af" }}>No content yet</p>
                )} 
            </div>*/
}

const RichTextEditor = forwardRef(
    (
        {
            label,
            value,
            onChange,
            onClear,
            placeholder,
            required = false,
            className = "",
            error = "",
            toolbarOptions = ["bold", "italic", "underline", "list"],
            minHeight = "120px",
            maxHeight = "300px",
            disabled = false,
            readOnly = false,
            ...rest
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const editorRef = useRef(null);
        const combinedRef = useRef(null);

        // Handle refs properly (external + internal)
        useEffect(() => {
            if (typeof ref === "function") {
                ref(editorRef.current);
            } else if (ref) {
                ref.current = editorRef.current;
            }
            combinedRef.current = editorRef.current;
        }, [ref]);

        // Handle focus state
        const handleFocus = () => setIsFocused(true);
        const handleBlur = () => setIsFocused(false);

        // Execute format commands
        const executeCommand = (command, value = null) => {
            document.execCommand(command, false, value);
            combinedRef.current.focus();
        };

        // Clear editor content handler
        const handleClear = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onClear) {
                onClear();
            } else {
                combinedRef.current.innerHTML = "";
                if (onChange) {
                    onChange("");
                }
            }
        };

        // Handle content changes
        const handleInput = () => {
            if (onChange) {
                onChange(combinedRef.current.innerHTML);
            }
        };

        // Handle pasting to strip formatting
        const handlePaste = (e) => {
            e.preventDefault();
            const text = (e.originalEvent || e).clipboardData.getData(
                "text/plain"
            );
            document.execCommand("insertText", false, text);
        };

        // Check if content is not empty to show the clear button
        const showClearButton = value && value.trim() !== "";

        // Initialize editor content when value prop changes
        useEffect(() => {
            if (combinedRef.current && value !== undefined && value !== null) {
                if (combinedRef.current.innerHTML !== value) {
                    combinedRef.current.innerHTML = value;
                }
            }
        }, [value]);

        // Render format buttons based on options
        const renderFormatButtons = () => {
            const buttons = [];

            if (toolbarOptions.includes("bold")) {
                buttons.push(
                    <button
                        key="bold"
                        type="button"
                        className="format-button"
                        onClick={() => executeCommand("bold")}
                        title="Bold"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="16"
                            height="16"
                        >
                            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                        </svg>
                    </button>
                );
            }

            if (toolbarOptions.includes("italic")) {
                buttons.push(
                    <button
                        key="italic"
                        type="button"
                        className="format-button"
                        onClick={() => executeCommand("italic")}
                        title="Italic"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="16"
                            height="16"
                        >
                            <line x1="19" y1="4" x2="10" y2="4"></line>
                            <line x1="14" y1="20" x2="5" y2="20"></line>
                            <line x1="15" y1="4" x2="9" y2="20"></line>
                        </svg>
                    </button>
                );
            }

            if (toolbarOptions.includes("underline")) {
                buttons.push(
                    <button
                        key="underline"
                        type="button"
                        className="format-button"
                        onClick={() => executeCommand("underline")}
                        title="Underline"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="16"
                            height="16"
                        >
                            <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
                            <line x1="4" y1="21" x2="20" y2="21"></line>
                        </svg>
                    </button>
                );
            }

            if (toolbarOptions.includes("list")) {
                buttons.push(
                    <button
                        key="unordered-list"
                        type="button"
                        className="format-button"
                        onClick={() => executeCommand("insertUnorderedList")}
                        title="Bullet List"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="16"
                            height="16"
                        >
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                    </button>
                );

                buttons.push(
                    <button
                        key="ordered-list"
                        type="button"
                        className="format-button"
                        onClick={() => executeCommand("insertOrderedList")}
                        title="Numbered List"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="16"
                            height="16"
                        >
                            <line x1="10" y1="6" x2="21" y2="6"></line>
                            <line x1="10" y1="12" x2="21" y2="12"></line>
                            <line x1="10" y1="18" x2="21" y2="18"></line>
                            <path d="M4 6h1v4"></path>
                            <path d="M4 10h2"></path>
                            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                        </svg>
                    </button>
                );
            }

            return buttons;
        };

        return (
            <div className={`rich-text-editor-container ${className}`}>
                {label && (
                    <label className="rich-text-editor-label">
                        {label}
                        {required && <span className="required-mark">*</span>}
                    </label>
                )}

                {toolbarOptions.length > 0 && (
                    <div className="rich-text-editor-toolbar">
                        <div className="format-buttons">
                            {renderFormatButtons()}
                        </div>
                    </div>
                )}

                <div
                    className={`rich-text-editor-wrapper ${
                        isFocused ? "focused" : ""
                    } ${error ? "has-error" : ""}`}
                >
                    <div
                        ref={editorRef}
                        className="rich-text-editor-field"
                        contentEditable={!(disabled || readOnly)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onInput={handleInput}
                        onPaste={handlePaste}
                        data-placeholder={placeholder}
                        style={{ minHeight, maxHeight }}
                        {...rest}
                    />

                    <div className="rich-text-editor-icons">
                        {showClearButton && !(disabled || readOnly) && (
                            <button
                                type="button"
                                className="clear-editor-button"
                                onClick={handleClear}
                                aria-label="Clear editor"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="clear-icon"
                                    width="20"
                                    height="20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {error && <div className="input-error-message">{error}</div>}
            </div>
        );
    }
);

export default RichTextEditor;
