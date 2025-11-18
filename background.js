// OpenRouter API
const OPENROUTER_API_KEY = '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';
const FREE_MODELS = [
  'google/gemma-3-27b-it:free',
  'google/gemini-2.0-flash-exp:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-chat-v3-0324:free'
];

// Темы для случайной генерации
const RANDOM_THEMES = [
  // Русские темы
  "квантовая физика", "искусственный интеллект", "космос и астрономия",
  "программирование", "психология", "история", "биология", "философия",
  "экономика", "литература", "музыка", "кино", "спорт", "кулинария",
  "путешествия", "технологии", "медицина", "экология", "математика",
  "архитектура", "дизайн", "маркетинг", "бизнес", "образование",
  // Крипто и блокчейн темы (русский)
  "криптовалюты", "блокчейн", "Bitcoin", "Ethereum", "DeFi",
  "NFT", "смарт-контракты", "майнинг криптовалют", "стейкинг",
  "криптовалютные биржи", "холодные кошельки", "Web3", "DAO",
  "токенизация активов", "Layer 2 решения", "криптовалютное регулирование",
  "трейдинг криптовалют", "технический анализ крипторынка", "фундаментальный анализ криптопроектов",
  "альткоины", "мемкоины", "стейблкоины", "криптовалютные деривативы",
  "фьючерсы на криптовалюты", "спотовая торговля", "маржинальная торговля",
  "арбитраж криптовалют", "DCA стратегия", "HODL стратегия",
  "риск-менеджмент в крипте", "диверсификация криптопортфеля",
  "Solana экосистема", "Cardano", "Polkadot", "Avalanche", "Polygon",
  "Binance Smart Chain", "Cosmos", "Chainlink", "Uniswap", "PancakeSwap",
  "MetaMask кошелек", "Ledger", "Trezor", "Trust Wallet", "Phantom кошелек",
  "криптовалютные налоги", "P2P обмен криптовалют", "atomic swaps",
  "cross-chain мосты", "wrapped tokens", "yield farming", "liquidity mining",
  "impermanent loss", "gas fees оптимизация", "MEV", "flash loans",
  "криптовалютные индексы", "Bitcoin ETF", "институциональные инвестиции в крипту",
  "криптовалютная безопасность", "seed фразы", "приватные ключи",
  "2FA для крипты", "фишинг в крипте", "rug pull", "pump and dump",
  "whitepaper анализ", "tokenomics", "vesting schedule", "airdrop стратегии",
  "ICO vs IDO vs IEO", "launchpad платформы", "криптовалютные сигналы",
  "on-chain анализ", "whale watching", "order book анализ",
  "криптовалютные боты", "grid trading", "scalping криптовалют",
  "swing trading крипты", "position trading", "dollar cost averaging",
  // Другие темы (русский)
  "нейронауки", "генетика", "робототехника", "квантовая механика",
  "виртуальная реальность", "дополненная реальность", "кибербезопасность",
  "машинное обучение", "большие данные", "облачные технологии", "интернет вещей",
  "квантовые вычисления", "нанотехнологии", "биотехнологии", "возобновляемая энергия",
  "климатические изменения", "устойчивое развитие", "урбанистика", "социология",
  "антропология", "политология", "международные отношения", "право",
  "этика", "логика", "эстетика", "религиоведение", "культурология",
  "астрофизика", "теория струн", "темная материя", "черные дыры",
  "CRISPR технологии", "стволовые клетки", "персонализированная медицина",
  "нейропластичность", "когнитивные науки", "поведенческая экономика",
  "геймификация", "EdTech", "FinTech", "HealthTech", "PropTech",
  "электромобили", "автономные автомобили", "гиперлуп", "дроны",
  "3D печать", "индустрия 4.0", "умные города", "цифровые двойники",
  "edge computing", "5G технологии", "6G разработка", "квантовая криптография",
  // Английские темы
  "quantum physics", "artificial intelligence", "space and astronomy",
  "programming", "psychology", "history", "biology", "philosophy",
  "economics", "literature", "music", "cinema", "sports", "cooking",
  "travel", "technology", "medicine", "ecology", "mathematics",
  "architecture", "design", "marketing", "business", "education",
  // Крипто и блокчейн темы (английский)
  "cryptocurrencies", "blockchain technology", "Bitcoin fundamentals", "Ethereum ecosystem", "DeFi protocols",
  "NFT marketplace", "smart contracts", "crypto mining", "staking rewards",
  "crypto exchanges", "cold wallets", "Web3 development", "DAO governance",
  "asset tokenization", "Layer 2 scaling", "crypto regulation",
  "cryptocurrency trading", "crypto technical analysis", "crypto fundamental analysis",
  "altcoins", "memecoins", "stablecoins", "crypto derivatives",
  "crypto futures trading", "spot trading", "margin trading",
  "crypto arbitrage", "DCA strategy", "HODL strategy",
  "crypto risk management", "portfolio diversification",
  "Solana ecosystem", "Cardano blockchain", "Polkadot parachains", "Avalanche subnets", "Polygon zkEVM",
  "Binance Smart Chain", "Cosmos IBC", "Chainlink oracles", "Uniswap V4", "PancakeSwap",
  "MetaMask wallet", "Ledger hardware wallet", "Trezor security", "Trust Wallet", "Phantom wallet",
  "crypto taxes", "P2P crypto exchange", "atomic swaps", "cross-chain bridges", "wrapped tokens",
  "yield farming strategies", "liquidity mining", "impermanent loss", "gas optimization", "MEV bots",
  "flash loans", "crypto indexes", "Bitcoin ETF", "institutional crypto", "crypto security",
  "seed phrases", "private keys", "2FA crypto", "phishing attacks", "rug pulls",
  "pump and dump schemes", "whitepaper analysis", "tokenomics design", "vesting schedules",
  "airdrop hunting", "ICO vs IDO", "launchpad platforms", "crypto signals", "on-chain analysis",
  "whale tracking", "order book depth", "trading bots", "grid trading", "crypto scalping",
  "swing trading crypto", "position trading", "dollar cost averaging crypto",
  // Другие темы (английский)
  "neuroscience", "genetics", "robotics", "quantum mechanics",
  "virtual reality", "augmented reality", "cybersecurity",
  "machine learning", "big data", "cloud computing", "internet of things",
  "quantum computing", "nanotechnology", "biotechnology", "renewable energy",
  "climate change", "sustainable development", "urban planning", "sociology",
  "anthropology", "political science", "international relations", "law",
  "ethics", "logic", "aesthetics", "religious studies", "cultural studies",
  "linguistics", "semiotics", "rhetoric", "journalism", "PR and communications",
  "advertising", "branding", "product design", "UX/UI design", "graphic design",
  "photography", "video production", "animation", "game development", "esports",
  "astrophysics", "string theory", "dark matter", "black holes",
  "CRISPR technology", "stem cells", "personalized medicine",
  "neuroplasticity", "cognitive science", "behavioral economics",
  "gamification", "EdTech", "FinTech", "HealthTech", "PropTech",
  "electric vehicles", "autonomous cars", "hyperloop", "drone technology",
  "3D printing", "Industry 4.0", "smart cities", "digital twins",
  "edge computing", "5G networks", "6G development", "quantum cryptography"
];

// Глобальное состояние
let currentQueries = [];
let currentTheme = '';
let isAutomating = false;

// Очистка storage при установке/обновлении расширения
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    await chrome.storage.local.clear();
    console.log('Storage cleared on', details.reason);
  }
  // Загружаем состояние
  await loadState();
});

// Загрузка состояния при старте
loadState();

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

// Уведомляем sidepanel об изменении активной вкладки или других событиях
function notifySidepanel(tab, customMessage) {
  if (customMessage) {
    chrome.runtime.sendMessage(customMessage).catch(() => {});
    return;
  }
  
  const isJune = tab && tab.url && tab.url.includes('askjune.ai');
  chrome.runtime.sendMessage({ 
    type: 'TAB_CHANGED', 
    isJune: isJune,
    url: tab?.url 
  }).catch(() => {});
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
  } else if (message.type === 'GET_STATE') {
    sendResponse({ currentQueries, currentTheme, isAutomating });
    return true;
  } else if (message.type === 'GENERATE_QUERIES') {
    generateQueries().then(sendResponse);
    return true;
  } else if (message.type === 'SEND_TO_JUNE') {
    handleSendToJune(message.query);
  } else if (message.type === 'AUTOMATE') {
    handleAutomate();
  } else if (message.type === 'STOP_AUTOMATION') {
    shouldStopAutomation = true;
    stopTypingInTab();
  } else if (message.type === 'SIDEPANEL_OPENED') {
    // Sidepanel сообщает, что открылась - отправляем текущее состояние
    if (sender.tab) {
      sidePanelState.set(sender.tab.windowId, true);
    }
    sendResponse({ currentQueries, currentTheme, isAutomating });
    return true;
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

// Сохранение состояния
async function saveState() {
  await chrome.storage.local.set({
    currentQueries,
    currentTheme,
    isAutomating
  });
}

// Загрузка состояния
async function loadState() {
  const data = await chrome.storage.local.get(['currentQueries', 'currentTheme', 'isAutomating']);
  if (data.currentQueries) {
    currentQueries = data.currentQueries;
  }
  if (data.currentTheme) {
    currentTheme = data.currentTheme;
  }
  if (data.isAutomating !== undefined) {
    isAutomating = data.isAutomating;
  }
}

// Генерация случайной темы
function getRandomTheme() {
  return RANDOM_THEMES[Math.floor(Math.random() * RANDOM_THEMES.length)];
}

// Генерация через OpenRouter
async function generateQueriesWithAI(theme) {
  notifySidepanel(null, { type: 'GENERATING' });
  
  const isEnglish = /^[a-zA-Z\s]+$/.test(theme);
  
  const prompt = isEnglish 
    ? `Generate exactly 10 casual, natural questions about "${theme}" that a regular person would type quickly in a chat. Make them sound like genuine curiosity, not formal interview questions. Each question should flow naturally from the previous one. Use simple, everyday language. Mix capital and lowercase starts - some questions start with capital letter, some with lowercase, to make it feel more human and spontaneous. Add occasional typos or missing punctuation. Start with basic "what is" or "how does" questions, then get more specific and personal. One question per line, no numbering.`
    : `Сгенерируй ровно 10 простых, естественных вопросов на тему "${theme}", которые обычный человек быстро набрал бы в чате. Пусть они звучат как искреннее любопытство, а не формальные вопросы интервью. Каждый вопрос должен естественно вытекать из предыдущего. Используй простой, повседневный язык. Чередуй заглавные и строчные буквы в начале - некоторые вопросы начинай с заглавной буквы, некоторые со строчной, чтобы выглядело более по-человечески и спонтанно. Добавь иногда опечатки или пропущенные знаки препинания. Начни с базовых вопросов типа "что такое" или "как работает", потом переходи к более конкретным и личным. Каждый вопрос с новой строки, без нумерации.`;
  
  for (const model of FREE_MODELS) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices[0].message.content;
        const questions = text.split('\n')
          .map(q => q.trim())
          .filter(q => q.length > 10 && !q.match(/^\d+[\.\)]/))
          .slice(0, 10);
        
        if (questions.length >= 8) {
          return questions;
        }
      }
    } catch (error) {
      console.log(`Модель ${model} не сработала:`, error);
    }
  }
  
  return null;
}

// Генерация запросов
async function generateQueries() {
  const theme = getRandomTheme();
  currentTheme = theme;
  
  const aiQueries = await generateQueriesWithAI(theme);
  
  if (aiQueries && aiQueries.length >= 8) {
    currentQueries = aiQueries;
  } else {
    // Фолбэк - генерируем простые вопросы
    currentQueries = [
      "Что такое " + theme + "?",
      "Как работает " + theme + "?",
      "Расскажи подробнее про " + theme,
      "какие есть примеры " + theme,
      "Зачем нужен " + theme + "?",
      "История развития " + theme,
      "Преимущества и недостатки " + theme,
      "Будущее " + theme,
      "как начать изучать " + theme,
      "Лучшие ресурсы по " + theme
    ];
  }
  
  await saveState();
  notifySidepanel(null, { type: 'QUERIES_UPDATED', queries: currentQueries, theme: currentTheme });
  
  return { queries: currentQueries, theme: currentTheme };
}

async function handleAutomate() {
  if (currentQueries.length === 0) {
    notifySidepanel(null, { type: 'ERROR', message: 'Нет запросов для отправки' });
    return;
  }
  
  shouldStopAutomation = false;
  isAutomating = true;
  await saveState();
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab || !tab.url || !tab.url.includes('askjune.ai')) {
    notifySidepanel(null, { type: 'ERROR', message: 'Активная вкладка не June AI' });
    isAutomating = false;
    await saveState();
    return;
  }
  
  const automationTabId = tab.id;
  currentAutomationTabId = automationTabId;
  
  // Создаем новый чат
  try {
    await chrome.tabs.sendMessage(automationTabId, { type: 'CLICK_NEW_CHAT' });
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error('Error creating new chat:', error);
  }

  // Отправляем запросы
  for (let i = 0; i < currentQueries.length; i++) {
    if (shouldStopAutomation) {
      notifySidepanel(null, { type: 'STOPPED' });
      shouldStopAutomation = false;
      isAutomating = false;
      await saveState();
      return;
    }
    
    notifySidepanel(null, { type: 'PROGRESS', current: i + 1, total: currentQueries.length });
    
    try {
      const response = await chrome.tabs.sendMessage(automationTabId, {
        type: 'INSERT_AND_SUBMIT',
        text: currentQueries[i]
      });
      
      if (response && response.stopped) {
        notifySidepanel(null, { type: 'STOPPED' });
        shouldStopAutomation = false;
        isAutomating = false;
        currentAutomationTabId = null;
        await saveState();
        return;
      }
      
      const delay = Math.random() * 4000 + 6000;
      const startTime = Date.now();
      while (Date.now() - startTime < delay) {
        if (shouldStopAutomation) {
          notifySidepanel(null, { type: 'STOPPED' });
          shouldStopAutomation = false;
          isAutomating = false;
          currentAutomationTabId = null;
          await saveState();
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error sending query:', error);
    }
  }

  notifySidepanel(null, { type: 'COMPLETE' });
  shouldStopAutomation = false;
  isAutomating = false;
  currentAutomationTabId = null;
  await saveState();
}
