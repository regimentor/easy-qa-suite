import type { PrismaClient } from "@prisma/client";

export async function testCasesSeed(client: PrismaClient) {
  // Получаем проекты, чтобы использовать их id
  const projects = await client.project.findMany({ select: { id: true, key: true } });
  
  // Получаем приоритеты и статусы тест-кейсов для использования их id
  const priorities = await client.testCasePriority.findMany({ select: { id: true, value: true } });
  const statuses = await client.testCaseStatus.findMany({ select: { id: true, value: true } });

  // Пример тест-кейсов для разных проектов
  const testCases = [
    {
      projectKey: "EQA",
      title: "Авторизация пользователя",
      description: "Проверить успешную авторизацию с валидными данными.",
      preconditions: "Пользователь зарегистрирован в системе.",
      postconditions: "Пользователь авторизован.",
    },
    {
      projectKey: "MAT",
      title: "Установка мобильного приложения",
      description: "Проверить успешную установку приложения на Android.",
      preconditions: null,
      postconditions: "Приложение установлено.",
    },
    {
      projectKey: "WEB",
      title: "Проверка отображения главной страницы",
      description: "Главная страница должна корректно отображаться во всех поддерживаемых браузерах.",
      preconditions: null,
      postconditions: null,
    },
    {
      projectKey: "API",
      title: "Проверка ответа на GET /users",
      description: "API должен возвращать список пользователей.",
      preconditions: "В базе есть хотя бы один пользователь.",
      postconditions: null,
    },
    {
      projectKey: "REG",
      title: "Регрессионный тест: создание проекта",
      description: "Проверить, что создание нового проекта работает после последних изменений.",
      preconditions: null,
      postconditions: "Проект создан.",
    },
  ];

  // Маппим projectKey на project_id, а также выбираем случайный приоритет и статус
  const mappedData = testCases.map(tc => {
    // Находим проект по ключу
    const project = projects.find(p => p.key === tc.projectKey);
    if (!project) throw new Error(`Project with key ${tc.projectKey} not found`);
    
    // Проверяем, что массивы приоритетов и статусов не пусты
    if (priorities.length === 0) throw new Error("No priorities found in the database");
    if (statuses.length === 0) throw new Error("No statuses found in the database");
    
    // Выбираем случайный приоритет из списка доступных
    const randomPriorityIndex = Math.floor(Math.random() * priorities.length);
    const priorityRecord = priorities[randomPriorityIndex];
    
    // Выбираем случайный статус из списка доступных
    const randomStatusIndex = Math.floor(Math.random() * statuses.length);
    const statusRecord = statuses[randomStatusIndex];
    
    // Убеждаемся, что записи существуют
    if (!priorityRecord || !priorityRecord.id) {
      throw new Error(`Invalid priority record at index ${randomPriorityIndex}`);
    }
    
    if (!statusRecord || !statusRecord.id) {
      throw new Error(`Invalid status record at index ${randomStatusIndex}`);
    }
    
    return {
      title: tc.title,
      description: tc.description,
      preconditions: tc.preconditions,
      postconditions: tc.postconditions,
      project: { connect: { id: project.id } },
      priority: { connect: { id: priorityRecord.id } },
      status: { connect: { id: statusRecord.id } },
    };
  });

  // Создаём тест-кейсы по одному, используя connect для связей
  const createdTestCases = [];
  for (const item of mappedData) {
    const testCase = await client.testCase.create({
      data: item
    });
    createdTestCases.push(testCase);
  }

  return { count: createdTestCases.length };
}
