// loadVapi.js
export function loadVapi({ apiKey, assistant, customPrompt }) {
  return new Promise((resolve, reject) => {
    if (window.vapiInstance) {
      // Already loaded
      resolve(window.vapiInstance);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (!window.vapiSDK) {
        reject(new Error('vapiSDK not loaded'));
        return;
      }
      window.vapiInstance = window.vapiSDK.run({
        apiKey,
        assistant,
        config: undefined,
        assistant_overrides: {
          model: {
            messages: [
              {
                role: 'system',
                content: 'You are a helpful posture coach assistant who gives friendly advice on sitting posture and taking stretch breaks.',
              },
              {
                role: 'user',
                content: customPrompt,
              },
            ],
          },
        },
      });

      resolve(window.vapiInstance);
    };

    script.onerror = () => reject(new Error('Failed to load Vapi SDK'));

    document.body.appendChild(script);
  });
}
