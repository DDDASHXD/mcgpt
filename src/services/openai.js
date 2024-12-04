import OpenAI from "openai";
import { SETTINGS } from "../config/settings";

async function getApiKey() {
  try {
    // Try storage first
    const storage = await chrome.storage.local.get('apiKey');
    if (storage.apiKey) {
      return storage.apiKey;
    }

    // Try config.json as fallback
    try {
      const response = await fetch(chrome.runtime.getURL('config.json'));
      const config = await response.json();
      return config.apiKey;
    } catch (error) {
      console.log('No config.json found');
      return null;
    }
  } catch (error) {
    console.error('Error getting API key:', error);
    return null;
  }
}

class OpenAIService {
    constructor() {
        this.client = null; // Initialize later when we have the key
    }

    async initClient() {
        const apiKey = await getApiKey();
        if (!apiKey) {
            throw new Error('No API key found. Please set it in the extension popup.');
        }
        this.client = new OpenAI({
            apiKey,
            dangerouslyAllowBrowser: true
        });
    }

    async getAnswerId(selectedHTML) {
        try {
            if (!this.client) {
                await this.initClient();
            }
            const response = await this.client.chat.completions.create({
                model: SETTINGS.OPENAI_CONFIG.model,
                messages: [
                    {
                        role: "system",
                        content: [
                            {
                                type: "text",
                                text: SETTINGS.SYSTEM_PROMPT
                            }
                        ]
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: selectedHTML
                            }
                        ]
                    }
                ],
                response_format: { type: "text" },
                ...SETTINGS.OPENAI_CONFIG
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error getting answer from OpenAI:', error);
            throw error;
        }
    }
}

export const openAIService = new OpenAIService(); 