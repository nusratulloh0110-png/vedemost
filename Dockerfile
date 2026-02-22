# Используем современный образ Node.js
FROM node:18-alpine

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install --production

# Копируем все файлы проекта
COPY . .

# Открываем порт 80
EXPOSE 80

# Запускаем сервер
CMD ["node", "server.js"]
