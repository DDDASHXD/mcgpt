const ALLOWED_DOMAINS = ['mcq.eksamen.ruc.dk'];

chrome.action.onClicked.addListener(async (tab) => {
    try {
        if (!tab.url) {
            console.error('No URL found in tab');
            return;
        }

        const domain = new URL(tab.url).hostname;
        if (!ALLOWED_DOMAINS.some(allowed => domain.includes(allowed))) {
            console.log('Not a valid domain for this extension');
            return;
        }

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        });

        console.log('Extension script injected successfully');
    } catch (error) {
        console.error('Error executing extension script:', error);
    }
}); 