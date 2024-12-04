import { SETTINGS as DEFAULT_SETTINGS } from '../config/settings';

class SettingsService {
    constructor() {
        this.settings = null;
    }

    /**
     * Initialize settings from storage or defaults
     */
    async init() {
        const stored = await chrome.storage.sync.get('settings');
        this.settings = stored.settings || DEFAULT_SETTINGS;
        return this.settings;
    }

    /**
     * Get current settings
     */
    async getSettings() {
        if (!this.settings) {
            await this.init();
        }
        return this.settings;
    }

    /**
     * Update settings
     * @param {Object} newSettings - New settings to merge with existing ones
     */
    async updateSettings(newSettings) {
        this.settings = {
            ...this.settings,
            ...newSettings
        };
        await chrome.storage.sync.set({ settings: this.settings });
        return this.settings;
    }

    /**
     * Reset settings to defaults
     */
    async resetSettings() {
        this.settings = DEFAULT_SETTINGS;
        await chrome.storage.sync.set({ settings: this.settings });
        return this.settings;
    }

    /**
     * Get a specific setting value
     * @param {string} key - Setting key to retrieve
     */
    async getSetting(key) {
        const settings = await this.getSettings();
        return settings[key];
    }
}

export const settingsService = new SettingsService(); 