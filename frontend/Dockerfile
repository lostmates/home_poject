# Многоэтапная сборка для оптимизации размера образа

# Этап 1: Сборка приложения
FROM node:18-alpine AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json
COPY package.json ./

# Устанавливаем зависимости
RUN npm install --omit=dev

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Этап 2: Продакшн образ с nginx
FROM nginx:alpine

# Копируем собранное приложение
COPY --from=build /app/build /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]
