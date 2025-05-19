import type { PrismaClient } from "@prisma/client";

export async function testCasesSeed(client: PrismaClient) {
  // Получаем проекты, чтобы использовать их id
  const projects = await client.project.findMany({ select: { id: true, key: true } });

  // Пример тест-кейсов для разных проектов
  const testCases = [
    {
      projectKey: "EQA",
      title: "Авторизация пользователя",
      description: "Проверить успешную авторизацию с валидными данными.",
      preconditions: "Пользователь зарегистрирован в системе.",
      postconditions: "Пользователь авторизован.",
      priority: "High",
      status: "Active",
    },
    {
      projectKey: "MAT",
      title: "Установка мобильного приложения",
      description: "Проверить успешную установку приложения на Android.",
      preconditions: null,
      postconditions: "Приложение установлено.",
      priority: "Medium",
      status: "Active",
    },
    {
      projectKey: "WEB",
      title: "Проверка отображения главной страницы",
      description: "Главная страница должна корректно отображаться во всех поддерживаемых браузерах.",
      preconditions: null,
      postconditions: null,
      priority: "Low",
      status: "Active",
    },
    {
      projectKey: "API",
      title: "Проверка ответа на GET /users",
      description: "API должен возвращать список пользователей.",
      preconditions: "В базе есть хотя бы один пользователь.",
      postconditions: null,
      priority: "High",
      status: "Active",
    },
    {
      projectKey: "REG",
      title: "Регрессионный тест: создание проекта",
      description: "Проверить, что создание нового проекта работает после последних изменений.",
      preconditions: null,
      postconditions: "Проект создан.",
      priority: "Critical",
      status: "Active",
    },
  ];

  // Маппим projectKey на project_id
  const data = testCases.map(tc => {
    const project = projects.find(p => p.key === tc.projectKey);
    if (!project) throw new Error(`Project with key ${tc.projectKey} not found`);
    return {
      project_id: project.id,
      title: tc.title,
      description: tc.description,
      preconditions: tc.preconditions,
      postconditions: tc.postconditions,
      priority: tc.priority,
      status: tc.status,
    };
  });

  // Создаём тест-кейсы батчем
  const result = await client.testCase.createMany({
    data,
    skipDuplicates: true,
  });

  return result;
}
