# Cat Breeder Service

Тестовое задание — веб-сервис для заводчиков котов с чатом.

Сервис позволяет зарегистрироваться в качестве заводчика, управлять карточками своих котов (CRUD) и обмениваться сообщениями в реальном времени через WebSocket чат.

## Технологии

**Backend**
- Python 3.12, Django 6.0.5, Django REST Framework 3.17.1
- Django Channels 4.3.2 + Daphne 4.2.1 (ASGI)
- MySQL 8 (Основная база данных)
- Redis 7 (Channel Layer для WebSocket)
- Simple JWT 5.5.1 (Аутентификация по access/refresh токенам)
- WhiteNoise 6.12.0 (Раздача статики)

**Frontend**
- Angular 21.2.10
- Angular Material
- TypeScript

**Инфраструктура**
- Docker, Docker Compose
- Nginx (обратный прокси и раздача фронтенда)

## Структура проекта
```
cat-breeder/
├── backend/ # Django-приложение
│ ├── config/ # Настройки, asgi, urls
│ ├── cats/ # Модель Cat, API для котов, регистрация
│ ├── messaging/ # Модель Message, WebSocket consumer, middleware, API чата
│ ├── requirements.txt
│ ├── Dockerfile
│ └── entrypoint.sh
├── frontend/ # Angular-приложение
│ ├── src/
│ ├── angular.json
│ ├── nginx.conf # Конфигурация Nginx
│ └── Dockerfile
├── .env
├── docker-compose.yml
└── README.md
```

## Быстрый старт

### 1. Клонировать репозиторий

```bash
git clone <https://github.com/gabelchik/cat-breeder.git>
cd cat-breeder
```

Файл `.env` уже присутствует в репозитории и содержит **тестовые значения**, достаточные для немедленного запуска проекта.  

### 2. Запустить проект

```bash
docker compose up --build
```
После старта всех контейнеров:

Фронтенд: http://localhost

Админка Django: http://localhost/api/admin/ (Предварительно необходимо создать superuser)

### 3. Создать суперпользователя (опционально)
При запущенных контейнерах:
```bash
docker compose exec backend python manage.py createsuperuser
```

## Основные возможности

### Аутентификация
- Регистрация нового заводчика
- Вход с получением JWT (access + refresh)
- Все защищённые запросы автоматически добавляют `Authorization: Bearer <token>`
- WebSocket-соединение также аутентифицируется по JWT, переданному в query-параметре `?token=...`

### Коты
- Создание, просмотр, редактирование, удаление котов (Полный CRUD)
- Каждый заводчик видит и может изменять **только своих** котов
- Поля: имя, возраст, порода, длина шерсти (выбор из списка)

### Чат
- Выбор собеседника из списка заводчиков (исключая себя и суперпользователей)
- История переписки загружается через REST API
- Мгновенная доставка сообщений через WebSocket и Redis

## Безопасность

- **Access-токены для WebSocket**: при установке WebSocket-соединения JWT передаётся в query-параметре `?token=...`.
В production необходимо использовать **HTTPS** для шифрования URL
- **Только access-токены принимаются WebSocket**: refresh-токены не дадут подключиться.
- **Регистрация без аутентификации**: для эндпоинта `/api/register/` отключена проверка JWT (установлен `authentication_classes = []`).
Это гарантирует, что случайный или устаревший токен в браузере не приведёт к ошибке 401 при регистрации нового пользователя.
- **Разграничение прав**: каждый заводчик видит и может изменять только своих котов.