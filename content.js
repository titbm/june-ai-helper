let shouldStopTyping = false;
let currentTypingId = 0;
let blockOverlay = null;
let chatChoiceDialog = null;

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
    font-family: Inter, "Inter Fallback", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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

function removeBlockOverlay() {
  if (blockOverlay) {
    if (blockOverlay.bannerElement) {
      blockOverlay.bannerElement.remove();
    }
    blockOverlay.remove();
    blockOverlay = null;
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'INSERT_AND_SUBMIT') {
    // Увеличиваем ID, чтобы прервать предыдущий процесс
    currentTypingId++;
    const myTypingId = currentTypingId;
    shouldStopTyping = false;
    insertAndSubmit(message.text, myTypingId).then(sendResponse);
    return true;
  } else if (message.type === 'CLICK_NEW_CHAT') {
    sendResponse(clickNewChat());
  } else if (message.type === 'STOP_TYPING') {
    shouldStopTyping = true;
    removeBlockOverlay();
    closeChatChoiceDialog();
    sendResponse({ success: true });
  } else if (message.type === 'CLEAR_AND_STOP') {
    shouldStopTyping = true;
    const textarea = document.querySelector('textarea[placeholder*="Type your question"]');
    if (textarea) {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      nativeSetter.call(textarea, '');
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    sendResponse({ success: true });
  } else if (message.type === 'START_AUTOMATION') {
    createBlockOverlay();
    sendResponse({ success: true });
  } else if (message.type === 'STOP_AUTOMATION') {
    removeBlockOverlay();
    closeChatChoiceDialog();
    const textarea = document.querySelector('textarea[placeholder*="Type your question"]');
    if (textarea) {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      nativeSetter.call(textarea, '');
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    sendResponse({ success: true });
  } else if (message.type === 'CHECK_CHAT_HAS_MESSAGES') {
    sendResponse({ hasMessages: checkIfChatHasMessages() });
  } else if (message.type === 'CHECK_BOT_RESPONDING') {
    const submitBtn = document.querySelector('button[aria-label="submit"]');
    sendResponse({ isBotResponding: submitBtn && !submitBtn.disabled });
  } else if (message.type === 'SHOW_CHAT_CHOICE_DIALOG') {
    showChatChoiceDialog().then(choice => sendResponse({ choice }));
    return true;
  } else if (message.type === 'RENAME_CHAT') {
    renameChat(message.theme).then(sendResponse);
    return true;
  }
  return true;
});

async function insertAndSubmit(text, typingId) {
  const textarea = document.querySelector('textarea[placeholder*="Type your question"]');
  const submitBtn = document.querySelector('button[aria-label="submit"]');
  
  if (textarea && submitBtn) {
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    
    if (textarea.value.trim().length > 0) {
      nativeSetter.call(textarea, '');
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (!submitBtn.disabled) {
      await waitForButtonDisabled();
      if (shouldStopTyping || typingId !== currentTypingId) {
        return { success: false, stopped: true };
      }
    }
    
    textarea.focus();
    const isTabActive = !document.hidden;
    
    if (isTabActive) {
      for (let i = 0; i < text.length; i++) {
        if (shouldStopTyping || typingId !== currentTypingId) {
          return { success: false, stopped: true };
        }
        
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
    
    if (shouldStopTyping || typingId !== currentTypingId) {
      return { success: false, stopped: true };
    }
    
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (shouldStopTyping || typingId !== currentTypingId) {
      return { success: false, stopped: true };
    }
    
    submitBtn.click();
    chrome.runtime.sendMessage({ type: 'MESSAGE_SUBMITTED' }).catch(() => {});
    chrome.runtime.sendMessage({ type: 'BOT_STARTED' }).catch(() => {});
    await waitForButtonDisabled();
    chrome.runtime.sendMessage({ type: 'BOT_FINISHED' }).catch(() => {});
    
    return { success: true };
  }
  
  return { success: false };
}

async function waitForButtonDisabled() {
  return new Promise((resolve) => {
    let checkCount = 0;
    const maxChecks = 600;
    
    const checkInterval = setInterval(() => {
      checkCount++;
      if (checkCount > maxChecks) {
        clearInterval(checkInterval);
        const submitBtn = document.querySelector('button[aria-label="submit"]');
        if (submitBtn && !submitBtn.disabled) {
          submitBtn.click();
          setTimeout(() => resolve(), 500);
        } else {
          resolve();
        }
        return;
      }
      
      const submitBtn = document.querySelector('button[aria-label="submit"]');
      if (submitBtn && submitBtn.disabled) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 100);
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

// Закрытие диалога выбора чата
function closeChatChoiceDialog() {
  if (chatChoiceDialog) {
    // Если есть pending promise, resolve с cancelled
    if (chatChoiceDialog.resolvePromise) {
      chatChoiceDialog.resolvePromise('cancelled');
    }
    chatChoiceDialog.remove();
    chatChoiceDialog = null;
  }
}

async function renameChat(theme) {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Открываем сайдбар только на узких экранах
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      const hamburgerBtn = document.querySelector('button[data-sidebar="trigger"]');
      if (hamburgerBtn) {
        hamburgerBtn.click();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    const chatOptionsBtn = document.querySelector('button[aria-label="Chat item options"]');
    if (!chatOptionsBtn) {
      return { success: false, error: 'Chat options button not found' };
    }
    
    chatOptionsBtn.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      view: window,
      pointerId: 1,
      pointerType: 'mouse'
    }));
    chatOptionsBtn.dispatchEvent(new PointerEvent('pointerup', {
      bubbles: true,
      cancelable: true,
      view: window,
      pointerId: 1,
      pointerType: 'mouse'
    }));
    chatOptionsBtn.click();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let renameMenuItem = Array.from(document.querySelectorAll('[role="menuitem"]')).find(
      item => item.textContent.includes('Rename')
    );
    
    if (!renameMenuItem) {
      await new Promise(resolve => setTimeout(resolve, 500));
      renameMenuItem = Array.from(document.querySelectorAll('[role="menuitem"]')).find(
        item => item.textContent.includes('Rename')
      );
    }
    
    if (!renameMenuItem) {
      return { success: false, error: 'Rename menu item not found' };
    }
    renameMenuItem.click();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Ищем диалог переименования (не сайдбар)
    const dialogs = Array.from(document.querySelectorAll('[role="dialog"]'));
    const dialog = dialogs.find(d => {
      const hasInput = d.querySelector('input[type="text"]') || d.querySelector('input[placeholder*="title"]') || d.querySelector('input[placeholder*="name"]');
      return hasInput && !d.hasAttribute('data-sidebar');
    });
    
    if (!dialog) return { success: false, error: 'Rename dialog not found' };
    
    // Убираем фокус с текущего элемента (кнопки в сайдбаре)
    if (document.activeElement) {
      document.activeElement.blur();
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const renameInput = dialog.querySelector('input[type="text"]') || dialog.querySelector('input');
    if (!renameInput) return { success: false, error: 'Rename input not found' };
    
    renameInput.focus();
    renameInput.select();
    
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeSetter.call(renameInput, theme);
    renameInput.dispatchEvent(new Event('input', { bubbles: true }));
    renameInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Ищем кнопку Save разными способами
    let saveBtn = Array.from(dialog.querySelectorAll('button')).find(btn => 
      btn.textContent.trim().toLowerCase() === 'save' || 
      btn.textContent.includes('Save')
    );
    
    // Если не нашли по тексту, пробуем по позиции (последняя кнопка обычно Save)
    if (!saveBtn) {
      const buttons = Array.from(dialog.querySelectorAll('button'));
      saveBtn = buttons[buttons.length - 1];
    }
    
    if (saveBtn) {
      saveBtn.click();
    } else {
      // Если кнопка не найдена, отправляем Enter
      renameInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Закрываем сайдбар только на узких экранах
    if (isMobile) {
      const closeSidebarBtn = document.querySelector('button[data-sidebar="trigger"]');
      if (closeSidebarBtn) {
        closeSidebarBtn.click();
      }
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

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
      font-family: Inter, "Inter Fallback", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    chatChoiceDialog = overlay;
    chatChoiceDialog.resolvePromise = resolve;
    
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      font-weight: 400;
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
      background: rgb(255, 255, 255);
      border: 1px solid rgb(187, 200, 201);
      border-radius: 6px;
      font-family: Inter, "Inter Fallback", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: rgb(43, 50, 51);
      cursor: pointer;
      transition: color 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    currentChatBtn.onmouseover = () => {
      currentChatBtn.style.background = 'rgb(230, 248, 250)';
      currentChatBtn.style.color = 'rgb(8, 71, 76)';
      currentChatBtn.style.borderColor = 'rgb(187, 200, 201)';
    };
    currentChatBtn.onmouseout = () => {
      currentChatBtn.style.background = 'rgb(255, 255, 255)';
      currentChatBtn.style.color = 'rgb(43, 50, 51)';
      currentChatBtn.style.borderColor = 'rgb(187, 200, 201)';
    };
    currentChatBtn.onclick = () => {
      if (chatChoiceDialog) {
        chatChoiceDialog.remove();
        chatChoiceDialog = null;
      }
      resolve('current');
    };
    
    const newChatBtn = document.createElement('button');
    newChatBtn.textContent = 'В новый чат';
    newChatBtn.style.cssText = `
      flex: 1;
      height: 40px;
      padding: 8px 16px;
      background: rgb(8, 71, 76);
      border: none;
      border-radius: 6px;
      font-family: Inter, "Inter Fallback", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: rgb(250, 250, 250);
      cursor: pointer;
      transition: color 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    `;
    newChatBtn.onmouseover = () => {
      newChatBtn.style.background = 'rgb(8, 71, 76)';
    };
    newChatBtn.onmouseout = () => {
      newChatBtn.style.background = 'rgb(8, 71, 76)';
    };
    newChatBtn.onclick = () => {
      if (chatChoiceDialog) {
        chatChoiceDialog.remove();
        chatChoiceDialog = null;
      }
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
