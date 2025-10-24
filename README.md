# Home Project

Проект с разделением на backend и frontend для системы авторизации.

## Структура проекта

```
Home/
├── backend/                 # Серверная часть (FastAPI)
│   ├── src/
│   │   ├── models/         # Модели базы данных
│   │   ├── schemas/        # Pydantic схемы
│   │   ├── services/       # Бизнес-логика
│   │   └── routers/        # API роутеры
│   ├── alembic/           # Миграции базы данных
│   ├── main.py            # Точка входа FastAPI
│   ├── database.py        # Конфигурация БД
│   ├── config.py          # Настройки приложения
│   ├── requirements.txt   # Python зависимости
│   └── env.example        # Пример переменных окружения
└── frontend/              # Клиентская часть (React)
    ├── src/
    │   ├── components/    # React компоненты
    │   ├── App.js         # Главный компонент
    │   └── index.js       # Точка входа
    ├── public/            # Статические файлы
    ├── package.json       # Node.js зависимости
    └── env.local.example  # Пример переменных окружения
```

## Технологии

### Backend
- **FastAPI** - веб-фреймворк
- **SQLAlchemy** - ORM для работы с БД
- **AsyncPG** - асинхронный драйвер PostgreSQL
- **Alembic** - миграции базы данных
- **Pydantic** - валидация данных
- **JWT** - аутентификация

### Frontend
- **React** - библиотека для UI
- **Axios** - HTTP клиент
- **CSS3** - стилизация

## Установка и запуск

### Backend

1. Перейдите в папку backend:
```bash
cd backend
```

2. Создайте виртуальное окружение:
```bash
python -m venv venv
```

3. Активируйте виртуальное окружение:
```bash
# Windows
venv\Scripts\Activate.ps1

# Linux/Mac
source venv/bin/activate
```

4. Установите зависимости:
```bash
pip install -r requirements.txt
```

5. Создайте файл `.env` на основе `env.example` и настройте подключение к БД

6. Запустите миграции:
```bash
alembic upgrade head
```

7. Запустите сервер:
```bash
python main.py
```

### Frontend

1. Перейдите в папку frontend:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env.local` на основе `env.local.example`

4. Запустите приложение:
```bash
npm start
```

## API Endpoints

- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Авторизация пользователя
- `GET /api/auth/me` - Получение информации о текущем пользователе

## Функциональность

- Регистрация новых пользователей
- Авторизация существующих пользователей
- Валидация данных на клиенте и сервере
- Хеширование паролей
- JWT токены для аутентификации
- Адаптивный дизайн
