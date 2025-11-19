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
  } else if (message.type === 'CHECK_CHAT_HAS_MESSAGES') {
    sendResponse({ hasMessages: checkIfChatHasMessages() });
  } else if (message.type === 'SHOW_CHAT_CHOICE_DIALOG') {
    showChatChoiceDialog().then(choice => sendResponse({ choice }));
    return true;
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
      
      // Запускаем ожидание ответа бота асинхронно
      waitForBotResponse();
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

// Проверка, есть ли сообщения в текущем чате
function checkIfChatHasMessages() {
  // Самый надежный способ - проверяем наличие заголовка "Ask me anything"
  // Если он есть - чат пустой, если нет - есть сообщения
  const emptyStateHeading = document.querySelector('main h2');
  const hasEmptyState = emptyStateHeading && 
                       emptyStateHeading.textContent.includes('Ask me anything');
  
  // Если есть empty state - чат пустой
  if (hasEmptyState) {
    return false;
  }
  
  // Дополнительная проверка - ищем реальные сообщения (параграфы в main)
  const actualMessages = Array.from(document.querySelectorAll('main p')).filter(p => 
    p.textContent.trim().length > 0 && 
    !p.textContent.includes('Type your question') &&
    !p.textContent.includes('Ask me anything')
  );
  
  return actualMessages.length > 0;
}

// Показ диалога выбора чата
function showChatChoiceDialog() {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    `;
    
    const title = document.createElement('h3');
    title.textContent = 'Куда отправить запросы?';
    title.style.cssText = `
      margin: 0 0 12px 0;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      text-align: center;
    `;
    
    const description = document.createElement('p');
    description.textContent = 'У вас открыт чат с сообщениями. Выберите, куда отправить новые запросы:';
    description.style.cssText = `
      margin: 0 0 20px 0;
      font-size: 14px;
      color: #6b7280;
      line-height: 1.6;
      text-align: center;
      font-weight: 400;
    `;
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
      display: flex;
      gap: 12px;
    `;
    
    const currentChatBtn = document.createElement('button');
    currentChatBtn.textContent = 'В этот чат';
    currentChatBtn.style.cssText = `
      flex: 1;
      height: 40px;
      padding: 0 16px;
      background: #f3f4f6;
      border: 1px solid #e8e8e8;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
      cursor: pointer;
      transition: all 0.2s ease;
    `;
    currentChatBtn.onmouseover = () => {
      currentChatBtn.style.background = '#e5e7eb';
      currentChatBtn.style.borderColor = '#d0d0d0';
      currentChatBtn.style.transform = 'translateY(-1px)';
    };
    currentChatBtn.onmouseout = () => {
      currentChatBtn.style.background = '#f3f4f6';
      currentChatBtn.style.borderColor = '#e8e8e8';
      currentChatBtn.style.transform = 'translateY(0)';
    };
    currentChatBtn.onclick = () => {
      overlay.remove();
      resolve('current');
    };
    
    const newChatBtn = document.createElement('button');
    newChatBtn.textContent = 'В новый чат';
    newChatBtn.style.cssText = `
      flex: 1;
      height: 40px;
      padding: 0 16px;
      background: #08474c;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      color: #fafafa;
      cursor: pointer;
      transition: all 0.2s ease;
    `;
    newChatBtn.onmouseover = () => {
      newChatBtn.style.background = '#06393d';
      newChatBtn.style.transform = 'translateY(-1px)';
    };
    newChatBtn.onmouseout = () => {
      newChatBtn.style.background = '#08474c';
      newChatBtn.style.transform = 'translateY(0)';
    };
    newChatBtn.onclick = () => {
      overlay.remove();
      resolve('new');
    };
    
    buttonsContainer.appendChild(currentChatBtn);
    buttonsContainer.appendChild(newChatBtn);
    
    dialog.appendChild(title);
    dialog.appendChild(description);
    dialog.appendChild(buttonsContainer);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
  });
}
