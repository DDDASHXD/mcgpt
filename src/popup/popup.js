document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveButton = document.getElementById('saveButton');
  const statusDiv = document.getElementById('status');

  // Load existing API key
  try {
    const storage = await chrome.storage.local.get('apiKey');
    if (storage.apiKey) {
      apiKeyInput.value = storage.apiKey;
    } else {
      // Try loading from config.json as fallback
      try {
        const response = await fetch(chrome.runtime.getURL('config.json'));
        const config = await response.json();
        apiKeyInput.value = config.apiKey || '';
      } catch (error) {
        console.log('No config.json found, will create on save');
      }
    }
  } catch (error) {
    console.error('Error loading API key:', error);
  }

  // Save API key
  saveButton.addEventListener('click', async () => {
    const newApiKey = apiKeyInput.value.trim();
    
    if (!newApiKey) {
      statusDiv.textContent = 'Please enter an API key';
      return;
    }

    try {
      // Save to storage
      await chrome.storage.local.set({ apiKey: newApiKey });
      
      // Also save to config.json for persistence
      const config = { apiKey: newApiKey };
      const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      
      // Create download link
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'config.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);

      statusDiv.textContent = 'API key saved! Please move config.json to extension root.';
    } catch (error) {
      statusDiv.textContent = 'Error saving API key';
      console.error('Error:', error);
    }
  });

  // Show/hide key
  const showKeyCheckbox = document.getElementById('showKey');
  showKeyCheckbox.addEventListener('change', () => {
    apiKeyInput.type = showKeyCheckbox.checked ? 'text' : 'password';
  });
}); 