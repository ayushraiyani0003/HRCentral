import React, { useState, useRef, useEffect, forwardRef } from "react";
import {
    LoaderIcon,
    RotateIcon,
    CloseFullscreenIcon,
    OpenFullscreenIcon,
    PrevArrowIcon,
    NextArrowIcon,
    ErrorIcon,
    ZoomOutIcon,
    ZoomInIcon,
    ZoomResetIcon,
    FullscreenIcon,
    DownloadIcon,
    NextPageIcon,
} from "../../utils/SvgIcon";
import "./imagePreviewStyles.css";

const ImagePreview = forwardRef(
    /**
     * @typedef {Object} ImagePreviewProps
     * @property {string} [src] - Main image source.
     * @property {string} [label] - Label or title shown with the image.
     * @property {string} [alt] - Alt text for accessibility.
     * @property {string[]} [images] - List of image URLs for gallery mode.
     * @property {(index: number) => void} [onImageChange] - Callback when image is changed in gallery.
     * @property {boolean} [showControls] - Whether to show zoom/rotate controls.
     * @property {boolean} [showInfo] - Whether to show image metadata/info.
     * @property {boolean} [showCaption] - Show a caption below the image.
     * @property {boolean} [showThumbnails] - Display thumbnail previews.
     * @property {string} [caption] - Caption text to show.
     * @property {number} [initialZoom] - Starting zoom level (default: 1).
     * @property {number} [maxZoom] - Maximum zoom level allowed.
     * @property {string} [className] - Custom CSS classes.
     * @property {"small" | "medium" | "large"} [size] - Size of the image preview.
     * @property {"default" | "outlined" | "minimal"} [variant] - Visual variant style.
     * @property {"primary" | "secondary" | "success" | "warning" | "danger"} [color] - Color theme.
     * @property {string} [width] - Width of the image preview (e.g., "100%", "300px").
     * @property {string} [height] - Height of the image preview (e.g., "auto", "200px").
     * @property {boolean} [allowDownload] - If true, allows downloading the image.
     * @property {*} [extraFileDownload] - Optional extra file(s) to download.
     * @property {boolean} [allowRotate] - Enables image rotation.
     * @property {boolean} [lazyLoad] - Loads image lazily when in viewport.
     * @property {(error: Error) => void} [onError] - Callback when image fails to load.
     */

    /**
     * @param {ImagePreviewProps} props
     * @param {React.Ref<any>} ref
     */

    (
        {
            src,
            label,
            alt = "",
            images = [], // For gallery mode
            onImageChange,
            showControls = true,
            showInfo = true,
            showCaption = true,
            showThumbnails = true,
            caption,
            initialZoom = 1,
            maxZoom = 3,
            className = "",
            size = "medium", // small, medium, large
            variant = "default", // default, outlined, minimal
            color = "primary", // primary, secondary, success, warning, danger
            width = "100%", // Can be percentage or fixed pixels
            height = "auto", // Can be percentage or fixed pixels
            allowDownload = true,
            extraFileDownload,
            allowRotate = true,
            lazyLoad = true,
            onError,
            ...rest
        },
        ref
    ) => {
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(false);
        const [currentImage, setCurrentImage] = useState(
            src || (images.length > 0 ? images[0].src : "")
        );
        const [currentIndex, setCurrentIndex] = useState(0);
        const [zoom, setZoom] = useState(initialZoom);
        const [rotation, setRotation] = useState(0);
        const [position, setPosition] = useState({ x: 0, y: 0 });
        const [isDragging, setIsDragging] = useState(false);
        const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
        const [isFullscreen, setIsFullscreen] = useState(false);
        const [imageInfo, setImageInfo] = useState(null);

        const imageRef = useRef(null);
        const containerRef = useRef(null);
        const combinedRef = useRef(null);

        // Create a combined ref using forwardRef and internal ref
        const handleRef = (element) => {
            if (ref) {
                if (typeof ref === "function") {
                    ref(element);
                } else {
                    ref.current = element;
                }
            }
            combinedRef.current = element;
        };
        console.log(extraFileDownload);

        // Handle image load and error
        const handleImageLoad = (e) => {
            setLoading(false);
            setError(false);

            // Get image information
            if (showInfo && e.target) {
                setImageInfo({
                    width: e.target.naturalWidth,
                    height: e.target.naturalHeight,
                    aspectRatio: (
                        e.target.naturalWidth / e.target.naturalHeight
                    ).toFixed(2),
                });
            }
        };

        const handleImageError = (e) => {
            setLoading(false);
            setError(true);
            if (onError) {
                onError("Failed to load image");
                console.error("Failed to load image:", e);
            }
        };

        // Handle zoom controls
        const handleZoomIn = () => {
            setZoom((prev) => Math.min(prev + 0.25, maxZoom));
        };

        const handleZoomOut = () => {
            setZoom((prev) => Math.max(prev - 0.25, 0.5));
        };

        const handleZoomReset = () => {
            setZoom(initialZoom);
            setPosition({ x: 0, y: 0 });
        };

        // Handle rotation
        const handleRotate = (direction = "clockwise") => {
            setRotation(
                (prev) => (prev + (direction === "clockwise" ? 90 : -90)) % 360
            );
        };

        // Handle pan (drag) operations
        const handleMouseDown = (e) => {
            if (zoom > 1) {
                setIsDragging(true);
                setDragStart({
                    x: e.clientX - position.x,
                    y: e.clientY - position.y,
                });
            }
        };

        const handleMouseMove = (e) => {
            if (isDragging && zoom > 1) {
                setPosition({
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y,
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        // Handle fullscreen toggle
        const toggleFullscreen = () => {
            setIsFullscreen((prev) => !prev);
            if (!isFullscreen) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
        };

        // Exit fullscreen when ESC key is pressed
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
                document.body.style.overflow = "";
            }
        };

        // Handle download
        const handleDownload = () => {
            const link = document.createElement("a");
            link.href = currentImage;
            link.download = currentImage.split("/").pop() || "image";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        // Handle extra file download
        const handleExtraDownload = () => {
            try {
                // Force download attribute approach
                const link = document.createElement('a');
                link.href = extraFileDownload;
                link.setAttribute('download', ''); // Empty download attribute forces download
                link.setAttribute('target', '_blank');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error("Download error:", error);
                alert("Download failed. Please try again.");
            }
        };
        
        // Handle gallery navigation
        const handlePrevImage = () => {
            if (images.length > 1) {
                const newIndex =
                    (currentIndex - 1 + images.length) % images.length;
                setCurrentIndex(newIndex);
                setCurrentImage(images[newIndex].src);
                resetImageView();

                if (onImageChange) {
                    onImageChange(images[newIndex], newIndex);
                }
            }
        };

        const handleNextImage = () => {
            if (images.length > 1) {
                const newIndex = (currentIndex + 1) % images.length;
                setCurrentIndex(newIndex);
                setCurrentImage(images[newIndex].src);
                resetImageView();

                if (onImageChange) {
                    onImageChange(images[newIndex], newIndex);
                }
            }
        };

        const handleThumbnailClick = (index) => {
            setCurrentIndex(index);
            setCurrentImage(images[index].src);
            resetImageView();

            if (onImageChange) {
                onImageChange(images[index], index);
            }
        };

        // Reset image view after navigation
        const resetImageView = () => {
            setZoom(initialZoom);
            setRotation(0);
            setPosition({ x: 0, y: 0 });
            setLoading(true);
        };

        // Add event listener for ESC key when component mounts or fullscreen state changes
        useEffect(() => {
            // Add event listener for the ESC key
            document.addEventListener('keydown', handleKeyDown);
            
            // Cleanup on unmount
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                if (isFullscreen) {
                    document.body.style.overflow = "";
                }
            };
        }, [isFullscreen]); // Re-run when fullscreen state changes

        // Set current image if src prop changes
        useEffect(() => {
            if (src) {
                setCurrentImage(src);
                resetImageView();
            }
        }, [src]);

        // Set first image if images array changes
        useEffect(() => {
            if (images.length > 0 && !src) {
                setCurrentImage(images[0].src);
                setCurrentIndex(0);
                resetImageView();
            }
        }, [images]);

        // Size class mapping
        const sizeClasses = {
            small: "image-preview-small",
            medium: "image-preview-medium",
            large: "image-preview-large",
        };

        // Variant class mapping
        const variantClasses = {
            default: "image-preview-default",
            outlined: "image-preview-outlined",
            minimal: "image-preview-minimal",
        };

        // Color class mapping
        const colorClasses = {
            primary: "image-preview-primary",
            secondary: "image-preview-secondary",
            success: "image-preview-success",
            warning: "image-preview-warning",
            danger: "image-preview-danger",
        };

        // Dynamic styles for container and image
        const containerStyle = {
            width: width,
            height: height,
        };

        const imageStyle = {
            transform: `scale(${zoom}) rotate(${rotation}deg) translate(${
                position.x / zoom
            }px, ${position.y / zoom}px)`,
            cursor: zoom > 1 ? "grab" : "default",
        };

        if (isDragging && zoom > 1) {
            imageStyle.cursor = "grabbing";
        }

        return (
            <div
                ref={handleRef}
                className={`image-preview-container ${className}`}
                style={containerStyle}
            >
                {label && <label className="file-upload-label">{label}</label>}
                <div
                    ref={containerRef}
                    className={`image-preview-wrapper ${
                        sizeClasses[size] || sizeClasses.medium
                    } ${variantClasses[variant] || variantClasses.default} ${
                        colorClasses[color] || colorClasses.primary
                    } ${error ? "has-error" : ""} ${
                        isFullscreen ? "fullscreen" : ""
                    }`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {loading && (
                        <div className="image-preview-loader">
                            <LoaderIcon width={40} height={40} />
                        </div>
                    )}

                    {error && (
                        <div className="image-preview-error">
                            <ErrorIcon />
                            <p>Failed to load image</p>
                        </div>
                    )}

                    {currentImage && !error && (
                        <img
                            ref={imageRef}
                            src={currentImage}
                            alt={
                                alt ||
                                (images[currentIndex] &&
                                    images[currentIndex].alt) ||
                                "Image"
                            }
                            className="image-preview-img"
                            style={{
                                ...imageStyle,
                                position: "relative",
                                height: "100%",
                            }}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            loading={lazyLoad ? "lazy" : "eager"}
                            onClick={toggleFullscreen}
                            title="Click to toggle fullscreen"
                            {...rest}
                        />
                    )}

                    {showControls && !error && (
                        <div className="image-preview-controls">
                            <div className="image-preview-controls-group">
                                <button
                                    className="image-preview-control-button"
                                    onClick={handleZoomOut}
                                    title="Zoom out"
                                    disabled={zoom <= 0.5}
                                >
                                    <ZoomOutIcon />
                                </button>
                                <button
                                    className="image-preview-control-button"
                                    onClick={handleZoomIn}
                                    title="Zoom in"
                                    disabled={zoom >= maxZoom}
                                >
                                    <ZoomInIcon />
                                </button>
                                <button
                                    className="image-preview-control-button"
                                    onClick={handleZoomReset}
                                    title="Reset zoom"
                                >
                                    <ZoomResetIcon />
                                </button>

                                {allowRotate && (
                                    <button
                                        className="image-preview-control-button"
                                        onClick={() =>
                                            handleRotate("clockwise")
                                        }
                                        title="Rotate"
                                    >
                                        <RotateIcon />
                                    </button>
                                )}

                                <button
                                    className="image-preview-control-button"
                                    onClick={toggleFullscreen}
                                    title={
                                        isFullscreen
                                            ? "Exit fullscreen"
                                            : "Fullscreen"
                                    }
                                >
                                    {isFullscreen ? (
                                        <CloseFullscreenIcon />
                                    ) : (
                                        <FullscreenIcon />
                                    )}
                                </button>

                                {allowDownload && (
                                    <button
                                        className="image-preview-control-button"
                                        onClick={handleDownload}
                                        title="Download Image"
                                    >
                                        <DownloadIcon />
                                    </button>
                                )}
                                {extraFileDownload !== null && (
                                    <button
                                        className="image-preview-control-button"
                                        onClick={handleExtraDownload}
                                        title="Download Files"
                                    >
                                        <DownloadIcon />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation arrows for gallery mode */}
                    {images.length > 1 && !error && (
                        <>
                            <button
                                className="image-preview-nav-button prev"
                                onClick={handlePrevImage}
                                title="Previous image"
                            >
                                <PrevArrowIcon />
                            </button>
                            <button
                                className="image-preview-nav-button next"
                                onClick={handleNextImage}
                                title="Next image"
                            >
                                <NextPageIcon />
                            </button>
                        </>
                    )}
                </div>

                {/* Image thumbnails for gallery mode */}
                {images.length > 1 && showThumbnails && !error && (
                    <div className="image-preview-thumbnails">
                        {images.map((image, index) => (
                            <div
                                key={`thumbnail-${index}`}
                                className={`image-preview-thumbnail ${
                                    index === currentIndex ? "active" : ""
                                }`}
                                onClick={() => handleThumbnailClick(index)}
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt || `Thumbnail ${index + 1}`}
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Image information */}
                {!error && showInfo && imageInfo && (
                    <div className="image-preview-info">
                        <div className="image-preview-info-item">
                            <span>Dimensions:</span> {imageInfo.width} ×{" "}
                            {imageInfo.height}px
                        </div>
                        <div className="image-preview-info-item">
                            <span>Aspect Ratio:</span> {imageInfo.aspectRatio}
                        </div>
                        {images.length > 1 && (
                            <div className="image-preview-info-item">
                                <span>Image:</span> {currentIndex + 1} /{" "}
                                {images.length}
                            </div>
                        )}
                    </div>
                )}

                {/* Image caption */}
                {!error &&
                    showCaption &&
                    (caption ||
                        (images[currentIndex] &&
                            images[currentIndex].caption)) && (
                        <div className="image-preview-caption">
                            {caption || images[currentIndex].caption}
                        </div>
                    )}
            </div>
        );
    }
);

export default ImagePreview;