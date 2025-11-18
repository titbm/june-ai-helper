# June AI Auto Sender - Chrome Extension

## Цель
Chrome расширение для автоматической отправки вопросов в AI чат https://askjune.ai/app/chat

## Режимы работы June AI

### 1. Guest Mode (без авторизации)
- **Лимит**: 3 запроса (счетчик "X requests remaining")
- **Текстовые модели**: 10 из 13 доступны
- **Заблокированы**: OpenAI GPT 5.1, Gemini 2.5 Pro (disabled с иконкой замка)
- **AutoRouter**: доступен
- **Image/Video Models**: доступны в меню (нужно проверять каждую)
- **Функции**: New Chat, Privacy+ Mode, история чатов
- **Призыв**: "Sign up to gain access to higher limits"

### 2. Free Tier (бесплатный аккаунт)
- **Лимит**: БЕЗЛИМИТНЫЕ запросы (нет счетчика)
- **Текстовые модели**: 10 из 13 доступны (те же что в Guest)
- **Заблокированы**: OpenAI GPT 5.1, Gemini 2.5 Pro (disabled)
- **AutoRouter**: доступен
- **Система баллов**: Points (162 points в примере)
- **Дополнительно**: ссылка "Points" в сайдбаре
- **Функции**: все как в Guest + система поощрений

### 3. Pro Tier (платная подписка)
- **Лимит**: БЕЗЛИМИТНЫЕ запросы
- **Текстовые модели**: ВСЕ 13 моделей доступны
- **Разблокированы**: OpenAI GPT 5.1, Gemini 2.5 Pro
- **Video Models**: ВСЕ 6 моделей доступны (Veo 3.1, Sora 2, Sora 2 Pro)
- **AutoRouter**: доступен
- **Система баллов**: Points (3319 points в примере)
- **Бейдж**: "pro" рядом с email
- **Дополнительно**: 
  - Ссылка "Leaderboard"
  - "Invite friends - Earn extra points 🔥"
- **Функции**: полный доступ ко всем возможностям

### Ключевые различия

| Функция | Guest | Free | Pro |
|---------|-------|------|-----|
| Лимит запросов | 3 | ∞ | ∞ |
| Текстовые модели | 10/13 | 10/13 | 13/13 |
| OpenAI GPT 5.1 | ❌ | ❌ | ✅ |
| Gemini 2.5 Pro | ❌ | ❌ | ✅ |
| Video Models (Pro) | ❌ | ❌ | ✅ |
| AutoRouter | ✅ | ✅ | ✅ |
| Система баллов | ❌ | ✅ | ✅ |
| Leaderboard | ❌ | ❌ | ✅ |

## Ключевые селекторы

```javascript
// Ввод и отправка
const inputSelector = 'textarea[placeholder="Type your question here..."]';
const submitSelector = 'button[name="submit"]';

// Выбор модели
const modelButtonSelector = 'button:has-text("June Qwen3 32B")'; // или текущая модель
const autoRouterToggle = 'switch'; // в контексте AutoRouter
const imageModelsItem = 'menuitem:has-text("Image Models")';
const videoModelsItem = 'menuitem:has-text("Video Models")';

// Управление
const newChatButton = 'button:has-text("New Chat")';
const requestCounter = 'text*="requests remaining"'; // только в Guest Mode
const thoughtsIndicator = 'text*="Thought"'; // индикатор обработки

// Определение режима
const guestModeIndicator = 'text*="Guest Mode"';
const proModeIndicator = 'text*="pro"'; // бейдж рядом с email
const requestsRemainingExists = 'text*="requests remaining"'; // есть = Guest
```

## Доступные модели

### Текстовые (13)
- June Qwen3 32B (по умолчанию, Crypto Expert)
- Z.ai GLM 4.6, DeepSeek R1, OpenAI GPT OSS 120B
- OpenAI o4 mini, Grok 4, Grok 4 Fast
- Claude Sonnet 4.5, Claude Haiku 4.5
- Gemini 2.5 Flash
- OpenAI GPT 5.1 (Pro only), Gemini 2.5 Pro (Pro only)
- Qwen3 235B A22B (Deprecated)

### Изображения (6)
- Flux.1 [dev], Qwen Image, Seedream 4.0
- Nano Banana, Imagen 4, Flux Kontext [pro]

### Видео (6)
- Wan 2.2 A14B, Kling 2.5 Turbo
- Veo 3.1 Fast, Veo 3.1, Sora 2, Sora 2 Pro
- (Veo и Sora требуют Pro)

### AutoRouter
- Автоматический выбор модели для каждого сообщения
- Переключатель в меню выбора модели

## Функциональность расширения (MVP)

### 1. Боковая панель (Side Panel)
- Открывается при клике на иконку расширения
- Содержит:
  - Кнопка "Сгенерировать запросы" вверху
  - Список из 10 сгенерированных запросов
  - Кнопка "Automate" внизу

### 2. Генерация запросов
- По клику на "Сгенерировать запросы" → создается 10 случайных вопросов к AI
- Темы любые (технологии, наука, жизнь, творчество и т.д.)
- Запросы отображаются списком

### 3. Взаимодействие с запросами
**При наведении на запрос:**
- Справа появляется кнопка "June →" (небольшая)

**При клике на сам запрос:**
- Текст копируется в буфер обмена

**При клике на кнопку "June →":**
- Запрос отправляется в открытый чат June AI
- Автоматически нажимается submit
- Работает только если открыта вкладка https://askjune.ai/app/chat

### 4. Автоматизация (кнопка Automate)
- Создает новый чат в June AI
- Поочередно отправляет все 10 запросов
- Ждет ответа перед отправкой следующего
- Работает только если открыта вкладка June AI

## Алгоритм работы

### Генерация запросов
1. Пользователь кликает "Сгенерировать запросы"
2. Расширение генерирует 10 случайных вопросов
3. Отображает их в боковой панели

### Отправка одного запроса
1. Проверить, открыта ли вкладка June AI
2. Если нет → показать уведомление
3. Если да → найти textarea и кнопку submit
4. Вставить текст запроса
5. Кликнуть submit

### Автоматизация (Automate)
1. Проверить, открыта ли вкладка June AI
2. Кликнуть "New Chat" (создать новый чат)
3. Для каждого из 10 запросов:
   - Вставить текст в textarea
   - Кликнуть submit
   - Ждать появления ответа (мониторить индикатор "Thought")
   - Задержка 2-3 секунды
   - Следующий запрос
4. Показать уведомление о завершении

## Структура расширения

- **manifest.json** - конфиг (Manifest V3)
- **background.js** - управление очередью и координация
- **content.js** - взаимодействие со страницей June AI
- **popup.html/js** - интерфейс управления
- **options.html/js** - настройки (импорт/экспорт вопросов)
- **storage.js** - работа с chrome.storage

## Важные детали

- Боковая панель: "New Chat", Privacy+ Mode, история, счетчик запросов
- Меню моделей открывается кликом на кнопку текущей модели
- AutoRouter - переключатель в верхней части меню
- Image/Video модели - подменю в меню выбора модели
- Ответ AI появляется с индикатором "Thought for X.XXs"
- Счетчик запросов уменьшается после каждого запроса
