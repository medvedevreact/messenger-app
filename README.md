# Messenger App

Fullstack-приложение: React (Vite) + Express + MongoDB + Socket.IO. Ниже — как запускать локально, как устроен Docker и куда смотреть при деплое.

## Структура репозитория

```text
messenger-app/
├── client/                 # фронтенд (Vite + React)
│   ├── Dockerfile
│   ├── nginx.conf          # reverse proxy + статика в Docker-образе
│   └── src/
│       └── config/
│           └── api.ts      # базовый URL API (dev vs production)
├── server/                 # бэкенд (Express, ts-node)
│   └── Dockerfile
├── docker-compose.yml      # MongoDB + backend + frontend (nginx)
└── README.md
```

## Локальная разработка

Нужны Node.js, MongoDB локально (или отдельный контейнер только с БД).

### 1. Бэкенд

```bash
cd server
npm install
```

Создай `server/.env` (см. пример переменных в разделе [Переменные окружения](#переменные-окружения)). Затем:

```bash
npm run dev
```

Сервер по умолчанию слушает порт **3000**.

### 2. Фронтенд

```bash
cd client
npm install
npm run dev
```

Vite обычно открывается на **http://localhost:5173**. В режиме разработки запросы к API идут на `http://localhost:3000` (см. `client/src/config/api.ts`).

### 3. CORS

В `server/src/app.ts` для локальной разработки указан origin Vite (`http://localhost:5173`). Если страница открывается с другого origin, добавь его в настройки `cors` и Socket.IO.

---

## Docker

### Требования

- Docker
- Docker Compose v2

### Запуск

Из корня репозитория:

```bash
docker compose up --build
```

Приложение в браузере: **http://localhost/** (порт 80). API с точки зрения браузера — те же хост и порт: запросы идут на пути вроде `/sign-in`, `/users/...`, `/conversations/...`; **nginx** в контейнере `frontend` проксирует их на сервис **`backend:3000`** внутри сети Compose.

Полезные команды:

```bash
# фоновый режим
docker compose up -d --build

# логи бэкенда
docker compose logs -f backend

# остановка
docker compose down
```

После изменения **`client/nginx.conf`** или логики фронта пересобери образ фронта (при необходимости без кэша):

```bash
docker compose build frontend --no-cache
docker compose up -d
```

### Сервисы в `docker-compose.yml`

| Сервис    | Роль |
|-----------|------|
| `mongodb` | База данных, том `mongo_data` |
| `backend` | Express + Socket.IO, порт 3000 **внутри** сети Docker |
| `frontend`| Nginx: статика из `client/dist` + `proxy_pass` на `backend` |

Порт **3000** наружу пробрасывать не обязательно, если весь трафик идёт через nginx на **80**.

### Образы

- **`server/Dockerfile`** — установка зависимостей, `ts-node src/app.ts`, `EXPOSE 3000`.
- **`client/Dockerfile`** — multi-stage: `npm run build`, затем nginx раздаёт `dist` и подключает `nginx.conf`.

---

## Как связаны браузер, nginx и бэкенд

1. **Браузер** не знает имя контейнера `backend`. Он обращается только к **опубликованному** адресу (например `http://localhost`).
2. Внутри Docker контейнеры общаются по **имени сервиса** из Compose, например `http://backend:3000`.
3. Фронт в production-сборке использует **пустой базовый URL** API (если не задан `VITE_API_URL`), поэтому запросы остаются на том же origin — их обрабатывает nginx.

Конфигурация прокси в проекте:

**Файл:** `client/nginx.conf`

```nginx
server {
    listen 80;

    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;
    }

    location ~ ^/(sign-up|sign-in|log-out|me|users|conversations|socket\.io|api)(/|$) {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Сегменты в regexp должны совпадать с путями Express (включая Socket.IO на `/socket.io`).

---

## Базовый URL API на фронте

**Файл:** `client/src/config/api.ts`

```typescript
/** Production (Docker/nginx): same origin, empty base. Dev: Vite → backend. */
export const API_BASE =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:3000" : "");

export function getSocketUrl(): string {
  return (
    import.meta.env.VITE_API_URL ??
    (import.meta.env.DEV ? "http://localhost:3000" : window.location.origin)
  );
}
```

Импортируй `API_BASE` в модулях с HTTP-запросами и `getSocketUrl()` в месте подключения Socket.IO (после монтирования в браузере).

### Переменная `VITE_API_URL`

- Задаётся на **этапе сборки** (`docker build`, CI), не «на лету» в уже собранном бандле.
- Если нужен отдельный публичный URL API (другой домен), передай его build-arg в `docker-compose` и пробрось в `Dockerfile` как `ARG`/`ENV` перед `npm run build`.
- Для текущей схемы «один домен + nginx» значение можно **не задавать**: сработает пустая база и относительные пути.

---

## Переменные окружения

### Бэкенд (`server/.env` для локальной разработки)

| Переменная | Назначение |
|------------|------------|
| `MONGO_URL` | Строка подключения MongoDB |
| `JWT_SECRET` | Секрет для JWT (длинная случайная строка) |
| `PORT` | Порт HTTP (по умолчанию в коде часто 3000) |
| `CLOUDINARY_*` | При использовании загрузки в Cloudinary |

Пример **без реальных секретов**:

```env
MONGO_URL=mongodb://localhost:27017/users
JWT_SECRET=замени_на_случайную_строку
PORT=3000
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Docker Compose

Рекомендуется не хранить секреты в git: вынести их в файл **`.env`** в корне (добавь `.env` в `.gitignore`) и ссылаться в `docker-compose.yml` через `${JWT_SECRET}` и т.д.

### Фронт (опционально)

Файл `client/.env` / `client/.env.local` — только переменные с префиксом **`VITE_`**, если нужно переопределить URL API при сборке.

---

## Деплой на VPS (например Selectel)

Краткий чеклист:

1. Установить Docker и Compose на сервер.
2. Перенести проект, настроить production `.env` / secrets.
3. В сборке фронта указать **`VITE_API_URL`**, если API на **другом** домене; при одном домене и reverse proxy — как в этом репозитории, можно не задавать.
4. Открыть наружу **80** и **443**; MongoDB и прочие внутренние сервисы — только внутри Docker-сети.
5. Настроить HTTPS (Let's Encrypt, certbot или балансировщик с TLS).
6. Обновить **CORS** и **origin для Socket.IO** в `server/src/app.ts` на реальный домен (`https://...`), а не только `http://localhost:5173`.

---

## Типичные проблемы

| Симптом | Возможная причина |
|---------|-------------------|
| `ERR_CONNECTION_REFUSED` на `localhost:3000` | Фронт собран с обращением к порту 3000, а он не опубликован; либо не используется same-origin + nginx. |
| 404 на API за nginx | Неверный `proxy_pass` или путь на бэкенде не совпадает с regexp в `nginx.conf`. |
| CORS-ошибки | Origin страницы не разрешён в `cors()` на сервере. |
| Socket.IO не подключается | Нет прокси для `/socket.io` или неверный origin в настройках `Server` на бэкенде. |
| Старое поведение после правок | Не пересобран образ Docker / кэш сборки. |

---

## Скрипты npm

| Каталог | Команда | Действие |
|---------|---------|----------|
| `client` | `npm run dev` | Dev-сервер Vite |
| `client` | `npm run build` | Production-сборка |
| `server` | `npm run dev` | `ts-node-dev`, перезапуск при изменениях |
| `server` | `npm start` | `ts-node src/app.ts` |
# messenger-app
