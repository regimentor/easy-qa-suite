import type { PrismaClient } from "../../src/generated/prisma/client";

/** Шаблоны тест-кейсов с осмысленными названиями (не привязаны к сьютам) */
const TEST_CASE_TEMPLATES: Array<{
  title: string;
  description: string;
  preconditions: string | null;
  postconditions: string | null;
}> = [
  { title: "Вход с валидным логином и паролем", description: "Проверить успешную авторизацию при корректных учётных данных.", preconditions: "Пользователь зарегистрирован.", postconditions: "Открыта главная страница." },
  { title: "Вход с неверным паролем", description: "Система должна отклонить вход и показать сообщение об ошибке.", preconditions: null, postconditions: "Сообщение «Неверный пароль»." },
  { title: "Вход с пустым полем логина", description: "Проверка валидации: кнопка «Войти» неактивна или показывается ошибка.", preconditions: null, postconditions: null },
  { title: "Восстановление пароля по email", description: "Пользователь вводит email и получает ссылку для сброса пароля.", preconditions: "Email существует в системе.", postconditions: "Письмо отправлено." },
  { title: "Регистрация нового пользователя", description: "Успешное создание учётной записи с обязательными полями.", preconditions: null, postconditions: "Пользователь залогинен." },
  { title: "Регистрация с дублирующим email", description: "Система не должна создавать учётную запись и показывает ошибку.", preconditions: "Email уже занят.", postconditions: null },
  { title: "Валидация поля «Email» при регистрации", description: "Проверка формата email: невалидные значения отклоняются.", preconditions: null, postconditions: null },
  { title: "Выход из учётной записи", description: "После выхода пользователь перенаправлен на страницу входа.", preconditions: "Пользователь авторизован.", postconditions: "Сессия завершена." },
  { title: "Отображение списка на мобильном разрешении", description: "Список корректно отображается и прокручивается на экране 375px.", preconditions: null, postconditions: null },
  { title: "Кнопка «Сохранить» доступна по Tab", description: "Фокус по Tab доходит до кнопки и активирует её по Enter.", preconditions: null, postconditions: null },
  { title: "Отправка формы с обязательными полями", description: "Форма отправляется только при заполнении всех обязательных полей.", preconditions: null, postconditions: "Данные сохранены." },
  { title: "Отмена редактирования без сохранения", description: "При отмене изменения не сохраняются, показывается подтверждение.", preconditions: "Форма открыта с данными.", postconditions: null },
  { title: "Поиск по названию возвращает релевантные результаты", description: "Ввод подстроки в поиск фильтрует список по названию.", preconditions: "В списке есть элементы.", postconditions: null },
  { title: "Пустой поиск показывает все элементы", description: "Очистка поля поиска восстанавливает полный список.", preconditions: null, postconditions: null },
  { title: "Сортировка по дате создания (по убыванию)", description: "Элементы отображаются от новых к старым.", preconditions: null, postconditions: null },
  { title: "Сортировка по названию (по возрастанию)", description: "Элементы отображаются в алфавитном порядке.", preconditions: null, postconditions: null },
  { title: "Пагинация: переход на вторую страницу", description: "Клик по «Следующая» загружает следующую порцию записей.", preconditions: "Записей больше размера страницы.", postconditions: null },
  { title: "Пагинация: выбор размера страницы 50", description: "На одной странице отображается не более 50 записей.", preconditions: null, postconditions: null },
  { title: "Удаление элемента с подтверждением", description: "При удалении показывается диалог подтверждения.", preconditions: null, postconditions: "Элемент удалён из списка." },
  { title: "Отмена удаления в диалоге", description: "Кнопка «Отмена» в диалоге удаления закрывает диалог без удаления.", preconditions: null, postconditions: null },
  { title: "GET /api/items возвращает 200 и JSON", description: "Эндпоинт возвращает статус 200 и массив в теле ответа.", preconditions: "API доступен.", postconditions: null },
  { title: "GET при отсутствии ресурса возвращает 404", description: "Запрос к несуществующему id возвращает 404.", preconditions: null, postconditions: null },
  { title: "POST создаёт ресурс и возвращает 201", description: "Успешное создание возвращает 201 и тело созданного ресурса.", preconditions: null, postconditions: null },
  { title: "POST с невалидным телом возвращает 400", description: "Отсутствующие обязательные поля приводят к 400 и описанию ошибок.", preconditions: null, postconditions: null },
  { title: "PUT обновляет существующий ресурс", description: "Повторный запрос возвращает обновлённые данные.", preconditions: "Ресурс создан.", postconditions: null },
  { title: "DELETE удаляет ресурс и возвращает 204", description: "После удаления GET по id возвращает 404.", preconditions: "Ресурс создан.", postconditions: null },
  { title: "Запрос без токена возвращает 401", description: "Защищённый эндпоинт без Authorization возвращает 401.", preconditions: null, postconditions: null },
  { title: "Запрос с невалидным токеном возвращает 401", description: "Истёкший или поддельный токен приводит к 401.", preconditions: null, postconditions: null },
  { title: "Кросс-браузер: Chrome", description: "Основные сценарии проходят в последней версии Chrome.", preconditions: null, postconditions: null },
  { title: "Кросс-браузер: Firefox", description: "Основные сценарии проходят в последней версии Firefox.", preconditions: null, postconditions: null },
  { title: "Кросс-браузер: Safari", description: "Основные сценарии проходят в последней версии Safari.", preconditions: null, postconditions: null },
  { title: "Кросс-браузер: Edge", description: "Основные сценарии проходят в последней версии Edge.", preconditions: null, postconditions: null },
  { title: "Отображение уведомления об успешном сохранении", description: "После сохранения показывается toast или баннер об успехе.", preconditions: null, postconditions: null },
  { title: "Отображение ошибки при падении API", description: "При 500 показывается понятное сообщение пользователю.", preconditions: null, postconditions: null },
  { title: "Повторная отправка формы не создаёт дубликат", description: "Двойной клик по «Отправить» не создаёт две записи.", preconditions: null, postconditions: null },
  { title: "Длинное название обрезается с многоточием", description: "В списке длинные названия обрезаются и есть tooltip.", preconditions: null, postconditions: null },
  { title: "Фильтр по статусу «Активный»", description: "В списке отображаются только элементы со статусом «Активный».", preconditions: null, postconditions: null },
  { title: "Фильтр по статусу «Черновик»", description: "В списке отображаются только черновики.", preconditions: null, postconditions: null },
  { title: "Фильтр по приоритету «Высокий»", description: "Отображаются только элементы с высоким приоритетом.", preconditions: null, postconditions: null },
  { title: "Сброс фильтров восстанавливает полный список", description: "Кнопка «Сбросить» очищает фильтры и показывает все записи.", preconditions: null, postconditions: null },
  { title: "Экспорт списка в CSV", description: "Скачивается файл CSV с текущим набором данных (с учётом фильтров).", preconditions: "В списке есть данные.", postconditions: null },
  { title: "Модальное окно закрывается по клику на overlay", description: "Клик вне модального окна закрывает его без сохранения.", preconditions: "Модальное окно открыто.", postconditions: null },
  { title: "Модальное окно закрывается по Escape", description: "Клавиша Escape закрывает модальное окно.", preconditions: "Модальное окно открыто.", postconditions: null },
  { title: "Загрузка файла до 5 МБ", description: "Файл в допустимом размере успешно загружается.", preconditions: null, postconditions: "Файл отображается в списке." },
  { title: "Загрузка файла более 5 МБ отклоняется", description: "Показывается сообщение о превышении размера.", preconditions: null, postconditions: null },
  { title: "Допустимые форматы файла: PDF, PNG, JPG", description: "Только указанные форматы принимаются; остальные — ошибка.", preconditions: null, postconditions: null },
  { title: "Копирование ссылки в буфер обмена", description: "Кнопка «Копировать ссылку» копирует URL в буфер и показывает уведомление.", preconditions: null, postconditions: null },
  { title: "Обновление данных без перезагрузки страницы", description: "После мутации список обновляется через refetch без полной перезагрузки.", preconditions: null, postconditions: null },
  { title: "Офлайн: показ закэшированных данных", description: "При отсутствии сети отображаются последние закэшированные данные.", preconditions: null, postconditions: null },
  { title: "Офлайн: сообщение при невозможности действия", description: "При попытке действия без сети показывается сообщение «Нет соединения».", preconditions: null, postconditions: null },
  { title: "Тёмная тема переключается без перезагрузки", description: "Переключатель темы меняет оформление сразу.", preconditions: null, postconditions: null },
  { title: "Локализация: переключение на английский", description: "Все тексты интерфейса переключаются на выбранный язык.", preconditions: null, postconditions: null },
  { title: "Локализация: переключение на русский", description: "Все тексты интерфейса отображаются на русском.", preconditions: null, postconditions: null },
  { title: "Формат даты соответствует локали", description: "Даты отображаются в формате выбранной локали.", preconditions: null, postconditions: null },
  { title: "Массовое выделение через «Выбрать все»", description: "Чекбокс «Выбрать все» выделяет все элементы на текущей странице.", preconditions: null, postconditions: null },
  { title: "Массовое действие «Удалить выбранные»", description: "Удаляются только выбранные элементы, показывается подтверждение.", preconditions: "Выбрано хотя бы один элемент.", postconditions: null },
  { title: "Снятие выделения при смене страницы", description: "При переходе на другую страницу выделение сбрасывается.", preconditions: null, postconditions: null },
  { title: "Хлебные крошки ведут на корректные разделы", description: "Клик по каждому элементу хлебных крошек ведёт на нужный URL.", preconditions: null, postconditions: null },
  { title: "Сохранение черновика без публикации", description: "Черновик сохраняется со статусом «Черновик», не публикуется.", preconditions: null, postconditions: null },
  { title: "Публикация черновика меняет статус", description: "После публикации статус меняется, элемент виден в основном списке.", preconditions: "Есть черновик.", postconditions: null },
  { title: "Архивация элемента скрывает из основного списка", description: "Архивные элементы отображаются только в разделе «Архив».", preconditions: null, postconditions: null },
  { title: "Восстановление из архива", description: "Элемент возвращается в основной список со прежним статусом.", preconditions: "Элемент в архиве.", postconditions: null },
  { title: "Валидация минимальной длины пароля", description: "Пароль короче 8 символов не принимается.", preconditions: null, postconditions: null },
  { title: "Валидация обязательности пароля при смене", description: "При смене пароля оба поля (новый и подтверждение) обязательны.", preconditions: null, postconditions: null },
  { title: "Несовпадение пароля и подтверждения", description: "При несовпадении показывается ошибка под полем.", preconditions: null, postconditions: null },
  { title: "Таймаут сессии после 30 минут неактивности", description: "После 30 минут без действий пользователь разлогинивается.", preconditions: null, postconditions: null },
  { title: "Продление сессии при активности", description: "Действия пользователя сбрасывают таймер таймаута.", preconditions: null, postconditions: null },
  { title: "Отображение аватара пользователя в шапке", description: "Если аватар задан, он отображается в правом верхнем углу.", preconditions: null, postconditions: null },
  { title: "Загрузка и смена аватара", description: "В настройках профиля можно загрузить изображение и оно отображается.", preconditions: null, postconditions: null },
  { title: "Уведомления отображаются в колокольчике", description: "Новые уведомления увеличивают счётчик и видны в выпадающем списке.", preconditions: null, postconditions: null },
  { title: "Отметка уведомлений как прочитанных", description: "Клик по уведомлению помечает его прочитанным, счётчик обновляется.", preconditions: null, postconditions: null },
  { title: "Подстановка плейсхолдеров в шаблон", description: "В шаблоне письма подставляются имя и другие поля пользователя.", preconditions: null, postconditions: null },
  { title: "Отправка тестового письма", description: "Кнопка «Отправить тест» отправляет письмо на указанный email.", preconditions: null, postconditions: null },
  { title: "Логирование ошибок на сервере", description: "При 500 ошибка пишется в лог с контекстом запроса.", preconditions: null, postconditions: null },
  { title: "Санитизация HTML в пользовательском вводе", description: "Введённый HTML экранируется и не выполняется как скрипт.", preconditions: null, postconditions: null },
  { title: "Ограничение частоты запросов (rate limit)", description: "При превышении лимита возвращается 429 и Retry-After.", preconditions: null, postconditions: null },
  { title: "Корректная работа при включённых блокировщиках рекламы", description: "Критичный функционал не ломается при блокировке скриптов.", preconditions: null, postconditions: null },
  { title: "Доступность: фокус не теряется в модальном окне", description: "Tab зацикливает фокус внутри модального окна.", preconditions: "Модальное окно открыто.", postconditions: null },
  { title: "Доступность: озвучивание заголовка страницы", description: "Screen reader объявляет заголовок страницы при переходе.", preconditions: null, postconditions: null },
  { title: "Отображение скелетона при загрузке списка", description: "Пока данные грузятся, показываются плейсхолдеры-скелетоны.", preconditions: null, postconditions: null },
  { title: "Повторная попытка после сетевой ошибки", description: "Кнопка «Повторить» повторяет последний запрос.", preconditions: "Предыдущий запрос завершился ошибкой.", postconditions: null },
  { title: "Бесконечный скролл подгружает следующую порцию", description: "При достижении низа списка подгружаются следующие элементы.", preconditions: "Включён режим бесконечного скролла.", postconditions: null },
  { title: "Вложенный список раскрывается по клику", description: "Клик по строке раскрывает дочерние элементы.", preconditions: "Есть дочерние элементы.", postconditions: null },
  { title: "Перетаскивание меняет порядок элементов", description: "Drag-and-drop меняет порядок и сохраняет его на сервере.", preconditions: null, postconditions: null },
  { title: "Валидация числового поля: только целые", description: "В поле принимаются только целые числа, дробные отклоняются.", preconditions: null, postconditions: null },
  { title: "Валидация числового поля: диапазон 1–100", description: "Значения вне диапазона не принимаются, показывается ошибка.", preconditions: null, postconditions: null },
  { title: "Автосохранение черновика каждые 30 секунд", description: "При изменении полей данные сохраняются в черновик раз в 30 сек.", preconditions: null, postconditions: null },
  { title: "Индикатор «Несохранённые изменения»", description: "При наличии несохранённых изменений показывается предупреждение при уходе.", preconditions: null, postconditions: null },
  { title: "Подсказка (tooltip) при наведении на иконку", description: "Наведение на иконку показывает текст подсказки.", preconditions: null, postconditions: null },
  { title: "Контекстное меню по правому клику", description: "Правый клик по элементу открывает контекстное меню с действиями.", preconditions: null, postconditions: null },
  { title: "Горячая клавиша Ctrl+S сохраняет форму", description: "Нажатие Ctrl+S сохраняет текущую форму без перезагрузки.", preconditions: "Форма открыта.", postconditions: null },
  { title: "История изменений отображает последние 10 записей", description: "В блоке «История» видны последние 10 изменений с датой и автором.", preconditions: null, postconditions: null },
  { title: "Сравнение двух версий элемента", description: "Выбор двух версий показывает diff изменений.", preconditions: "Есть минимум две версии.", postconditions: null },
  { title: "Откат к предыдущей версии", description: "Кнопка «Откатить» восстанавливает выбранную версию.", preconditions: null, postconditions: null },
  { title: "Установка приложения на Android 14", description: "Проверить установку из магазина на устройстве с Android 14.", preconditions: null, postconditions: "Приложение установлено." },
  { title: "Установка приложения на iOS 17", description: "Проверить установку из App Store на устройстве с iOS 17.", preconditions: null, postconditions: null },
  { title: "Первый запуск: экран онбординга", description: "При первом запуске показывается онбординг, затем главный экран.", preconditions: "Приложение установлено впервые.", postconditions: null },
  { title: "Push-уведомление отображается при закрытом приложении", description: "Уведомление приходит и отображается в шторке.", preconditions: "Разрешены уведомления.", postconditions: null },
  { title: "Работа приложения в фоне (минимальное потребление)", description: "Приложение в фоне не потребляет более N% батареи за час.", preconditions: null, postconditions: null },
  { title: "Корректное отображение на планшете", description: "Интерфейс адаптирован под большой экран, нет обрезания.", preconditions: null, postconditions: null },
  { title: "Поворот экрана перестраивает layout", description: "При повороте устройства layout перестраивается без потери данных.", preconditions: null, postconditions: null },
  { title: "Глубокий переход по ссылке (deep link)", description: "Открытие ссылки app://item/123 открывает экран элемента с id 123.", preconditions: null, postconditions: null },
  { title: "Очистка кэша приложения освобождает место", description: "В настройках кэш очищается и занимаемый объём уменьшается.", preconditions: null, postconditions: null },
  { title: "Регрессия: главное меню открывается по иконке", description: "Клик по иконке меню открывает боковую панель.", preconditions: null, postconditions: null },
  { title: "Регрессия: корзина отображает количество", description: "Иконка корзины показывает актуальное количество элементов.", preconditions: null, postconditions: null },
  { title: "Регрессия: итоговая сумма пересчитывается при изменении", description: "Изменение количества или удаление позиции пересчитывает сумму.", preconditions: null, postconditions: null },
  { title: "Регрессия: скидка применяется к итогу", description: "Введённый промокод корректно уменьшает итоговую сумму.", preconditions: "Промокод валиден.", postconditions: null },
  { title: "Регрессия: гость может оформить заказ", description: "Без регистрации можно заполнить форму и отправить заказ.", preconditions: null, postconditions: null },
  { title: "Регрессия: залогиненный пользователь видит историю заказов", description: "В личном кабинете отображается список заказов пользователя.", preconditions: "Пользователь авторизован.", postconditions: null },
  { title: "Нагрузочный сценарий: 100 одновременных пользователей", description: "Система выдерживает 100 одновременных пользователей без деградации.", preconditions: null, postconditions: null },
  { title: "Нагрузочный сценарий: пиковая нагрузка на API", description: "При 1000 RPS время ответа не превышает 500 ms (p95).", preconditions: null, postconditions: null },
  { title: "Миграция данных: целостность после переноса", description: "После миграции количество записей и ключевые поля совпадают.", preconditions: null, postconditions: null },
  { title: "Резервное копирование и восстановление", description: "Восстановление из бэка возвращает данные на момент бэка.", preconditions: "Есть актуальный бэкап.", postconditions: null },
  { title: "Логирование действий пользователя (audit log)", description: "Критичные действия пишутся в audit log с user_id и timestamp.", preconditions: null, postconditions: null },
  { title: "Роли: только админ видит раздел «Настройки»", description: "Пользователь с ролью User не видит пункт «Настройки».", preconditions: null, postconditions: null },
  { title: "Роли: редактор может редактировать, но не удалять", description: "Роль Editor даёт право редактирования, кнопка удаления скрыта.", preconditions: null, postconditions: null },
  { title: "Интеграция с SSO: вход через корпоративный IdP", description: "Кнопка «Войти через SSO» перенаправляет на IdP и после входа возвращает в приложение.", preconditions: "Настроен SSO.", postconditions: null },
  { title: "Интеграция webhook: отправка события при создании", description: "При создании ресурса на настроенный URL уходит POST с телом события.", preconditions: "Webhook настроен.", postconditions: null },
  { title: "Интеграция: импорт из CSV", description: "Загрузка CSV создаёт записи согласно колонкам; ошибки выводятся в отчёт.", preconditions: null, postconditions: null },
  { title: "Интеграция: экспорт в Excel", description: "Скачивается xlsx с листами и форматированием согласно шаблону.", preconditions: null, postconditions: null },
];

const BULK_COUNT_PER_PROJECT = 100;

export async function testCasesBulkSeed(client: PrismaClient) {
  const projects = await client.project.findMany({ select: { id: true, key: true } });
  const priorities = await client.testCasePriority.findMany({ select: { id: true } });
  const statuses = await client.testCaseStatus.findMany({ select: { id: true } });

  if (priorities.length === 0) throw new Error("No priorities found");
  if (statuses.length === 0) throw new Error("No statuses found");

  let totalCreated = 0;

  for (const project of projects) {
    for (let i = 0; i < BULK_COUNT_PER_PROJECT; i++) {
      const template = TEST_CASE_TEMPLATES[i % TEST_CASE_TEMPLATES.length]!;
      const priority = priorities[i % priorities.length]!;
      const status = statuses[i % statuses.length]!;

      await client.testCase.create({
        data: {
          title: template.title,
          description: template.description,
          preconditions: template.preconditions,
          postconditions: template.postconditions,
          project: { connect: { id: project.id } },
          priority: { connect: { id: priority.id } },
          status: { connect: { id: status.id } },
        },
      });
      totalCreated++;
    }
  }

  return { count: totalCreated };
}
