// Очистка storage при установке/обновлении расширения
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    await chrome.storage.local.clear();
    console.log('Storage cleared on', details.reason);
  }
});

// Отслеживание состояния панели для каждого окна
const sidePanelState = new Map();

// Переключение боковой панели (открытие/закрытие)
chrome.action.onClicked.addListener(async (tab) => {
  const windowId = tab.windowId;
  const isOpen = sidePanelState.get(windowId);
  
  if (isOpen) {
    // Панель открыта - отправляем команду на закрытие
    chrome.runtime.sendMessage({ type: 'CLOSE_SIDEPANEL' }).catch(() => {});
    sidePanelState.set(windowId, false);
  } else {
    // Панель закрыта - открываем
    await chrome.sidePanel.open({ windowId });
    sidePanelState.set(windowId, true);
  }
});

// Слушаем переключение вкладок
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  notifySidepanel(tab);
});

// Слушаем обновление URL вкладки
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && tab.active) {
    notifySidepanel(tab);
  }
});

// Уведомляем sidepanel об изменении активной вкладки
function notifySidepanel(tab) {
  const isJune = tab && tab.url && tab.url.includes('askjune.ai');
  chrome.runtime.sendMessage({ 
    type: 'TAB_CHANGED', 
    isJune: isJune,
    url: tab?.url 
  }).catch(() => {}); // Игнорируем ошибку если sidepanel закрыт
}

// Флаг для остановки автоматизации
let shouldStopAutomation = false;
let currentAutomationTabId = null;

// Остановка печати в активной вкладке
async function stopTypingInTab() {
  if (currentAutomationTabId) {
    try {
      await chrome.tabs.sendMessage(currentAutomationTabId, { type: 'STOP_TYPING' });
    } catch (error) {
      console.error('Error stopping typing:', error);
    }
  }
}

// Обработка сообщений
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CHECK_ACTIVE_TAB') {
    checkActiveTab().then(sendResponse);
    return true;
  } else if (message.type === 'SEND_TO_JUNE') {
    handleSendToJune(message.query);
  } else if (message.type === 'AUTOMATE') {
    handleAutomate(message.queries);
  } else if (message.type === 'STOP_AUTOMATION') {
    shouldStopAutomation = true;
    stopTypingInTab();
  } else if (message.type === 'SIDEPANEL_OPENED') {
    // Sidepanel сообщает, что открылась
    if (sender.tab) {
      sidePanelState.set(sender.tab.windowId, true);
    }
  } else if (message.type === 'SIDEPANEL_CLOSED') {
    // Sidepanel сообщает, что закрылась
    if (sender.tab) {
      sidePanelState.set(sender.tab.windowId, false);
    }
  }
});

// Проверка активной вкладки
async function checkActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const isJune = tab && tab.url && tab.url.includes('askjune.ai');
  return { isJune, url: tab?.url };
}

async function handleSendToJune(query) {
  console.log('handleSendToJune:', query);
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log('Active tab:', tab?.id, tab?.url);
  
  if (!tab || !tab.url || !tab.url.includes('askjune.ai')) {
    console.log('Not June AI tab');
    chrome.runtime.sendMessage({ type: 'ERROR', message: 'Активная вкладка не June AI' });
    return;
  }
  
  console.log('Sending message to tab:', tab.id);
  
  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: 'INSERT_AND_SUBMIT',
      text: query
    });
    console.log('Response from content script:', response);
  } catch (error) {
    console.error('Error sending message:', error);
    chrome.runtime.sendMessage({ type: 'ERROR', message: 'Ошибка отправки: ' + error.message });
  }
}

async function handleAutomate(queries) {
  shouldStopAutomation = false;
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab || !tab.url || !tab.url.includes('askjune.ai')) {
    chrome.runtime.sendMessage({ type: 'ERROR', message: 'Активная вкладка не June AI' });
    return;
  }
  
  // Запоминаем ID вкладки, на которой запустили автоматизацию
  const automationTabId = tab.id;
  currentAutomationTabId = automationTabId;
  
  // Создаем новый чат
  try {
    await chrome.tabs.sendMessage(automationTabId, { type: 'CLICK_NEW_CHAT' });
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error('Error creating new chat:', error);
  }

  // Отправляем запросы на запомненную вкладку
  for (let i = 0; i < queries.length; i++) {
    // Проверяем флаг остановки
    if (shouldStopAutomation) {
      chrome.runtime.sendMessage({ type: 'STOPPED' });
      shouldStopAutomation = false;
      return;
    }
    
    chrome.runtime.sendMessage({ type: 'PROGRESS', current: i + 1, total: queries.length });
    
    try {
      const response = await chrome.tabs.sendMessage(automationTabId, {
        type: 'INSERT_AND_SUBMIT',
        text: queries[i]
      });
      
      // Если печать была остановлена, прерываем автоматизацию
      if (response && response.stopped) {
        chrome.runtime.sendMessage({ type: 'STOPPED' });
        shouldStopAutomation = false;
        currentAutomationTabId = null;
        return;
      }
      
      // Случайная задержка от 6 до 10 секунд, но проверяем остановку каждую секунду
      const delay = Math.random() * 4000 + 6000;
      const startTime = Date.now();
      while (Date.now() - startTime < delay) {
        if (shouldStopAutomation) {
          chrome.runtime.sendMessage({ type: 'STOPPED' });
          shouldStopAutomation = false;
          currentAutomationTabId = null;
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error sending query:', error);
    }
  }

  chrome.runtime.sendMessage({ type: 'COMPLETE' });
  shouldStopAutomation = false;
  currentAutomationTabId = null;
}
