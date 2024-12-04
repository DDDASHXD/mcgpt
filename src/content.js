import { enableElementSelector } from "./selector";
import { elementUtils, uiUtils } from "./utils";
import { openAIService } from "./services/openai";
import { SETTINGS } from "./config/settings";
import "./content.css";

if (SETTINGS.DEV_MODE) {
  uiUtils.message("Dev mode");
  elementUtils.cancelAll();
}

if (!SETTINGS.DEV_MODE) {
  window.addEventListener("keydown", async (e) => {
    if (e[SETTINGS.KEYBOARD_SHORTCUTS.TRIGGER.modifier] && 
        e.key === SETTINGS.KEYBOARD_SHORTCUTS.TRIGGER.key) {
      try {
        elementUtils.cancelAll();
        elementUtils.addIds();
        
        const selectedHTML = await enableElementSelector();
        uiUtils.message("Getting response...");
        const id = await openAIService.getAnswerId(selectedHTML);

        if (id === "no-answer") {
          uiUtils.message("No Q/A found");
          return;
        }

        const element = document.querySelector(`.${id}`);
        if (!element) {
          throw new Error('Selected element not found');
        }

        element.classList.add(SETTINGS.CLASS_NAMES.CORRECT_ANSWER);
        uiUtils.message(`Clicked answer: ${id}`, false);
        elementUtils.cancelAll();
      } catch (error) {
        if (error === 'Selection cancelled') {
          console.log("Selection cancelled");
        } else {
          console.error("Error processing selection:", error);
          uiUtils.message("An error occurred");
        }
      }
    }
  });
}
