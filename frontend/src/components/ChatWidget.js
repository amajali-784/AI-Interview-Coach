import { useEffect } from 'react';

const ChatWidget = () => {
  useEffect(() => {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();


    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/675068742480f5b4f5a7c141/1ie91g22o';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(script, firstScriptTag);

    return () => {
      const insertedScript = document.querySelector(`script[src="${script.src}"]`);
      if (insertedScript) insertedScript.remove();
    };
  }, []);

  return null; // No UI for the chat widget
};

export default ChatWidget;
