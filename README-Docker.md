# Docker Setup для Home Project

Этот документ описывает, как запустить проект с помощью Docker.

## Структура Docker файлов

```
Home/
├── docker-compose.yml          # Основной compose файл для продакшн
├── docker-compose.dev.yml      # Compose файл для разработки
├── init-db.sql                 # Инициализация базы данных
├── .dockerignore               # Игнорируемые файлы для Docker
├── backend/
│   ├── Dockerfile              # Docker образ для backend
│   └── .dockerignore           # Игнорируемые файлы для backend
└── frontend/
    ├── Dockerfile              # Docker образ для frontend
    ├── nginx.conf              # Конфигурация nginx
    └── .dockerignore           # Игнорируемые файлы для frontend
```

## Запуск приложения

### Полный запуск (продакшн)

```bash
# Сборка и запуск всех сервисов
docker-compose up --build

# Запуск в фоновом режиме
docker-compose up -d --build
```

### Запуск только backend для разработки

```bash
# Запуск только базы данных и backend
docker-compose -f docker-compose.dev.yml up --build

# Запуск в фоновом режиме
docker-compose -f docker-compose.dev.yml up -d --build
```

## Доступ к приложению

После запуска приложение будет доступно по адресам:

- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:8000
- **PostgreSQL**: localhost:5432

## Полезные команды

### Просмотр логов
```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Остановка сервисов
```bash
# Остановка всех сервисов
docker-compose down

# Остановка с удалением volumes (ВНИМАНИЕ: удалит данные БД!)
docker-compose down -v
```

### Пересборка образов
```bash
# Пересборка всех образов
docker-compose build --no-cache

# Пересборка конкретного сервиса
docker-compose build --no-cache backend
```

### Выполнение команд в контейнерах
```bash
# Подключение к backend контейнеру
docker-compose exec backend bash

# Выполнение миграций
docker-compose exec backend alembic upgrade head

# Создание новой миграции
docker-compose exec backend alembic revision --autogenerate -m "migration_name"
```

## Переменные окружения

### Backend
- `DATABASE_URL` - URL подключения к PostgreSQL
- `SECRET_KEY` - Секретный ключ для JWT
- `ALGORITHM` - Алгоритм шифрования JWT
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Время жизни токена
- `ALLOWED_ORIGINS` - Разрешенные CORS origins

### Frontend
- `REACT_APP_API_URL` - URL API для фронтенда
- `REACT_APP_API_BASE_URL` - Базовый URL API

## База данных

PostgreSQL запускается в отдельном контейнере с:
- **База данных**: `home_db`
- **Пользователь**: `postgres`
- **Пароль**: `root`
- **Порт**: `5432`

Данные сохраняются в Docker volume `postgres_data`.

## Nginx конфигурация

Frontend использует nginx для:
- Раздачи статических файлов React
- Проксирования API запросов к backend
- SPA роутинга (все запросы перенаправляются на index.html)

## Разработка

Для разработки рекомендуется:

1. Запустить только базу данных и backend через `docker-compose.dev.yml`
2. Запустить frontend локально через `npm start`
3. Это позволит использовать hot reload для frontend

```bash
# Терминал 1: Запуск backend и БД
docker-compose -f docker-compose.dev.yml up

# Терминал 2: Запуск frontend локально
cd frontend
npm start
```

## Troubleshooting

### Проблемы с подключением к БД
```bash
# Проверка статуса БД
docker-compose exec db pg_isready -U postgres

# Подключение к БД
docker-compose exec db psql -U postgres -d home_db
```

### Проблемы с миграциями
```bash
# Принудительное выполнение миграций
docker-compose exec backend alembic upgrade head

# Создание новой миграции
docker-compose exec backend alembic revision --autogenerate -m "fix_migration"
```

### Очистка Docker
```bash
# Удаление всех контейнеров и образов проекта
docker-compose down --rmi all --volumes --remove-orphans

# Полная очистка Docker (ВНИМАНИЕ: удалит все!)
docker system prune -a --volumes
```
