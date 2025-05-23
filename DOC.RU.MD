# Обновлённый список функциональных требований

## 1. Организация тестирования

- Планирование и запуск тестов (ручных и автоматизированных)
- Объединение тестов в тест-планы (наборы тестов)


## 2. Управление тестовой документацией

- Хранение и версионирование описаний тест-кейсов (шагов, ожидаемых результатов)
- Группировка тест-кейсов в сьюты и повторное их использование

## 3. Отслеживание результатов тестирования

- Фиксация статусов прогонов (Passed/Failed/Skipped)
- Сохранение логов, скриншотов и информации о выявленных дефектах
- Сбор метрик: процент прохождения, количество неуспешных тестов и прочие

## 4. Отчётность и визуализация

- Информационные панели (дашборды) с ключевыми показателями
- Генерация отчётов и графиков: статус тестирования по проектам, прогресс спринта, динамика качества

## 5. Интеграции с внешними системами



- Фреймворки автотестирования (Selenium, JUnit, Cypress и др.) для импорта результатов

Ниже приведена схема базы данных в Markdown-формате.

## Схема базы данных

### Таблица projects (Проекты)

| Поле        | Тип          | Описание                          |
| ----------- | ------------ | --------------------------------- |
| id          | BIGINT PK    | Идентификатор проекта             |
| name        | VARCHAR(255) | Название проекта                  |
| key         | VARCHAR(50)  | Уникальный код проекта            |
| description | TEXT         | Описание проекта                  |
| created_at  | TIMESTAMP    | Дата и время создания             |
| updated_at  | TIMESTAMP    | Дата и время последнего изменения |

### Таблица test_cases (Тест-кейсы)

| Поле           | Тип          | Описание                                         |
| -------------- | ------------ | ------------------------------------------------ |
| id             | BIGINT PK    | Идентификатор тест-кейса                         |
| project_id     | BIGINT FK    | Ссылка на projects.id                            |
| title          | VARCHAR(255) | Краткое название тест-кейса                      |
| description    | TEXT         | Подробное описание шагов и ожидаемого результата |
| preconditions  | TEXT         | Предусловия (среда, данные и пр.)                |
| postconditions | TEXT         | Постусловия                                      |
| priority       | VARCHAR(50)  | Приоритет (Low/Medium/High)                      |
| status         | VARCHAR(50)  | Актуальность (Active/Deprecated)                 |
| created_at     | TIMESTAMP    | Дата создания                                    |
| updated_at     | TIMESTAMP    | Дата последнего изменения                        |

### Таблица test_suites (Сьюты)

| Поле        | Тип          | Описание                  |
| ----------- | ------------ | ------------------------- |
| id          | BIGINT PK    | Идентификатор сьюта       |
| project_id  | BIGINT FK    | Ссылка на projects.id     |
| name        | VARCHAR(255) | Название сьюта            |
| description | TEXT         | Описание                  |
| created_at  | TIMESTAMP    | Дата создания             |
| updated_at  | TIMESTAMP    | Дата последнего изменения |

### Таблица suite_test_cases (Связь «сьют ⇆ тест-кейс»)

| Поле         | Тип                      | Описание                        |
| ------------ | ------------------------ | ------------------------------- |
| suite_id     | BIGINT FK                | Ссылка на test_suites.id        |
| test_case_id | BIGINT FK                | Ссылка на test_cases.id         |
| order        | INT                      | Порядок запуска в составе сьюта |
| PK           | (suite_id, test_case_id) | Составной первичный ключ        |



### Таблица test_results (Результаты тестов)

| Поле           | Тип               | Описание                                  |
| -------------- | ----------------- | ----------------------------------------- |
| id             | BIGINT PK         | Идентификатор результата                  |
| test_case_id   | BIGINT FK         | Ссылка на test_cases.id                   |
| status         | VARCHAR(50)       | Статус выполнения (Passed/Failed/Skipped) |
| started_at     | TIMESTAMP         | Время начала выполнения тест-кейса        |
| finished_at    | TIMESTAMP         | Время окончания                           |
| log            | TEXT              | Текст лога                                |
| screenshot_url | TEXT NULL         | Ссылка на скриншот (если есть)            |
| defect_link    | VARCHAR(255) NULL | Ссылка на дополнительную информацию       |

### Таблица users (Пользователи)

| Поле          | Тип          | Описание                        |
| ------------- | ------------ | ------------------------------- |
| id            | BIGINT PK    | Идентификатор пользователя      |
| username      | VARCHAR(100) | Логин пользователя              |
| full_name     | VARCHAR(255) | Полное имя                      |
| email         | VARCHAR(255) | Адрес электронной почты         |
| password_hash | VARCHAR(255) | Хэш пароля или токен (если SSO) |
| created_at    | TIMESTAMP    | Дата создания                   |
| updated_at    | TIMESTAMP    | Дата последнего изменения       |





### Примечание

Для хранения больших объёмов логов и скриншотов рекомендуется использовать объектное хранилище (S3/MinIO) и сохранять в БД только ссылки.
