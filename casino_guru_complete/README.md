# Banana Bonanza Game

Офлайн версия игры Banana Bonanza с полной функциональностью и Flask API.

## Особенности

- ✅ Полностью офлайн игра
- ✅ Работающие ставки и кешаут
- ✅ Автокешаут
- ✅ Блокировка кнопок во время игры
- ✅ Оригинальные шрифты и иконки
- ✅ WebSocket мок для офлайн режима
- ✅ Flask API для всех игровых операций
- ✅ Полная совместимость с Vercel

## Развертывание на Vercel

### 1. Установка Vercel CLI

```bash
npm install -g vercel
```

### 2. Логин в Vercel

```bash
vercel login
```

### 3. Развертывание

```bash
# Развертывание в продакшн
vercel --prod

# Или для разработки
vercel dev
```

### 4. Локальный запуск Flask API

```bash
# Установка зависимостей
pip install -r requirements.txt

# Запуск Flask сервера
python mock_server_flask.py
```

## Структура проекта

```
├── staging.playzia.com/          # Основная папка с игрой
│   └── games/
│       └── playzia-bananabonanza/
│           ├── index.html        # Главный файл игры
│           ├── assets/           # Ресурсы игры
│           └── src/              # Исходный код
├── static.casino.guru/           # Статические ресурсы
├── fonts.gstatic.com/            # Шрифты
├── maxcdn.bootstrapcdn.com/      # Bootstrap
├── mock_server_flask.py          # Flask API сервер
├── vercel.json                   # Конфигурация Vercel
├── package.json                  # Настройки проекта
├── requirements.txt              # Python зависимости
└── README.md                     # Этот файл
```

## API Endpoints

Flask API предоставляет следующие эндпоинты:

- `GET/POST /api/token` - Получение токена аутентификации
- `GET /api/game/balance` - Баланс игрока
- `POST /api/game/spin` - Игровой спин
- `POST /api/game/enter` - Вход в игру
- `POST /api/game/cashout` - Вывод средств
- `POST /api/game/leave` - Выход из игры
- `GET /api/game/history` - История игр
- `GET/POST /api/game/settings` - Настройки игры
- `GET /api/game/statistics` - Статистика игрока
- `GET /frontendService/gameVoteData` - Данные голосования
- `GET/POST /staging.playzia.com/api/*` - Staging API
- `GET/POST /gs2.playzia.com/api/*` - GS2 Playzia API
- `GET/POST /api.playzia.staging.hizi-service.com/*` - Playzia API v2

## Доступ к игре

После развертывания игра будет доступна по адресу:
- `https://your-project.vercel.app/`
- `https://your-project.vercel.app/game`

## Технические детали

- **Платформа**: Vercel + Flask
- **Тип**: Статический сайт + Serverless API
- **Backend**: Python Flask
- **Шрифты**: Встроенные оригинальные шрифты
- **Изображения**: Оптимизированные WebP
- **JavaScript**: Vanilla JS + PIXI.js
- **WebSocket**: Мок для офлайн режима
- **API**: RESTful Flask API

## Поддержка

Игра полностью автономна с собственным Flask API и не требует внешних зависимостей.
