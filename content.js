console.log('June AI Auto Sender loaded');

let shouldStopTyping = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received:', message);
  
  if (message.type === 'INSERT_AND_SUBMIT') {
    shouldStopTyping = false;
    insertAndSubmit(message.text).then(result => {
      console.log('Insert result:', result);
      sendResponse(result);
    });
    return true; // Важно: возвращаем true для async ответа
  } else if (message.type === 'CLICK_NEW_CHAT') {
    const result = clickNewChat();
    console.log('New chat result:', result);
    sendResponse(result);
  } else if (message.type === 'STOP_TYPING') {
    shouldStopTyping = true;
    sendResponse({ success: true });
  }
  return true;
});

async function insertAndSubmit(text) {
  console.log('insertAndSubmit called with:', text);
  
  // Ищем textarea по placeholder
  const textarea = document.querySelector('textarea[placeholder*="Type your question"]');
  
  // Ищем кнопку submit по aria-label
  const submitBtn = document.querySelector('button[aria-label="submit"]');
  
  console.log('Found textarea:', !!textarea);
  console.log('Found submit button:', !!submitBtn);
  
  if (textarea && submitBtn) {
    // Проверяем, не вставлен ли уже этот текст
    if (textarea.value === text) {
      console.log('Text already inserted, skipping to submit');
      // Текст уже вставлен, переходим сразу к отправке
    } else {
      // Фокусируемся на поле
      textarea.focus();
      
      // Получаем native setter
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    
    // Проверяем, активна ли вкладка
    let isTabActive = !document.hidden;
    console.log('Tab is active:', isTabActive);
    
    if (isTabActive) {
      // Вкладка активна - печатаем посимвольно
      for (let i = 0; i < text.length; i++) {
        // Проверяем флаг остановки
        if (shouldStopTyping) {
          console.log('Typing stopped by user');
          return { success: false, stopped: true };
        }
        
        // Проверяем статус вкладки на каждой итерации
        if (document.hidden) {
          console.log('Tab became inactive, inserting remaining text');
          // Вкладка стала неактивной - вставляем оставшийся текст сразу
          nativeSetter.call(textarea, text);
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          break;
        }
        
        const currentText = text.substring(0, i + 1);
        nativeSetter.call(textarea, currentText);
        
        // Триггерим события для React после каждого символа
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Задержка между символами (50-200ms для реалистичности)
        await new Promise(resolve => setTimeout(resolve, Math.random() * 150 + 50));
      }
      } else {
        // Вкладка неактивна - вставляем текст сразу
        nativeSetter.call(textarea, text);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      // Проверяем флаг остановки перед отправкой
      if (shouldStopTyping) {
        console.log('Stopped before submit');
        return { success: false, stopped: true };
      }
      
      // Финальное событие change
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      
      console.log('Text inserted, waiting 300ms before submit...');
    }
    
    // Ждем 300ms с проверкой флага каждые 50ms
    const waitTime = 300;
    const checkInterval = 50;
    for (let waited = 0; waited < waitTime; waited += checkInterval) {
      if (shouldStopTyping) {
        console.log('Stopped during wait before submit');
        return { success: false, stopped: true };
      }
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
    
    // Финальная проверка перед кликом
    if (shouldStopTyping) {
      console.log('Stopped right before submit click');
      return { success: false, stopped: true };
    }
    
    // Кликаем кнопку отправки
    if (!submitBtn.disabled) {
      submitBtn.click();
      console.log('Submit clicked');
    } else {
      console.log('Button still disabled');
    }
    
    return { success: true };
  }
  
  console.error('Elements not found!');
  return { success: false, textarea: !!textarea, submitBtn: !!submitBtn };
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
