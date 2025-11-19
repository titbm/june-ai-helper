let shouldStopTyping = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'INSERT_AND_SUBMIT') {
    shouldStopTyping = false;
    insertAndSubmit(message.text).then(sendResponse);
    return true;
  } else if (message.type === 'CLICK_NEW_CHAT') {
    sendResponse(clickNewChat());
  } else if (message.type === 'STOP_TYPING') {
    shouldStopTyping = true;
    sendResponse({ success: true });
  }
  return true;
});

async function insertAndSubmit(text) {
  const textarea = document.querySelector('textarea[placeholder*="Type your question"]');
  const submitBtn = document.querySelector('button[aria-label="submit"]');
  
  if (textarea && submitBtn) {
    if (textarea.value !== text) {
      textarea.focus();
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      const isTabActive = !document.hidden;
      
      if (isTabActive) {
        for (let i = 0; i < text.length; i++) {
          if (shouldStopTyping) return { success: false, stopped: true };
          
          if (document.hidden) {
            nativeSetter.call(textarea, text);
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            break;
          }
          
          nativeSetter.call(textarea, text.substring(0, i + 1));
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          await new Promise(resolve => setTimeout(resolve, Math.random() * 150 + 50));
        }
      } else {
        nativeSetter.call(textarea, text);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      if (shouldStopTyping) return { success: false, stopped: true };
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    for (let waited = 0; waited < 300; waited += 50) {
      if (shouldStopTyping) return { success: false, stopped: true };
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    if (shouldStopTyping) return { success: false, stopped: true };
    
    if (!submitBtn.disabled) {
      submitBtn.click();
      
      // Ждем завершения ответа бота
      await waitForBotResponse();
    }
    
    return { success: true };
  }
  
  return { success: false };
}

// Ожидание завершения ответа бота
async function waitForBotResponse() {
  return new Promise((resolve) => {
    let checkCount = 0;
    const maxChecks = 600; // 5 минут максимум
    
    const checkInterval = setInterval(() => {
      if (shouldStopTyping) {
        clearInterval(checkInterval);
        resolve();
        return;
      }
      
      checkCount++;
      if (checkCount > maxChecks) {
        clearInterval(checkInterval);
        chrome.runtime.sendMessage({ type: 'BOT_RESPONSE_COMPLETE' }).catch(() => {});
        resolve();
        return;
      }
      
      // Проверяем, что кнопка submit снова активна (бот закончил отвечать)
      const submitBtn = document.querySelector('button[aria-label="submit"]');
      const textarea = document.querySelector('textarea[placeholder*="Type your question"]');
      
      if (submitBtn && !submitBtn.disabled && textarea && !textarea.disabled) {
        clearInterval(checkInterval);
        chrome.runtime.sendMessage({ type: 'BOT_RESPONSE_COMPLETE' }).catch(() => {});
        resolve();
      }
    }, 500);
  });
}

function clickNewChat() {
  const newChatBtn = Array.from(document.querySelectorAll('button')).find(
    btn => btn.textContent.includes('New Chat')
  );
  if (newChatBtn) {
    newChatBtn.click();
    return { success: true };
  }
  return { success: false };
}
