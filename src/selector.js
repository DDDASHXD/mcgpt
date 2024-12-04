import { uiUtils } from "./utils";
import { SETTINGS } from "./config/settings";

class ElementSelector {
    constructor() {
        this.originalCursor = document.body.style.cursor;
        this.eventHandlers = {
            mouseover: null,
            mouseout: null,
            click: null,
            keydown: null
        };
    }

    /**
     * Enables element selection mode
     * @returns {Promise<string>} HTML of selected element
     */
    enable() {
        uiUtils.message("Select an element", false);
        return new Promise((resolve, reject) => {
            this.setupEventHandlers(resolve, reject);
            this.enableSelectionMode();
        });
    }

    /**
     * Sets up all event handlers for element selection
     * @private
     */
    setupEventHandlers(resolve, reject) {
        this.eventHandlers = {
            mouseover: (e) => this.handleMouseOver(e),
            mouseout: (e) => this.handleMouseOut(e),
            click: (e) => this.handleClick(e, resolve),
            keydown: (e) => this.handleKeyDown(e, reject)
        };

        // Add all event listeners
        Object.entries(this.eventHandlers).forEach(([event, handler]) => {
            document.addEventListener(event, handler);
        });
    }

    /**
     * Enables selection mode visual indicators
     * @private
     */
    enableSelectionMode() {
        document.body.style.cursor = 'crosshair';
    }

    /**
     * Handles mouse over events
     * @private
     */
    handleMouseOver(e) {
        e.stopPropagation();
        e.target.style.outline = '2px solid #007bff2c';
    }

    /**
     * Handles mouse out events
     * @private
     */
    handleMouseOut(e) {
        e.stopPropagation();
        e.target.style.outline = '';
    }

    /**
     * Handles click events
     * @private
     */
    handleClick(e, resolve) {
        e.preventDefault();
        e.stopPropagation();

        const selectedHTML = e.target.outerHTML;
        this.cleanup();
        uiUtils.message("", true);
        resolve(selectedHTML);
    }

    /**
     * Handles keyboard events
     * @private
     */
    handleKeyDown(e, reject) {
        if (e.key === 'Escape') {
            this.cleanup();
            reject('Selection cancelled');
        }
    }

    /**
     * Cleans up all event listeners and resets styles
     * @private
     */
    cleanup() {
        // Remove all event listeners
        Object.entries(this.eventHandlers).forEach(([event, handler]) => {
            document.removeEventListener(event, handler);
        });

        // Reset cursor
        document.body.style.cursor = this.originalCursor;

        // Remove any lingering outlines
        const highlightedElement = document.querySelector('[style*="outline"]');
        if (highlightedElement) {
            highlightedElement.style.outline = '';
        }
    }
}

// Create singleton instance
const elementSelector = new ElementSelector();

/**
 * Enable element selection mode
 * @returns {Promise<string>} HTML of selected element
 */
export function enableElementSelector() {
    return elementSelector.enable();
}
