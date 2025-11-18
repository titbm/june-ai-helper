# JuneAI Helper

Chrome расширение для автоматической генерации и отправки вопросов в June AI.

## Возможности

- 🤖 Генерация 10 естественных вопросов через AI (OpenRouter)
- 🎯 Случайный выбор темы из 200+ вариантов (крипто, технологии, наука и др.)
- 🌍 Поддержка русского и английского языков
- ⚡ Автоматическая отправка всех вопросов в June AI
- 🎨 Дизайн в стиле June AI
- 🔒 Безопасное хранение API ключа на backend

## Установка

1. Клонируй репозиторий
2. Открой `chrome://extensions`
3. Включи "Developer mode"
4. Нажми "Load unpacked"
5. Выбери папку с расширением

## Backend

API ключ OpenRouter защищен через Cloudflare Workers:
- Бесплатно 100k запросов/день
- Ключ хранится в секретах Cloudflare
- API URL: `https://juneai-helper-api.juneai.workers.dev`

Подробнее в `backend/README.md`

## Использование

1. Открой June AI: https://askjune.ai/app/chat
2. Кликни на иконку расширения
3. Нажми "Обновить запросы" для генерации новых вопросов
4. Нажми "Отправить все запросы" для автоматической отправки

## Технологии

- Chrome Extension Manifest V3
- OpenRouter API (бесплатные модели)
- Cloudflare Workers (backend)
- Vanilla JS (без фреймворков)
