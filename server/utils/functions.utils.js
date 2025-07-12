/**
 * Creates a natural-feeling delay based on mode ('normal' or 'batch').
 * Author: Ayush Raiyani
 * 
 * @param {number} baseInterval - Base interval in seconds
 * @param {string} mode - 'normal' or 'batch'
 * @returns {number} - Natural delay in milliseconds
 */
const createNaturalDelay = (baseInterval, mode = "normal") => {
    let minMs, maxMs;

    if (mode === "normal") {
        // For normal: add ±40% randomness roughly
        minMs = baseInterval * 0.6 * 1000; // 60% of base
        maxMs = baseInterval * 1.6 * 1000; // 160% of base
    } else if (mode === "batch") {
        // For batch: much larger window
        if (baseInterval < 60) {
            baseInterval = 60; // Minimum 1 minute
        }

        // Add ±50% randomness for batch processes
        minMs = baseInterval * 0.5 * 1000; // 50% of base
        maxMs = baseInterval * 1.5 * 1000; // 150% of base
    } else {
        throw new Error("Invalid mode. Use 'normal' or 'batch'.");
    }

    const randomDelay = Math.random() * (maxMs - minMs) + minMs;
    return Math.round(randomDelay);
};

// Using CommonJS exports
module.exports = { createNaturalDelay };
