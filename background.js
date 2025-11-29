// API Configuration
const API_URL = 'https://june-ai-helper.vercel.app/api/generate';

// Темы для случайной генерации
const RANDOM_THEMES_RU = [
  // Общие темы
  "квантовая физика", "искусственный интеллект", "космос и астрономия",
  "программирование", "психология", "история", "биология", "философия",
  "экономика", "литература", "музыка", "кино", "спорт", "кулинария",
  "путешествия", "технологии", "медицина", "экология", "математика",
  "архитектура", "дизайн", "маркетинг", "бизнес", "образование",
  
  // ИИ и нейросети
  "ChatGPT", "Claude", "GPT-4", "GPT-4o", "o1", "Gemini", "Gemini Pro",
  "Llama 3", "Mistral", "Mixtral", "Qwen", "DeepSeek", "Yi",
  "Grok", "Perplexity", "Anthropic Claude", "OpenAI модели",
  "Midjourney", "DALL-E 3", "Stable Diffusion", "Flux", "генерация изображений ИИ",
  "Sora", "Runway", "Pika", "генерация видео ИИ",
  "ElevenLabs", "генерация голоса ИИ", "клонирование голоса",
  "промпт инжиниринг", "RAG системы", "fine-tuning моделей",
  "LLM модели", "мультимодальные ИИ", "ИИ ассистенты",
  "автоматизация с помощью ИИ", "ИИ в программировании", "GitHub Copilot",
  "Cursor IDE", "Windsurf", "Replit Agent", "ИИ для кодинга",
  "ИИ в дизайне", "ИИ в маркетинге", "ИИ в медицине",
  "этика ИИ", "безопасность ИИ", "AGI", "alignment problem",
  "галлюцинации в ИИ", "контекстное окно в LLM", "токены в LLM",
  "open source ИИ модели", "локальные LLM", "Ollama", "LM Studio",
  "ИИ агенты", "AutoGPT", "AgentGPT", "BabyAGI", "CrewAI",
  "LangChain", "LangGraph", "LlamaIndex", "vector databases",
  "Pinecone", "Weaviate", "Chroma", "Qdrant",
  "embeddings", "semantic search", "ИИ для анализа данных",
  "function calling", "tool use", "ReAct агенты", "chain of thought",
  "multi-agent системы", "агентные фреймворки", "автономные агенты",
  
  // Культурные феномены
  "стриминг культура", "подкасты", "TikTok тренды", "мемы и интернет-культура",
  "инфлюенсеры", "блогинг", "YouTube экосистема", "Twitch стриминг",
  "киберспорт и профессиональный гейминг", "аниме культура", "K-pop феномен",
  "Netflix и стриминговые сервисы", "социальные сети", "цифровой детокс",
  "удаленная работа", "цифровые кочевники", "коворкинги", "фриланс",
  "поколение Z", "миллениалы", "выгорание", "work-life balance",
  "осознанность и медитация", "ментальное здоровье", "психотерапия онлайн",
  
  // Политика и общество
  "политическая система США", "демократия в США", "выборы в США",
  "политическая система России", "федерализм", "разделение властей",
  "избирательные системы", "политические партии", "популизм",
  "геополитика", "международные санкции", "дипломатия",
  "права человека", "свобода слова", "цензура в интернете",
  "миграционная политика", "национализм", "глобализация",
  "политическая поляризация", "фейковые новости", "пропаганда",
  "гражданское общество", "протестные движения", "активизм",
  
  // Крипто и блокчейн
  "криптовалюты", "блокчейн", "Bitcoin", "Ethereum", "DeFi",
  "NFT", "смарт-контракты", "майнинг криптовалют", "стейкинг",
  "криптовалютные биржи", "холодные кошельки", "Web3", "DAO",
  "токенизация активов", "решения второго уровня", "криптовалютное регулирование",
  "политика США по криптовалютам", "SEC и криптовалюты", "крипторегулирование в России",
  "влияние политики на крипту", "криптовалюты и выборы", "лоббирование крипты",
  "Трамп и криптовалюты", "Trump NFT", "крипто-политика Трампа",
  "семья Трампа и крипта", "криптопроекты Трампа", "World Liberty Financial",
  "Эрик Трамп и криптовалюты", "Дональд Трамп младший и крипта", "Бэррон Трамп и крипта",
  "Мелания Трамп NFT", "криптоспекуляции семьи Трампа", "конфликт интересов Трампа",
  "республиканцы и крипта", "демократы и крипта", "Байден и криптовалюты",
  "центробанковые цифровые валюты", "запрет криптовалют", "криптовалютное законодательство",
  "трейдинг криптовалют", "технический анализ крипторынка", "фундаментальный анализ криптопроектов",
  "альткоины", "мемкоины", "стейблкоины", "криптовалютные деривативы",
  "фьючерсы на криптовалюты", "спотовая торговля", "маржинальная торговля",
  "арбитраж криптовалют", "стратегия усреднения", "стратегия холдинга",
  "управление рисками в крипте", "диверсификация криптопортфеля",
  "экосистема Solana", "Cardano", "Polkadot", "Avalanche", "Polygon",
  "Binance Smart Chain", "Cosmos", "Chainlink", "Uniswap", "PancakeSwap",
  "кошелек MetaMask", "Ledger", "Trezor", "Trust Wallet", "кошелек Phantom",
  "криптовалютные налоги", "пиринговый обмен криптовалют", "атомарные свопы",
  "кросс-чейн мосты", "обернутые токены", "фарминг доходности", "майнинг ликвидности",
  "непостоянные потери", "оптимизация комиссий", "MEV", "мгновенные кредиты",
  "криптовалютные индексы", "Bitcoin ETF", "институциональные инвестиции в крипту",
  "криптовалютная безопасность", "сид-фразы", "приватные ключи",
  "двухфакторная аутентификация", "фишинг в крипте", "скам-проекты", "памп и дамп",
  "анализ технической документации", "токеномика", "график разблокировки токенов", "стратегии аирдропов",
  "ICO vs IDO vs IEO", "платформы для запуска проектов", "криптовалютные сигналы",
  "анализ блокчейна", "отслеживание китов", "анализ книги ордеров",
  "криптовалютные боты", "сеточная торговля", "скальпинг криптовалют",
  "свинг трейдинг крипты", "позиционная торговля", "усреднение стоимости",
  
  // Наука и технологии
  "нейронауки", "генетика", "робототехника", "квантовая механика",
  "виртуальная реальность", "дополненная реальность", "кибербезопасность",
  "машинное обучение", "большие данные", "облачные технологии", "интернет вещей",
  "квантовые вычисления", "нанотехнологии", "биотехнологии", "возобновляемая энергия",
  "климатические изменения", "устойчивое развитие", "урбанистика", "социология",
  "антропология", "политология", "международные отношения", "право",
  "этика", "логика", "эстетика", "религиоведение", "культурология",
  "лингвистика", "семиотика", "риторика", "журналистика", "PR и коммуникации",
  "реклама", "брендинг", "продуктовый дизайн", "UX/UI дизайн", "графический дизайн",
  "фотография", "видеопродакшн", "анимация", "разработка игр", "киберспорт",
  "астрофизика", "теория струн", "темная материя", "черные дыры",
  "технологии CRISPR", "стволовые клетки", "персонализированная медицина",
  "нейропластичность", "когнитивные науки", "поведенческая экономика",
  "геймификация", "EdTech", "FinTech", "HealthTech", "PropTech",
  "электромобили", "автономные автомобили", "Hyperloop", "технологии дронов",
  "3D печать", "Индустрия 4.0", "умные города", "цифровые двойники",
  "edge computing", "технологии 5G", "разработка 6G", "квантовая криптография"
];

const RANDOM_THEMES_EN = [
  // General topics
  "quantum physics", "artificial intelligence", "space and astronomy",
  "programming", "psychology", "history", "biology", "philosophy",
  "economics", "literature", "music", "cinema", "sports", "cooking",
  "travel", "technology", "medicine", "ecology", "mathematics",
  "architecture", "design", "marketing", "business", "education",
  
  // AI and neural networks
  "ChatGPT", "Claude", "GPT-4", "GPT-4o", "o1", "Gemini", "Gemini Pro",
  "Llama 3", "Mistral", "Mixtral", "Qwen", "DeepSeek", "Yi",
  "Grok", "Perplexity", "Anthropic Claude", "OpenAI models",
  "Midjourney", "DALL-E 3", "Stable Diffusion", "Flux", "AI image generation",
  "Sora", "Runway", "Pika", "AI video generation",
  "ElevenLabs", "AI voice generation", "voice cloning",
  "prompt engineering", "RAG systems", "model fine-tuning",
  "LLM models", "multimodal AI", "AI assistants",
  "AI automation", "AI in programming", "GitHub Copilot",
  "Cursor IDE", "Windsurf", "Replit Agent", "AI for coding",
  "AI in design", "AI in marketing", "AI in medicine",
  "AI ethics", "AI safety", "AGI", "alignment problem",
  "AI hallucinations", "context window in LLM", "tokens in LLM",
  "open source AI models", "local LLMs", "Ollama", "LM Studio",
  "AI agents", "AutoGPT", "AgentGPT", "BabyAGI", "CrewAI",
  "LangChain", "LangGraph", "LlamaIndex", "vector databases",
  "Pinecone", "Weaviate", "Chroma", "Qdrant",
  "embeddings", "semantic search", "AI for data analysis",
  "function calling", "tool use", "ReAct agents", "chain of thought",
  "multi-agent systems", "agent frameworks", "autonomous agents",
  
  // Cultural phenomena
  "streaming culture", "podcasts", "TikTok trends", "memes and internet culture",
  "influencers", "blogging", "YouTube ecosystem", "Twitch streaming",
  "esports and professional gaming", "anime culture", "K-pop phenomenon",
  "Netflix and streaming services", "social media", "digital detox",
  "remote work", "digital nomads", "coworking spaces", "freelancing",
  "Generation Z", "millennials", "burnout", "work-life balance",
  "mindfulness and meditation", "mental health", "online therapy",
  
  // Politics and society
  "US political system", "democracy in USA", "US elections",
  "Russian political system", "federalism", "separation of powers",
  "electoral systems", "political parties", "populism",
  "geopolitics", "international sanctions", "diplomacy",
  "human rights", "freedom of speech", "internet censorship",
  "immigration policy", "nationalism", "globalization",
  "political polarization", "fake news", "propaganda",
  "civil society", "protest movements", "activism",
  
  // Crypto and blockchain
  "cryptocurrencies", "blockchain", "Bitcoin", "Ethereum", "DeFi",
  "NFT", "smart contracts", "crypto mining", "staking",
  "crypto exchanges", "cold wallets", "Web3", "DAO",
  "asset tokenization", "layer 2 solutions", "crypto regulation",
  "US crypto policy", "SEC and cryptocurrencies", "crypto regulation in Russia",
  "politics impact on crypto", "cryptocurrencies and elections", "crypto lobbying",
  "Trump and cryptocurrencies", "Trump NFT", "Trump crypto policy",
  "Trump family and crypto", "Trump crypto projects", "World Liberty Financial",
  "Eric Trump and cryptocurrencies", "Donald Trump Jr and crypto", "Barron Trump and crypto",
  "Melania Trump NFT", "Trump family crypto speculation", "Trump conflict of interest",
  "Republicans and crypto", "Democrats and crypto", "Biden and cryptocurrencies",
  "central bank digital currencies", "crypto bans", "cryptocurrency legislation",
  "crypto trading", "crypto technical analysis", "crypto fundamental analysis",
  "altcoins", "memecoins", "stablecoins", "crypto derivatives",
  "crypto futures", "spot trading", "margin trading",
  "crypto arbitrage", "averaging strategy", "holding strategy",
  "risk management in crypto", "crypto portfolio diversification",
  "Solana ecosystem", "Cardano", "Polkadot", "Avalanche", "Polygon",
  "Binance Smart Chain", "Cosmos", "Chainlink", "Uniswap", "PancakeSwap",
  "MetaMask wallet", "Ledger", "Trezor", "Trust Wallet", "Phantom wallet",
  "crypto taxes", "P2P crypto exchange", "atomic swaps",
  "cross-chain bridges", "wrapped tokens", "yield farming", "liquidity mining",
  "impermanent loss", "fee optimization", "MEV", "flash loans",
  "crypto indexes", "Bitcoin ETF", "institutional crypto investments",
  "crypto security", "seed phrases", "private keys",
  "two-factor authentication", "crypto phishing", "scam projects", "pump and dump",
  "whitepaper analysis", "tokenomics", "token unlock schedule", "airdrop strategies",
  "ICO vs IDO vs IEO", "project launch platforms", "crypto signals",
  "blockchain analysis", "whale tracking", "order book analysis",
  "crypto bots", "grid trading", "crypto scalping",
  "swing trading crypto", "position trading", "cost averaging",
  
  // Science and technology
  "neuroscience", "genetics", "robotics", "quantum mechanics",
  "virtual reality", "augmented reality", "cybersecurity",
  "machine learning", "big data", "cloud technologies", "internet of things",
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
  "electric vehicles", "autonomous vehicles", "Hyperloop", "drone technology",
  "3D printing", "Industry 4.0", "smart cities", "digital twins",
  "edge computing", "5G technology", "6G development", "quantum cryptography"
];

// Глобальное состояние
let currentQueries = [];
let currentTheme = '';
let isAutomating = false;
let isThemeLocked = false;
let currentLanguage = 'RU'; // Язык генерации запросов

// Очистка storage при установке/обновлении расширения
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    await chrome.storage.local.clear();
  }
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
chrome.tabs.onUpdated.addListener((_, changeInfo, tab) => {
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
    } catch {}
  }
}

// Обработка сообщений
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CHECK_ACTIVE_TAB') {
    checkActiveTab().then(sendResponse);
    return true;
  } else if (message.type === 'GET_STATE') {
    sendResponse({ currentQueries, currentTheme, isAutomating, isThemeLocked, currentLanguage });
    return true;
  } else if (message.type === 'GENERATE_QUERIES') {
    generateQueries(message.language).then(sendResponse);
    return true;
  } else if (message.type === 'SEND_TO_JUNE') {
    handleSendToJune(message.query).then(sendResponse);
    return true;
  } else if (message.type === 'STOP_SINGLE_SEND') {
    // Прерываем текущую одиночную отправку
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (tab) {
        chrome.tabs.sendMessage(tab.id, { type: 'STOP_TYPING' }).catch(() => {});
        chrome.tabs.sendMessage(tab.id, { type: 'CLEAR_AND_STOP' }).catch(() => {});
      }
      sendResponse({ success: true });
    });
    return true;
  } else if (message.type === 'AUTOMATE') {
    handleAutomate();
  } else if (message.type === 'STOP_AUTOMATION') {
    shouldStopAutomation = true;
    stopTypingInTab();
  } else if (message.type === 'BOT_RESPONSE_COMPLETE') {
    // Уведомляем sidepanel что бот закончил отвечать
    notifySidepanel(null, { type: 'BOT_RESPONSE_COMPLETE' });
  } else if (message.type === 'MESSAGE_SUBMITTED') {
    // Сообщение отправлено - можно переименовывать чат
    // Здесь можно добавить логику переименования, если нужно
  } else if (message.type === 'BOT_STARTED') {
    // Бот начал отвечать - блокируем кнопки
    notifySidepanel(null, { type: 'BOT_STARTED' });
  } else if (message.type === 'BOT_FINISHED') {
    // Бот закончил отвечать - разблокируем кнопки
    notifySidepanel(null, { type: 'BOT_FINISHED' });
  } else if (message.type === 'SIDEPANEL_OPENED') {
    // Sidepanel сообщает, что открылась - отправляем текущее состояние
    if (sender.tab) {
      sidePanelState.set(sender.tab.windowId, true);
    }
    sendResponse({ currentQueries, currentTheme, isAutomating, isThemeLocked, currentLanguage });
    return true;
  } else if (message.type === 'SET_THEME_LOCK') {
    isThemeLocked = message.locked;
    saveState();
    return true;
  } else if (message.type === 'SET_LANGUAGE') {
    currentLanguage = message.language;
    saveState();
    return true;
  } else if (message.type === 'TRANSLATE_THEME') {
    const translatedTheme = translateTheme(message.theme, message.targetLanguage);
    currentTheme = translatedTheme;
    console.log('Theme translated and saved:', currentTheme);
    saveState();
    sendResponse({ translatedTheme });
    return true;
  } else if (message.type === 'TRANSLATE_AND_GENERATE') {
    // Переводим тему
    const translatedTheme = translateTheme(message.theme, message.targetLanguage);
    currentTheme = translatedTheme;
    currentLanguage = message.targetLanguage;
    
    // Временно блокируем тему для генерации
    isThemeLocked = true;
    
    // Генерируем запросы с переведенной темой
    generateQueries(currentLanguage).then(result => {
      // Восстанавливаем состояние блокировки
      isThemeLocked = message.keepLocked;
      saveState();
      sendResponse(result);
    });
    
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
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab || !tab.url || !tab.url.includes('askjune.ai')) {
    return { success: false, error: 'Активная вкладка не June AI' };
  }
  
  try {
    // Проверяем, пустой ли чат ПЕРЕД отправкой
    let isNewChat = false;
    try {
      const checkResponse = await chrome.tabs.sendMessage(tab.id, { 
        type: 'CHECK_CHAT_HAS_MESSAGES' 
      });
      isNewChat = checkResponse && !checkResponse.hasMessages;
      console.log('Chat check before send:', { hasMessages: checkResponse?.hasMessages, isNewChat });
    } catch (error) {
      console.log('Failed to check chat:', error);
    }
    
    // Останавливаем текущий ввод (если идет) и очищаем textarea
    await chrome.tabs.sendMessage(tab.id, { type: 'CLEAR_AND_STOP' }).catch(() => {});
    
    // Небольшая задержка для обработки остановки
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // insertAndSubmit сам дождется когда можно начинать ввод
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: 'INSERT_AND_SUBMIT',
      text: query
    });
    
    // Если процесс был остановлен, не считаем это ошибкой
    if (response && response.stopped) {
      return { success: false, stopped: true };
    }
    
    // Если это был новый чат, переименовываем СРАЗУ, не дожидаясь ответа
    if (isNewChat && currentTheme) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'RENAME_CHAT',
        theme: currentTheme
      }).then(result => {
        console.log('Rename result:', result);
      }).catch(error => {
        console.log('Failed to rename chat:', error);
      });
    } else {
      console.log('Skipping rename:', { isNewChat, hasTheme: !!currentTheme, theme: currentTheme });
    }
    
    return response || { success: true };
  } catch (error) {
    // Игнорируем ошибки связанные с прерыванием
    if (error.message && error.message.includes('message port closed')) {
      return { success: false, stopped: true };
    }
    return { success: false, error: error.message };
  }
}

// Сохранение состояния
async function saveState() {
  await chrome.storage.local.set({
    currentQueries,
    currentTheme,
    isAutomating,
    isThemeLocked,
    currentLanguage
  });
}

// Загрузка состояния
async function loadState() {
  const data = await chrome.storage.local.get(['currentQueries', 'currentTheme', 'isAutomating', 'isThemeLocked', 'currentLanguage']);
  if (data.currentQueries) {
    currentQueries = data.currentQueries;
  }
  if (data.currentTheme) {
    currentTheme = data.currentTheme;
  }
  if (data.isAutomating !== undefined) {
    isAutomating = data.isAutomating;
  }
  if (data.isThemeLocked !== undefined) {
    isThemeLocked = data.isThemeLocked;
  }
  if (data.currentLanguage) {
    currentLanguage = data.currentLanguage;
  }
}

// Генерация случайной темы
function getRandomTheme(language = 'RU') {
  const themes = language === 'EN' ? RANDOM_THEMES_EN : RANDOM_THEMES_RU;
  return themes[Math.floor(Math.random() * themes.length)];
}

// Перевод темы на другой язык
function translateTheme(theme, targetLanguage) {
  // Убираем лишние пробелы
  const cleanTheme = theme.trim();
  
  const ruIndex = RANDOM_THEMES_RU.indexOf(cleanTheme);
  const enIndex = RANDOM_THEMES_EN.indexOf(cleanTheme);
  
  console.log('translateTheme:', { 
    originalTheme: theme,
    cleanTheme, 
    targetLanguage, 
    ruIndex, 
    enIndex
  });
  
  if (targetLanguage === 'EN' && ruIndex !== -1) {
    const translated = RANDOM_THEMES_EN[ruIndex];
    console.log('Translated RU->EN:', cleanTheme, '->', translated);
    return translated;
  } else if (targetLanguage === 'RU' && enIndex !== -1) {
    const translated = RANDOM_THEMES_RU[enIndex];
    console.log('Translated EN->RU:', cleanTheme, '->', translated);
    return translated;
  }
  
  console.log('No translation found, returning original:', cleanTheme);
  return cleanTheme;
}

// Генерация через Gemini API
async function generateQueriesWithAI(theme, language = 'RU') {
  notifySidepanel(null, { type: 'GENERATING' });
  
  const useEnglish = language === 'EN';
  
  const prompt = useEnglish 
    ? `Generate exactly 10 diverse, casual questions about "${theme}" that a curious person would ask. Make them VERY DIFFERENT from each other:
- Mix question types: "what", "how", "why", "when", "where", "who", "can", "should", "is it true"
- Vary the style: some basic, some specific, some practical, some philosophical, some controversial
- Include personal angle: "how do I", "what if I", "should I"
- Add comparisons: "vs", "better than", "difference between"
- Mix tones: curious, skeptical, practical, worried, excited
- Some questions start lowercase, some uppercase (natural typing)
- Occasional typo or missing punctuation
One question per line, no numbering.`
    : `Сгенерируй ровно 10 РАЗНООБРАЗНЫХ вопросов про "${theme}", которые любопытный человек задал бы в чате. Сделай их ОЧЕНЬ РАЗНЫМИ:
- Разные типы: "что", "как", "почему", "зачем", "когда", "где", "можно ли", "правда ли", "стоит ли"
- Разный стиль: базовые, конкретные, практические, философские, спорные
- Личный угол: "как мне", "что если я", "стоит ли мне"
- Сравнения: "или", "лучше чем", "разница между", "vs"
- Разные тона: любопытство, скептицизм, практичность, беспокойство, восторг
- Часть вопросов с маленькой буквы, часть с большой (естественный набор)
- Иногда опечатки или без знаков препинания
Каждый вопрос с новой строки, без нумерации.`;
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });
    
    if (!response.ok) {
      console.error('API error:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (!data.choices?.[0]?.message) {
      console.error('Invalid response format');
      return null;
    }
    
    const text = data.choices[0].message.content;
    const questions = text.split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 10 && !q.match(/^\d+[\.\)]/))
      .slice(0, 10);
    
    if (questions.length >= 8) {
      return questions;
    }
    
    return null;
  } catch (error) {
    console.error('API request failed:', error);
    return null;
  }
}

// Генерация запросов
async function generateQueries(language) {
  // Обновляем язык, если передан
  if (language) {
    currentLanguage = language;
  }
  
  // Если тема заблокирована, используем текущую тему
  const theme = isThemeLocked && currentTheme ? currentTheme : getRandomTheme(currentLanguage);
  currentTheme = theme;
  
  const aiQueries = await generateQueriesWithAI(theme, currentLanguage);
  
  if (aiQueries && aiQueries.length >= 8) {
    currentQueries = aiQueries;
  } else {
    // Фолбэк - генерируем простые вопросы
    if (currentLanguage === 'EN') {
      currentQueries = [
        "What is " + theme + "?",
        "How does " + theme + " work?",
        "Tell me more about " + theme,
        "what are examples of " + theme,
        "Why do we need " + theme + "?",
        "History of " + theme,
        "Advantages and disadvantages of " + theme,
        "Future of " + theme,
        "how to start learning " + theme,
        "Best resources about " + theme
      ];
    } else {
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
  }
  
  await saveState();
  notifySidepanel(null, { type: 'QUERIES_UPDATED', queries: currentQueries, theme: currentTheme });
  
  return { queries: currentQueries, theme: currentTheme };
}

async function handleAutomate() {
  if (currentQueries.length === 0) {
    notifySidepanel(null, { type: 'AUTOMATION_ERROR', message: 'Нет запросов для отправки' });
    return;
  }
  
  shouldStopAutomation = false;
  isAutomating = true;
  await saveState();
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab || !tab.url || !tab.url.includes('askjune.ai')) {
    notifySidepanel(null, { type: 'AUTOMATION_ERROR', message: 'Активная вкладка не June AI' });
    isAutomating = false;
    await saveState();
    return;
  }
  
  const automationTabId = tab.id;
  currentAutomationTabId = automationTabId;
  
  // Проверяем, есть ли сообщения в текущем чате
  let shouldCreateNewChat = true;
  try {
    const checkResponse = await chrome.tabs.sendMessage(automationTabId, { 
      type: 'CHECK_CHAT_HAS_MESSAGES' 
    });
    
    if (checkResponse && checkResponse.hasMessages) {
      // Показываем диалог выбора
      const choiceResponse = await chrome.tabs.sendMessage(automationTabId, { 
        type: 'SHOW_CHAT_CHOICE_DIALOG' 
      });
      
      // Если диалог был отменен (закрыт через STOP), останавливаем автоматизацию
      if (choiceResponse && choiceResponse.choice === 'cancelled') {
        try {
          await chrome.tabs.sendMessage(automationTabId, { type: 'STOP_AUTOMATION' });
        } catch {}
        
        // Проверяем, отвечает ли бот
        let isBotResponding = false;
        try {
          const botCheck = await chrome.tabs.sendMessage(automationTabId, { type: 'CHECK_BOT_RESPONDING' });
          isBotResponding = botCheck && botCheck.isBotResponding;
        } catch {}
        
        notifySidepanel(null, { type: 'AUTOMATION_STOPPED', isBotResponding });
        shouldStopAutomation = false;
        isAutomating = false;
        currentAutomationTabId = null;
        await saveState();
        return;
      }
      
      if (choiceResponse && choiceResponse.choice === 'current') {
        shouldCreateNewChat = false;
      }
    }
  } catch (error) {
    // Если была остановка, выходим
    if (shouldStopAutomation) {
      try {
        await chrome.tabs.sendMessage(automationTabId, { type: 'STOP_AUTOMATION' });
      } catch {}
      
      // Проверяем, отвечает ли бот
      let isBotResponding = false;
      try {
        const botCheck = await chrome.tabs.sendMessage(automationTabId, { type: 'CHECK_BOT_RESPONDING' });
        isBotResponding = botCheck && botCheck.isBotResponding;
      } catch {}
      
      notifySidepanel(null, { type: 'AUTOMATION_STOPPED', isBotResponding });
      shouldStopAutomation = false;
      isAutomating = false;
      currentAutomationTabId = null;
      await saveState();
      return;
    }
  }
  
  // Проверяем еще раз перед созданием overlay
  if (shouldStopAutomation) {
    notifySidepanel(null, { type: 'AUTOMATION_STOPPED' });
    shouldStopAutomation = false;
    isAutomating = false;
    currentAutomationTabId = null;
    await saveState();
    return;
  }
  
  // Создаем overlay для блокировки интерфейса
  try {
    await chrome.tabs.sendMessage(automationTabId, { type: 'START_AUTOMATION' });
  } catch {}
  
  // Создаем новый чат, если пользователь выбрал эту опцию
  if (shouldCreateNewChat) {
    try {
      await chrome.tabs.sendMessage(automationTabId, { type: 'CLICK_NEW_CHAT' });
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch {}
  }

  // Отправляем запросы
  let isFirstMessage = shouldCreateNewChat; // Флаг для переименования после первого сообщения
  
  for (let i = 0; i < currentQueries.length; i++) {
    if (shouldStopAutomation) {
      try {
        await chrome.tabs.sendMessage(automationTabId, { type: 'STOP_AUTOMATION' });
      } catch {}
      notifySidepanel(null, { type: 'AUTOMATION_STOPPED' });
      shouldStopAutomation = false;
      isAutomating = false;
      await saveState();
      return;
    }
    
    notifySidepanel(null, { type: 'AUTOMATION_PROGRESS', current: i + 1, total: currentQueries.length });
    
    try {
      const response = await chrome.tabs.sendMessage(automationTabId, {
        type: 'INSERT_AND_SUBMIT',
        text: currentQueries[i]
      });
      
      if (response && response.stopped) {
        try {
          await chrome.tabs.sendMessage(automationTabId, { type: 'STOP_AUTOMATION' });
        } catch {}
        
        // Проверяем, отвечает ли бот
        let isBotResponding = false;
        try {
          const botCheck = await chrome.tabs.sendMessage(automationTabId, { type: 'CHECK_BOT_RESPONDING' });
          isBotResponding = botCheck && botCheck.isBotResponding;
        } catch {}
        
        notifySidepanel(null, { type: 'AUTOMATION_STOPPED', isBotResponding });
        shouldStopAutomation = false;
        isAutomating = false;
        currentAutomationTabId = null;
        await saveState();
        return;
      }
      
      // Если это первое сообщение в новом чате, переименовываем чат под тему
      if (isFirstMessage && response && response.success) {
        isFirstMessage = false;
        // Запускаем переименование асинхронно, не блокируя автоматизацию
        (async () => {
          try {
            console.log('Renaming chat to theme (automation):', currentTheme);
            await new Promise(resolve => setTimeout(resolve, 500));
            const renameResult = await chrome.tabs.sendMessage(automationTabId, {
              type: 'RENAME_CHAT',
              theme: currentTheme
            });
            console.log('Rename result (automation):', renameResult);
          } catch (error) {
            console.log('Failed to rename chat (automation):', error);
          }
        })();
      }
      
      const delay = Math.random() * 4000 + 6000;
      const startTime = Date.now();
      while (Date.now() - startTime < delay) {
        if (shouldStopAutomation) {
          try {
            await chrome.tabs.sendMessage(automationTabId, { type: 'STOP_AUTOMATION' });
          } catch {}
          
          // Проверяем, отвечает ли бот
          let isBotResponding = false;
          try {
            const botCheck = await chrome.tabs.sendMessage(automationTabId, { type: 'CHECK_BOT_RESPONDING' });
            isBotResponding = botCheck && botCheck.isBotResponding;
          } catch {}
          
          notifySidepanel(null, { type: 'AUTOMATION_STOPPED', isBotResponding });
          shouldStopAutomation = false;
          isAutomating = false;
          currentAutomationTabId = null;
          await saveState();
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch {}
  }

  // Удаляем overlay после завершения
  try {
    await chrome.tabs.sendMessage(automationTabId, { type: 'STOP_AUTOMATION' });
  } catch {}
  
  notifySidepanel(null, { type: 'AUTOMATION_COMPLETE' });
  shouldStopAutomation = false;
  isAutomating = false;
  currentAutomationTabId = null;
  await saveState();
}
