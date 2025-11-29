let currentQueries = [];
let isJuneTabOpen = false;
let isAutomating = false;
let isSending = false;
let isBotResponding = false;
let sendingRequestId = 0;
let currentTheme = '';
let isThemeLocked = false;
let currentLanguage = 'RU';

const generateBtn = document.getElementById('generateBtn');
const automateBtn = document.getElementById('automateBtn');
const queriesList = document.getElementById('queriesList');
const statusDiv = document.getElementById('status');
const footer = document.querySelector('footer');
const themeHeader = document.getElementById('themeHeader');
const lockBtn = document.getElementById('lockBtn');
const langBtn = document.getElementById('langBtn');
async function loadState() {
  const state = await chrome.runtime.sendMessage({ type: 'GET_STATE' });
  if (state) {
    currentQueries = state.currentQueries || [];
    currentTheme = state.currentTheme || '';
    isAutomating = state.isAutomating || false;
    isThemeLocked = state.isThemeLocked || false;
    currentLanguage = state.currentLanguage || 'RU';
    
    if (currentTheme) {
      themeHeader.textContent = `Тема: ${currentTheme}`;
    }
    
    if (lockBtn) {
      updateLockButton();
    }
    
    if (langBtn) {
      updateLanguageButton();
    }
    
    renderQueries();
  }
}

function updateLockButton() {
  if (isThemeLocked) {
    lockBtn.classList.add('locked');
    lockBtn.title = 'Разблокировать тему';
  } else {
    lockBtn.classList.remove('locked');
    lockBtn.title = 'Заблокировать тему';
  }
}

function updateLanguageButton() {
  langBtn.textContent = currentLanguage;
}

async function toggleLanguage() {
  try {
    currentLanguage = currentLanguage === 'RU' ? 'EN' : 'RU';
    updateLanguageButton();
    
    console.log('toggleLanguage - start:', { currentLanguage, currentTheme });
    
    // Отправляем SET_LANGUAGE (без ожидания)
    chrome.runtime.sendMessage({ 
      type: 'SET_LANGUAGE', 
      language: currentLanguage 
    });
    
    console.log('SET_LANGUAGE sent');
    
    // Если есть текущая тема, переводим и перегенерируем запросы
    if (currentTheme) {
      console.log('Translating theme:', currentTheme);
      
      // Показываем индикацию загрузки
      generateBtn.disabled = true;
      updateGenerateButtonText('Генерация...');
      statusDiv.textContent = 'Перевод темы и генерация запросов...';
      statusDiv.style.color = '#6b7280';
      
      // Переводим тему на новый язык
      const response = await chrome.runtime.sendMessage({ 
        type: 'TRANSLATE_AND_GENERATE',
        theme: currentTheme,
        targetLanguage: currentLanguage,
        keepLocked: isThemeLocked
      });
      
      console.log('TRANSLATE_AND_GENERATE response:', response);
      
      if (response) {
        currentQueries = response.queries;
        currentTheme = response.theme;
        themeHeader.textContent = `Тема: ${currentTheme}`;
        renderQueries();
        await checkJuneTab();
        statusDiv.textContent = '✓ Запросы обновлены';
      }
      
      // Возвращаем кнопку в нормальное состояние
      generateBtn.disabled = false;
      updateGenerateButtonText('Обновить запросы');
    } else {
      console.log('No current theme to translate');
    }
    
    statusDiv.textContent = `Язык: ${currentLanguage === 'RU' ? 'Русский' : 'English'}`;
    statusDiv.style.color = '#6b7280';
    setTimeout(() => statusDiv.textContent = '', 2000);
  } catch (error) {
    console.error('toggleLanguage error:', error);
    statusDiv.textContent = '✗ Ошибка переключения языка';
    statusDiv.style.color = '#ef4444';
  }
}

async function toggleThemeLock() {
  if (!currentTheme) {
    statusDiv.textContent = '✗ Сначала сгенерируйте тему';
    statusDiv.style.color = '#ef4444';
    setTimeout(() => statusDiv.textContent = '', 2000);
    return;
  }
  
  isThemeLocked = !isThemeLocked;
  updateLockButton();
  
  await chrome.runtime.sendMessage({ 
    type: 'SET_THEME_LOCK', 
    locked: isThemeLocked 
  });
  
  if (isThemeLocked) {
    statusDiv.textContent = '🔒 Тема заблокирована';
  } else {
    statusDiv.textContent = '🔓 Тема разблокирована';
  }
  statusDiv.style.color = '#6b7280';
  setTimeout(() => statusDiv.textContent = '', 2000);
}

async function checkJuneTab() {
  const response = await chrome.runtime.sendMessage({ type: 'CHECK_ACTIVE_TAB' });
  isJuneTabOpen = response.isJune;
  updateUI();
}

function openJuneAI() {
  chrome.tabs.create({ url: 'https://askjune.ai/app/chat' });
}

function updateAllButtons() {
  const isBlocked = isBotResponding || isAutomating;
  
  document.querySelectorAll('.june-btn').forEach(btn => {
    btn.disabled = isBlocked;
  });
  
  generateBtn.disabled = isAutomating;
  langBtn.disabled = isAutomating;
  lockBtn.disabled = isAutomating;
}
function updateUI() {
  if (isAutomating) {
    automateBtn.textContent = 'Остановить отправку';
    automateBtn.classList.add('stopping');
    automateBtn.disabled = false;
    if (!statusDiv.textContent.includes('Отправка')) {
      statusDiv.textContent = 'Отправка запущена...';
      statusDiv.style.color = '#6b7280';
    }
    updateAllButtons();
    return;
  }
  
  if (!isJuneTabOpen) {
    statusDiv.textContent = '';
    automateBtn.disabled = currentQueries.length === 0;
    automateBtn.textContent = 'Открыть June AI';
    automateBtn.classList.remove('stopping');
    
    document.querySelectorAll('.june-btn').forEach(btn => {
      btn.style.display = 'none';
    });
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.style.display = 'flex';
    });
  } else {
    statusDiv.textContent = '';
    statusDiv.style.color = '#6b7280';
    automateBtn.disabled = currentQueries.length === 0;
    automateBtn.textContent = 'Отправить все запросы';
    automateBtn.classList.remove('stopping');
    
    document.querySelectorAll('.june-btn').forEach(btn => {
      btn.style.display = 'flex';
    });
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.style.display = 'none';
    });
  }
  
  updateAllButtons();
}
function updateGenerateButtonText(text) {
  const span = generateBtn.querySelector('span');
  if (span) {
    span.textContent = text;
  } else {
    generateBtn.textContent = text;
  }
}

async function generateQueries() {
  generateBtn.disabled = true;
  updateGenerateButtonText('Генерация...');
  statusDiv.textContent = 'Запрос отправлен, ждем ответа...';
  statusDiv.style.color = '#6b7280';
  
  const result = await chrome.runtime.sendMessage({ 
    type: 'GENERATE_QUERIES',
    language: currentLanguage 
  });
  
  if (result) {
    currentQueries = result.queries;
    currentTheme = result.theme;
    themeHeader.textContent = `Тема: ${currentTheme}`;
  }
  
  generateBtn.disabled = false;
  updateGenerateButtonText('Обновить запросы');
  
  renderQueries();
  await checkJuneTab();
  statusDiv.textContent = '✓ Запросы обновлены';
  statusDiv.style.color = '#6b7280';
}

function renderQueries() {
  if (currentQueries.length === 0) {
    queriesList.innerHTML = `
      <div class="empty-state">
        <p>Нажмите "Сгенерировать запросы"<br>чтобы создать 10 вопросов</p>
        <button id="generateBtnCenter" class="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
          </svg>
          <span>Сгенерировать запросы</span>
        </button>
      </div>
    `;
    queriesList.classList.add('empty');
    footer.classList.remove('has-queries');
    footer.classList.add('empty-state');
    
    document.getElementById('generateBtnCenter').addEventListener('click', generateQueries);
    return;
  }

  queriesList.innerHTML = currentQueries.map((query, index) => `
    <div class="query-item" data-index="${index}">
      <div class="query-text">${query}</div>
      <button class="june-btn" data-index="${index}">June</button>
      <button class="copy-btn" data-index="${index}" title="Копировать в буфер обмена">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
      </button>
    </div>
  `).join('');

  queriesList.classList.remove('empty');
  footer.classList.remove('empty-state');
  footer.classList.add('has-queries');

  // Обработчики для копирования по клику на запрос
  document.querySelectorAll('.query-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (!e.target.classList.contains('june-btn')) {
        const index = item.dataset.index;
        copyToClipboard(currentQueries[index]);
      }
    });
  });

  document.querySelectorAll('.june-btn').forEach(btn => {
    btn.disabled = isBotResponding || isAutomating;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = btn.dataset.index;
      sendToJune(currentQueries[index]);
    });
  });
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    statusDiv.textContent = '✓ Скопировано в буфер';
    setTimeout(() => statusDiv.textContent = '', 2000);
  } catch (err) {
    statusDiv.textContent = '✗ Ошибка копирования';
  }
}

async function sendToJune(query) {
  sendingRequestId++;
  const myRequestId = sendingRequestId;
  
  if (isSending) {
    await chrome.runtime.sendMessage({ type: 'STOP_SINGLE_SEND' });
  }
  
  isSending = true;
  updateAllButtons();
  await new Promise(resolve => setTimeout(resolve, 50));
  
  if (myRequestId !== sendingRequestId) return;
  
  await checkJuneTab();
  if (!isJuneTabOpen) {
    if (myRequestId === sendingRequestId) {
      isSending = false;
      updateAllButtons();
    }
    openJuneAI();
    return;
  }
  
  if (myRequestId !== sendingRequestId) return;
  
  statusDiv.textContent = 'Вводим сообщение...';
  statusDiv.style.color = '#6b7280';
  
  try {
    const response = await chrome.runtime.sendMessage({ type: 'SEND_TO_JUNE', query });
    
    if (myRequestId !== sendingRequestId) return;
    
    if (response && response.success) {
      statusDiv.textContent = '✓ Отправлено';
      statusDiv.style.color = '#6b7280';
    } else if (response && (response.stopped || (response.error && response.error.includes('отвечает')))) {
      statusDiv.textContent = '';
    } else if (response && response.error) {
      statusDiv.textContent = '✗ ' + response.error;
      statusDiv.style.color = '#ef4444';
    }
  } catch (error) {
    if (myRequestId === sendingRequestId) {
      statusDiv.textContent = '✗ Ошибка: ' + error.message;
      statusDiv.style.color = '#ef4444';
    }
  } finally {
    if (myRequestId === sendingRequestId) {
      isSending = false;
      updateAllButtons();
      setTimeout(() => {
        if (myRequestId === sendingRequestId) statusDiv.textContent = '';
      }, 2000);
    }
  }
}
async function automate() {
  if (isAutomating) {
    automateBtn.textContent = 'Остановка...';
    automateBtn.disabled = true;
    statusDiv.textContent = 'Остановка отправки...';
    statusDiv.style.color = '#6b7280';
    chrome.runtime.sendMessage({ type: 'STOP_AUTOMATION' });
    return;
  }
  
  if (isSending) {
    await chrome.runtime.sendMessage({ type: 'STOP_SINGLE_SEND' });
    isSending = false;
    updateAllButtons();
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  if (currentQueries.length === 0) return;
  
  await checkJuneTab();
  if (!isJuneTabOpen) {
    openJuneAI();
    return;
  }
  
  isAutomating = true;
  automateBtn.textContent = 'Остановить отправку';
  automateBtn.classList.add('stopping');
  automateBtn.disabled = false;
  statusDiv.textContent = 'Запуск отправки...';
  statusDiv.style.color = '#6b7280';
  updateAllButtons();
  chrome.runtime.sendMessage({ type: 'AUTOMATE' });
}
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'CLOSE_SIDEPANEL') {
    window.close();
  } else if (message.type === 'TAB_CHANGED') {
    isJuneTabOpen = message.isJune;
    updateUI();
  } else if (message.type === 'AUTOMATION_ERROR') {
    statusDiv.textContent = `✗ ${message.message}`;
    statusDiv.style.color = '#ef4444';
    automateBtn.textContent = 'Отправить все запросы';
    automateBtn.classList.remove('stopping');
    automateBtn.disabled = false;
    isAutomating = false;
    updateAllButtons();
  } else if (message.type === 'AUTOMATION_PROGRESS') {
    statusDiv.textContent = `Отправка ${message.current} из ${message.total}...`;
    statusDiv.style.color = '#6b7280';
  } else if (message.type === 'AUTOMATION_COMPLETE') {
    statusDiv.textContent = '✓ Отправка завершена!';
    statusDiv.style.color = '#6b7280';
    automateBtn.textContent = 'Отправить все запросы';
    automateBtn.classList.remove('stopping');
    automateBtn.disabled = false;
    isAutomating = false;
    updateAllButtons();
  } else if (message.type === 'AUTOMATION_STOPPED') {
    statusDiv.textContent = '⏸ Отправка остановлена';
    statusDiv.style.color = '#6b7280';
    automateBtn.textContent = 'Отправить все запросы';
    automateBtn.classList.remove('stopping');
    automateBtn.disabled = false;
    isAutomating = false;
    
    // Сбрасываем флаги отправки
    isSending = false;
    
    // Если бот отвечает, устанавливаем флаг, иначе сбрасываем
    if (message.isBotResponding) {
      isBotResponding = true;
    } else {
      isBotResponding = false;
    }
    
    updateAllButtons();
  } else if (message.type === 'QUERIES_UPDATED') {
    currentQueries = message.queries;
    currentTheme = message.theme;
    themeHeader.textContent = `Тема: ${currentTheme}`;
    if (lockBtn) {
      updateLockButton();
    }
    renderQueries();
    checkJuneTab();
  } else if (message.type === 'GENERATING') {
    statusDiv.textContent = 'Запрос на генерацию отправлен, ждем...';
    statusDiv.style.color = '#6b7280';
  } else if (message.type === 'BOT_STARTED') {
    isBotResponding = true;
    updateAllButtons();
  } else if (message.type === 'BOT_FINISHED') {
    isBotResponding = false;
    updateAllButtons();
  } else if (message.type === 'THEME_TRANSLATED') {
    currentTheme = message.theme;
    themeHeader.textContent = `Тема: ${currentTheme}`;
  }
});

// События
generateBtn.addEventListener('click', generateQueries);
automateBtn.addEventListener('click', automate);
lockBtn.addEventListener('click', toggleThemeLock);
langBtn.addEventListener('click', toggleLanguage);

// Уведомляем background при закрытии панели
window.addEventListener('beforeunload', () => {
  chrome.runtime.sendMessage({ type: 'SIDEPANEL_CLOSED' }).catch(() => {});
});

// Инициализация
async function init() {
  // Уведомляем background, что панель открылась и получаем состояние
  const state = await chrome.runtime.sendMessage({ type: 'SIDEPANEL_OPENED' }).catch(() => null);
  
  if (state) {
    currentQueries = state.currentQueries || [];
    currentTheme = state.currentTheme || '';
    isAutomating = state.isAutomating || false;
    isThemeLocked = state.isThemeLocked || false;
    currentLanguage = state.currentLanguage || 'RU';
    
    if (currentTheme) {
      themeHeader.textContent = `Тема: ${currentTheme}`;
    }
    
    // Обновляем кнопку замка после загрузки состояния
    updateLockButton();
    
    // Обновляем кнопку языка после загрузки состояния
    updateLanguageButton();
  }
  
  // Если список запросов пуст, генерируем автоматически
  if (currentQueries.length === 0) {
    await generateQueries();
  } else {
    renderQueries();
    await checkJuneTab();
  }
}

init();
