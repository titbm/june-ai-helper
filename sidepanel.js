// Массив заготовленных вопросов
const QUESTION_POOL = [
  "Как работает квантовый компьютер?",
  "Объясни принцип работы нейронных сетей простыми словами",
  "Какие языки программирования лучше всего подходят для машинного обучения?",
  "Расскажи о последних достижениях в области искусственного интеллекта",
  "Как создать эффективную систему управления проектами?",
  "Какие книги по саморазвитию ты бы порекомендовал?",
  "Объясни разницу между блокчейном и обычной базой данных",
  "Как правильно организовать рабочее пространство для продуктивности?",
  "Расскажи о теории относительности Эйнштейна",
  "Какие навыки будут наиболее востребованы в ближайшие 10 лет?",
  "Как работает технология 5G?",
  "Объясни концепцию метавселенной",
  "Какие методы изучения иностранных языков наиболее эффективны?",
  "Расскажи о принципах здорового питания",
  "Как создать успешный стартап с нуля?",
  "Объясни, что такое квантовая запутанность",
  "Какие тренды в веб-разработке актуальны сейчас?",
  "Как работает технология распознавания лиц?",
  "Расскажи о психологии принятия решений",
  "Какие методы медитации помогают снизить стресс?",
  "Объясни принцип работы криптовалют",
  "Как развить критическое мышление?",
  "Расскажи о теории эволюции Дарвина",
  "Какие техники тайм-менеджмента наиболее эффективны?",
  "Как работает искусственный интеллект в медицине?",
  "Объясни концепцию устойчивого развития",
  "Какие навыки нужны для карьеры в Data Science?",
  "Расскажи о принципах дизайн-мышления",
  "Как создать эффективную презентацию?",
  "Объясни, что такое темная материя",
  "Какие методы борьбы с прокрастинацией работают?",
  "Расскажи о будущем автономных автомобилей",
  "Как работает технология дополненной реальности?",
  "Объясни принципы эмоционального интеллекта",
  "Какие стратегии помогают в изучении программирования?",
  "Расскажи о влиянии социальных сетей на общество",
  "Как создать личный бренд в интернете?",
  "Объясни концепцию циркулярной экономики",
  "Какие навыки soft skills наиболее важны?",
  "Расскажи о принципах работы квантовой криптографии",
  "Как развить креативность?",
  "Объясни, что такое синдром самозванца и как с ним бороться",
  "Какие технологии изменят мир в ближайшие 20 лет?",
  "Расскажи о принципах эффективной коммуникации",
  "Как работает технология CRISPR?",
  "Объясни концепцию минимализма в жизни",
  "Какие методы помогают улучшить память?",
  "Расскажи о будущем космических путешествий",
  "Как создать пассивный доход?",
  "Объясни принципы работы квантовых вычислений",
  "Какие привычки успешных людей стоит перенять?",
  "Расскажи о влиянии музыки на мозг",
  "Как работает технология умного дома?",
  "Объясни концепцию осознанности (mindfulness)",
  "Какие навыки нужны для работы в кибербезопасности?",
  "Расскажи о принципах устойчивой архитектуры",
  "Как развить эмпатию?",
  "Объясни, что такое синергия в бизнесе",
  "Какие методы помогают справиться с выгоранием?",
  "Расскажи о будущем искусственного мяса",
  "Как создать эффективную команду?",
  "Объясни принципы работы квантовых сенсоров",
  "Какие стратегии помогают в переговорах?",
  "Расскажи о влиянии сна на продуктивность",
  "Как работает технология беспилотных дронов?",
  "Объясни концепцию экономики впечатлений",
  "Какие навыки нужны для работы с большими данными?",
  "Расскажи о принципах позитивной психологии",
  "Как развить лидерские качества?",
  "Объясни, что такое парадокс Ферми",
  "Какие методы помогают повысить мотивацию?",
  "Расскажи о будущем возобновляемой энергетики",
  "Как создать вирусный контент?",
  "Объясни принципы работы квантовой телепортации",
  "Какие стратегии помогают в обучении новым навыкам?",
  "Расскажи о влиянии физических упражнений на мозг",
  "Как работает технология блокчейн в финансах?",
  "Объясни концепцию экономики совместного потребления",
  "Какие навыки нужны для работы в UX/UI дизайне?",
  "Расскажи о принципах системного мышления",
  "Как развить финансовую грамотность?",
  "Объясни, что такое эффект бабочки",
  "Какие методы помогают улучшить концентрацию?",
  "Расскажи о будущем биотехнологий",
  "Как создать эффективную маркетинговую стратегию?",
  "Объясни принципы работы квантовых алгоритмов",
  "Какие стратегии помогают в решении конфликтов?",
  "Расскажи о влиянии чтения на развитие личности",
  "Как работает технология нейроинтерфейсов?",
  "Объясни концепцию экономики знаний",
  "Какие навыки нужны для работы в DevOps?",
  "Расскажи о принципах эффективного делегирования",
  "Как развить стрессоустойчивость?",
  "Объясни, что такое теория игр",
  "Какие методы помогают улучшить публичные выступления?",
  "Расскажи о будущем квантовых коммуникаций",
  "Как создать устойчивую бизнес-модель?",
  "Объясни принципы работы искусственных нейронных сетей"
];

let currentQueries = [];
let isJuneTabOpen = false;
let isAutomating = false;
let shouldStopAutomation = false;

// Элементы DOM
const generateBtn = document.getElementById('generateBtn');
const automateBtn = document.getElementById('automateBtn');
const queriesList = document.getElementById('queriesList');
const statusDiv = document.getElementById('status');
const footer = document.querySelector('footer');

// Сохранение состояния
async function saveState() {
  await chrome.storage.local.set({
    currentQueries,
    isAutomating
  });
}

// Загрузка состояния
async function loadState() {
  const data = await chrome.storage.local.get(['currentQueries', 'isAutomating']);
  if (data.currentQueries) {
    currentQueries = data.currentQueries;
  }
  if (data.isAutomating) {
    isAutomating = data.isAutomating;
  }
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

// Обновление UI в зависимости от активной вкладки
function updateUI() {
  // Если идет отправка, показываем кнопку остановки
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
    // Кнопка открывает June AI если есть запросы
    automateBtn.disabled = currentQueries.length === 0;
    automateBtn.textContent = 'Открыть June AI';
    automateBtn.classList.remove('stopping');
    
    // Скрываем кнопки June
    document.querySelectorAll('.june-btn').forEach(btn => {
      btn.style.display = 'none';
    });
  } else {
    statusDiv.textContent = '';
    statusDiv.style.color = '#6b7280';
    // Активируем кнопку отправки если есть запросы
    automateBtn.disabled = currentQueries.length === 0;
    automateBtn.textContent = 'Отправить все запросы';
    automateBtn.classList.remove('stopping');
    
    // Показываем кнопки June
    document.querySelectorAll('.june-btn').forEach(btn => {
      btn.style.display = 'flex';
    });
  }
}

// Генерация случайных запросов
function generateQueries() {
  const shuffled = [...QUESTION_POOL].sort(() => Math.random() - 0.5);
  currentQueries = shuffled.slice(0, 10);
  renderQueries();
  checkJuneTab();
  statusDiv.textContent = '';
  saveState();
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
    
    // Добавляем обработчик для центральной кнопки
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
  // Если отправка уже идет - останавливаем
  if (isAutomating) {
    shouldStopAutomation = true;
    automateBtn.textContent = 'Остановка...';
    automateBtn.disabled = true;
    statusDiv.textContent = 'Остановка отправки...';
    statusDiv.style.color = '#ef4444';
    chrome.runtime.sendMessage({ type: 'STOP_AUTOMATION' });
    return;
  }
  
  if (currentQueries.length === 0) return;
  
  await checkJuneTab();
  if (!isJuneTabOpen) {
    // Открываем June AI
    openJuneAI();
    return;
  }
  
  isAutomating = true;
  shouldStopAutomation = false;
  automateBtn.textContent = 'Остановить отправку';
  automateBtn.classList.add('stopping');
  automateBtn.disabled = false;
  statusDiv.textContent = 'Запуск отправки...';
  statusDiv.style.color = '#6b7280';
  saveState();
  chrome.runtime.sendMessage({ type: 'AUTOMATE', queries: currentQueries });
}

// Обработка сообщений от background
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TAB_CHANGED') {
    // Background уведомляет об изменении активной вкладки
    isJuneTabOpen = message.isJune;
    updateUI();
  } else if (message.type === 'ERROR') {
    statusDiv.textContent = `✗ ${message.message}`;
    statusDiv.style.color = '#ef4444';
    automateBtn.textContent = 'Отправить все запросы';
    automateBtn.classList.remove('stopping');
    automateBtn.disabled = false;
    isAutomating = false;
    shouldStopAutomation = false;
    saveState();
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
    shouldStopAutomation = false;
    saveState();
  } else if (message.type === 'STOPPED') {
    statusDiv.textContent = '⏸ Отправка остановлена';
    statusDiv.style.color = '#f59e0b';
    automateBtn.textContent = 'Отправить все запросы';
    automateBtn.classList.remove('stopping');
    automateBtn.disabled = false;
    isAutomating = false;
    shouldStopAutomation = false;
    saveState();
  }
});

// События
generateBtn.addEventListener('click', generateQueries);
automateBtn.addEventListener('click', automate);

// Обработка команды закрытия панели
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'CLOSE_SIDEPANEL') {
    window.close();
  }
});

// Уведомляем background, что панель открылась
chrome.runtime.sendMessage({ type: 'SIDEPANEL_OPENED' }).catch(() => {});

// Уведомляем background при закрытии панели
window.addEventListener('beforeunload', () => {
  chrome.runtime.sendMessage({ type: 'SIDEPANEL_CLOSED' }).catch(() => {});
});

// Инициализация
async function init() {
  await loadState();
  
  // Если список запросов пуст, генерируем автоматически
  if (currentQueries.length === 0) {
    generateQueries();
  } else {
    renderQueries();
    checkJuneTab();
  }
}

init();
