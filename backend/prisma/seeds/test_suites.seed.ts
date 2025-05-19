import type { PrismaClient } from "@prisma/client";

export async function testSuitesSeed(client: PrismaClient) {
  // Получаем проекты, чтобы использовать их id
  const projects = await client.project.findMany({ select: { id: true, key: true } });

  // Пример тест-сьютов для разных проектов
  const testSuites = [
    {
      projectKey: "EQA",
      name: "Smoke Suite",
      description: "Сьют для быстрой проверки основных функций системы.",
      type: "Smoke",
    },
    {
      projectKey: "EQA",
      name: "Regression Suite",
      description: "Регрессионные тесты для проверки стабильности после изменений.",
      type: "Regression",
    },
    {
      projectKey: "MAT",
      name: "Install & Launch",
      description: "Проверка установки и запуска мобильного приложения.",
      type: "Functional",
    },
    {
      projectKey: "WEB",
      name: "Cross-browser Suite",
      description: "Тесты для проверки отображения в разных браузерах.",
      type: "Compatibility",
    },
    {
      projectKey: "API",
      name: "API Smoke",
      description: "Базовые проверки работоспособности API.",
      type: "Smoke",
    },
    {
      projectKey: "REG",
      name: "Full Regression",
      description: "Полный регрессионный прогон для всех продуктов.",
      type: "Regression",
    },
  ];

  // Маппим projectKey на project_id
  const data = testSuites.map(suite => {
    const project = projects.find(p => p.key === suite.projectKey);
    if (!project) throw new Error(`Project with key ${suite.projectKey} not found`);
    return {
      project_id: project.id,
      name: suite.name,
      description: suite.description,
      type: suite.type,
    };
  });

  // Создаём тест-сьюты батчем
  const result = await client.testSuite.createMany({
    data,
    skipDuplicates: true,
  });

  return result;
}
