let shouldStopTyping = false;
let blockOverlay = null;

// Создание блокирующего overlay
function createBlockOverlay() {
  if (blockOverlay) return;
  
  blockOverlay = document.createElement('div');
  blockOverlay.id = 'june-automation-overlay';
  blockOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999999;
    pointer-events: all;
  `;
  
  const banner = document.createElement('div');
  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: white;
    color: #1a1a1a;
    padding: 12px 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid #e8e8e8;
    z-index: 1000000;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  `;
  
  const lockIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  lockIcon.setAttribute('width', '16');
  lockIcon.setAttribute('height', '16');
  lockIcon.setAttribute('viewBox', '0 0 24 24');
  lockIcon.setAttribute('fill', 'none');
  lockIcon.setAttribute('stroke', 'currentColor');
  lockIcon.setAttribute('stroke-width', '2');
  lockIcon.style.flexShrink = '0';
  
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', '3');
  rect.setAttribute('y', '11');
  rect.setAttribute('width', '18');
  rect.setAttribute('height', '11');
  rect.setAttribute('rx', '2');
  rect.setAttribute('ry', '2');
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M7 11V7a5 5 0 0 1 10 0v4');
  
  lockIcon.appendChild(rect);
  lockIcon.appendChild(path);
  
  const text = document.createElement('span');
  text.textContent = 'Интерфейс сайта заблокирован до окончания автоматической отправки сообщений';
  
  banner.appendChild(lockIcon);
  banner.appendChild(text);
  
  document.body.appendChild(blockOverlay);
  document.body.appendChild(banner);
  blockOverlay.bannerElement = banner;
}

// Удаление блокирующего overlay
function removeBlockOverlay() {
  if (blockOverlay) {
    if (blockOverlay.bannerElement) {
      blockOverlay.bannerElement.remove();
    }
    blockOverlay.remove();
    blockOverlay = null;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'INSERT_AND_SUBMIT') {
    shouldStopTyping = false;
    insertAndSubmit(message.text).then(sendResponse);
    return true;
  } else if (message.type === 'CLICK_NEW_CHAT') {
    sendResponse(clickNewChat());
  } else if (message.type === 'STOP_TYPING') {
    shouldStopTyping = true;
    removeBlockOverlay();
    sendResponse({ success: true });
  } else if (message.type === 'START_AUTOMATION') {
    createBlockOverlay();
    sendResponse({ success: true });
  } else if (message.type === 'STOP_AUTOMATION') {
    removeBlockOverlay();
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
    
    if (shouldStopTyping) {
      return { success: false, stopped: true };
    }
    
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
