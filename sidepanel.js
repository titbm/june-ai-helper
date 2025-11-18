// Состояние UI
let currentQueries = [];
let isJuneTabOpen = false;
let isAutomating = false;
let currentTheme = '';
let isThemeLocked = false;

// Элементы DOM
const generateBtn = document.getElementById('generateBtn');
const automateBtn = document.getElementById('automateBtn');
const queriesList = document.getElementById('queriesList');
const statusDiv = document.getElementById('status');
const footer = document.querySelector('footer');
const themeHeader = document.getElementById('themeHeader');
const lockBtn = document.getElementById('lockBtn');

// Загрузка состояния из background
async function loadState() {
  const state = await chrome.runtime.sendMessage({ type: 'GET_STATE' });
  if (state) {
    currentQueries = state.currentQueries || [];
    currentTheme = state.currentTheme || '';
    isAutomating = state.isAutomating || false;
    isThemeLocked = state.isThemeLocked || false;
    
    if (currentTheme) {
      themeHeader.textContent = `Тема: ${currentTheme}`;
    }
    
    updateLockButton();
    renderQueries();
  }
}

// Обновление кнопки замка
function updateLockButton() {
  if (isThemeLocked) {
    lockBtn.classList.add('locked');
    lockBtn.title = 'Разблокировать тему';
  } else {
    lockBtn.classList.remove('locked');
    lockBtn.title = 'Заблокировать тему';
  }
}

// Переключение блокировки темы
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

// Проверка активной вкладки
async function checkJuneTab() {
  const response = await chrome.runtime.sendMessage({ type: 'CHECK_ACTIVE_TAB' });
  isJuneTabOpen = response.isJune;
  updateUI();
}

// Открытие June AI
function openJuneAI() {
  chrome.tabs.create({ url: 'https://askjune.ai/app/chat' });
}

// Обновление UI
function updateUI() {
  if (isAutomating) {
    automateBtn.textContent = 'Остановить отправку';
    automateBtn.classList.add('stopping');
    automateBtn.disabled = false;
    if (!statusDiv.textContent.includes('Отправка')) {
      statusDiv.textContent = 'Отправка запущена...';
      statusDiv.style.color = '#6b7280';
    }
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
  } else {
    statusDiv.textContent = '';
    statusDiv.style.color = '#6b7280';
    automateBtn.disabled = currentQueries.length === 0;
    automateBtn.textContent = 'Отправить все запросы';
    automateBtn.classList.remove('stopping');
    
    document.querySelectorAll('.june-btn').forEach(btn => {
      btn.style.display = 'flex';
    });
  }
}

// Генерация запросов
async function generateQueries() {
  generateBtn.disabled = true;
  generateBtn.textContent = 'Генерация...';
  statusDiv.textContent = 'Запрос отправлен, ждем ответа...';
  statusDiv.style.color = '#6b7280';
  
  const result = await chrome.runtime.sendMessage({ type: 'GENERATE_QUERIES' });
  
  if (result) {
    currentQueries = result.queries;
    currentTheme = result.theme;
    themeHeader.textContent = `Тема: ${currentTheme}`;
  }
  
  generateBtn.disabled = false;
  generateBtn.textContent = 'Обновить запросы';
  
  renderQueries();
  await checkJuneTab();
  statusDiv.textContent = '✓ Запросы обновлены';
  statusDiv.style.color = '#6b7280';
}

// Отрисовка списка запросов
function renderQueries() {
  if (currentQueries.length === 0) {
    queriesList.innerHTML = `
      <div class="empty-state">
        <p>Нажмите "Сгенерировать запросы"<br>чтобы создать 10 вопросов</p>
        <button id="generateBtnCenter" class="btn-primary">Сгенерировать запросы</button>
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
    </div>
  `).join('');

  queriesList.classList.remove('empty');
  footer.classList.remove('empty-state');
  footer.classList.add('has-queries');

  // Обработчики для копирования
  document.querySelectorAll('.query-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (!e.target.classList.contains('june-btn')) {
        const index = item.dataset.index;
        copyToClipboard(currentQueries[index]);
      }
    });
  });

  // Обработчики для кнопок June
  document.querySelectorAll('.june-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = btn.dataset.index;
      sendToJune(currentQueries[index]);
    });
  });
}

// Копирование в буфер
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    statusDiv.textContent = '✓ Скопировано в буфер';
    setTimeout(() => statusDiv.textContent = '', 2000);
  } catch (err) {
    statusDiv.textContent = '✗ Ошибка копирования';
  }
}

// Отправка одного запроса в June
async function sendToJune(query) {
  await checkJuneTab();
  if (!isJuneTabOpen) {
    openJuneAI();
    return;
  }
  
  chrome.runtime.sendMessage({ type: 'SEND_TO_JUNE', query });
  
  statusDiv.textContent = '→ Отправлено в June AI';
  statusDiv.style.color = '#6b7280';
  setTimeout(() => {
    statusDiv.textContent = '';
    checkJuneTab();
  }, 2000);
}

// Отправка всех запросов
async function automate() {
  if (isAutomating) {
    automateBtn.textContent = 'Остановка...';
    automateBtn.disabled = true;
    statusDiv.textContent = 'Остановка отправки...';
    statusDiv.style.color = '#6b7280';
    chrome.runtime.sendMessage({ type: 'STOP_AUTOMATION' });
    return;
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
  
  chrome.runtime.sendMessage({ type: 'AUTOMATE' });
}

// Обработка сообщений от background
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'CLOSE_SIDEPANEL') {
    window.close();
  } else if (message.type === 'TAB_CHANGED') {
    isJuneTabOpen = message.isJune;
    updateUI();
  } else if (message.type === 'ERROR') {
    statusDiv.textContent = `✗ ${message.message}`;
    statusDiv.style.color = '#ef4444';
    automateBtn.textContent = 'Отправить все запросы';
    automateBtn.classList.remove('stopping');
    automateBtn.disabled = false;
    isAutomating = false;
  } else if (message.type === 'PROGRESS') {
    statusDiv.textContent = `Отправка ${message.current} из ${message.total}...`;
    statusDiv.style.color = '#6b7280';
  } else if (message.type === 'COMPLETE') {
    statusDiv.textContent = '✓ Отправка завершена!';
    statusDiv.style.color = '#10b981';
    automateBtn.textContent = 'Отправить все запросы';
    automateBtn.classList.remove('stopping');
    automateBtn.disabled = false;
    isAutomating = false;
  } else if (message.type === 'STOPPED') {
    statusDiv.textContent = '⏸ Отправка остановлена';
    statusDiv.style.color = '#6b7280';
    automateBtn.textContent = 'Отправить все запросы';
    automateBtn.classList.remove('stopping');
    automateBtn.disabled = false;
    isAutomating = false;
  } else if (message.type === 'QUERIES_UPDATED') {
    currentQueries = message.queries;
    currentTheme = message.theme;
    themeHeader.textContent = `Тема: ${currentTheme}`;
    updateLockButton();
    renderQueries();
    checkJuneTab();
  } else if (message.type === 'GENERATING') {
    statusDiv.textContent = 'Запрос на генерацию отправлен, ждем...';
    statusDiv.style.color = '#6b7280';
  }
});

// События
generateBtn.addEventListener('click', generateQueries);
automateBtn.addEventListener('click', automate);
lockBtn.addEventListener('click', toggleThemeLock);

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
    
    if (currentTheme) {
      themeHeader.textContent = `Тема: ${currentTheme}`;
    }
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
