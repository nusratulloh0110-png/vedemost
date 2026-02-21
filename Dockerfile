# Используем легкий образ Nginx
FROM nginx:alpine

# Копируем файлы проекта в стандартную папку Nginx
COPY . /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
