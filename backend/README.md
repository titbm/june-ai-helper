# Backend для JuneAI Helper

## Деплой на Cloudflare Workers (бесплатно)

### 1. Установи Wrangler CLI
```bash
npm install -g wrangler
```

### 2. Залогинься в Cloudflare
```bash
wrangler login
```

### 3. Добавь API ключ как секрет
```bash
wrangler secret put OPENROUTER_API_KEY
# Вставь свой ключ: sk-or-v1-...
```

### 4. Задеплой
```bash
cd backend
wrangler deploy
```

### 5. Получишь URL типа:
```
https://juneai-helper-api.your-subdomain.workers.dev
```

### 6. Обнови background.js
Замени:
```javascript
const OPENROUTER_API_KEY = '...';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
```

На:
```javascript
const API_URL = 'https://juneai-helper-api.your-subdomain.workers.dev';
```

И убери заголовок Authorization из запросов.

## Альтернатива - Vercel

Если хочешь Vercel вместо Cloudflare, скажи - создам конфиг для Vercel.
