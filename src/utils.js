import { SETTINGS } from './config/settings';

const DELAY = 100;

/**
 * DOM Query Utilities
 */
export const domUtils = {
    async findQuestionWithDelay() {
        try {
            const question = await waitForElement('p.question__text', DELAY);
            return question ? question.innerHTML : null;
        } catch (error) {
            console.error('Error finding question:', error);
            return null;
        }
    },

    async getAnswerBoxes() {
        try {
            const boxes = await waitForElements('article.option', DELAY);
            return Array.from(boxes);
        } catch (error) {
            console.error('Error getting answer boxes:', error);
            return [];
        }
    },

    async getAnswers() {
        try {
            const answers = await waitForElements('.option__text', DELAY);
            return Array.from(answers).map(a => a.innerHTML);
        } catch (error) {
            console.error('Error getting answers:', error);
            return [];
        }
    }
};

/**
 * Element Management Utilities
 */
export const elementUtils = {
    addIds() {
        document.querySelectorAll('*').forEach((el, index) => {
            el.classList.add(`${SETTINGS.CLASS_NAMES.ID_PREFIX}${index}`);
        });
    },

    cancelAll() {
        const cleanup = () => {
            document.querySelectorAll(`.${SETTINGS.CLASS_NAMES.CORRECT_ANSWER}`).forEach(el => {
                el.classList.remove(SETTINGS.CLASS_NAMES.CORRECT_ANSWER);
            });

            document.querySelectorAll(`.${SETTINGS.CLASS_NAMES.MESSAGE}`).forEach(el => {
                el.remove();
            });
        };

        ['keydown', 'click'].forEach(event => {
            window.addEventListener(event, cleanup);
        });
    }
};

/**
 * UI Feedback Utilities
 */
export const uiUtils = {
    message(msg, remove = false) {
        if (remove) {
            document.querySelectorAll(`.${SETTINGS.CLASS_NAMES.MESSAGE}`).forEach(el => el.remove());
            return;
        }

        const div = document.createElement('div');
        div.classList.add(SETTINGS.CLASS_NAMES.MESSAGE);
        div.innerHTML = msg;
        document.body.appendChild(div);
    }
};

/**
 * Helper Functions
 */
function waitForElement(selector, timeout) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const element = document.querySelector(selector);
            resolve(element);
        }, timeout);
    });
}

function waitForElements(selector, timeout) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const elements = document.querySelectorAll(selector);
            resolve(elements);
        }, timeout);
    });
}