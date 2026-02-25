import type { PrismaClient } from "../../src/generated/prisma/client";

export async function testCasesSeed(client: PrismaClient) {
  // Получаем проекты, приоритеты и статусы (привязанные к проектам)
  const projects = await client.project.findMany({ select: { id: true, key: true } });
  const priorities = await client.testCasePriority.findMany({ select: { id: true, value: true, project_id: true } });
  const statuses = await client.testCaseStatus.findMany({ select: { id: true, value: true, project_id: true } });

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

  // Маппим projectKey на project_id, приоритет и статус только этого проекта
  const mappedData = testCases.map(tc => {
    const project = projects.find(p => p.key === tc.projectKey);
    if (!project) throw new Error(`Project with key ${tc.projectKey} not found`);

    const projectPriorities = priorities.filter(pr => pr.project_id === project.id);
    const projectStatuses = statuses.filter(st => st.project_id === project.id);
    if (projectPriorities.length === 0) throw new Error(`No priorities for project ${tc.projectKey}`);
    if (projectStatuses.length === 0) throw new Error(`No statuses for project ${tc.projectKey}`);

    const priorityRecord = projectPriorities[Math.floor(Math.random() * projectPriorities.length)]!;
    const statusRecord = projectStatuses[Math.floor(Math.random() * projectStatuses.length)]!;

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
