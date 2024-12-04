export const SETTINGS = {
    DEV_MODE: false,
    OPENAI_CONFIG: {
        model: "gpt-4",
        temperature: 1,
        max_tokens: 907,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    },
    SYSTEM_PROMPT: "The user has selected an element. In the element, you should find a question and a list of answers. You should return the id of the text of the correct answer, without anything else. Just the id. All ids are prefixed with skxv-{number}. If there isn't a question or answers, return 'no-answer'.",
    CLASS_NAMES: {
        CORRECT_ANSWER: "ca",
        MESSAGE: "skxv-msg",
        ID_PREFIX: "skxv-"
    },
    KEYBOARD_SHORTCUTS: {
        TRIGGER: {
            key: ".",
            modifier: "metaKey"
        }
    }
} 