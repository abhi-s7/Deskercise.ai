export function loadVapi({ apiKey, assistant, customPrompt, exercise }) {
  return new Promise((resolve, reject) => {
    if (window.vapiInstance) {
      resolve({
        instance: window.vapiInstance,
        promptMessage: `Great! Let's begin the "${exercise?.name}" stretch. I'll walk you through the steps now.`,
      });
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
        config: {
          mode: 'call',
          call: {
            initialMessage: `Great! Let’s begin the "${exercise?.name}" stretch. I’ll walk you through the steps now.`
          },
          ui: {
            hide: true,
          },
        },
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
              }
            ],
          },
        },
      });

      const interval = setInterval(() => {
        const icon = document.getElementById('vapi-icon-container');
        if (icon) icon.remove();

        const supportBtn = document.getElementById('vapi-support-btn');
        if (supportBtn) supportBtn.remove();

        if (icon || supportBtn) {
          clearInterval(interval);
        }
      }, 200);

      resolve({
        instance: window.vapiInstance,
        promptMessage: `Great! Let's begin the "${exercise?.name}" stretch. I'll walk you through the steps now.`,
      });
    };

    script.onerror = () => reject(new Error('Failed to load Vapi SDK'));

    document.body.appendChild(script);
  });
}