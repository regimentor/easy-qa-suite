import type { PrismaClient } from "@prisma/client";

export async function testSuitesSeed(client: PrismaClient) {
  // Получаем проекты, чтобы использовать их id
  const projects = await client.project.findMany({ select: { id: true, key: true } });
  
  // Получаем типы тест-сьютов для использования их id
  const suiteTypes = await client.testSuiteType.findMany({ select: { id: true, value: true } });

  // Пример тест-сьютов для разных проектов
  const testSuites = [
    {
      projectKey: "EQA",
      name: "Smoke Suite",
      description: "Сьют для быстрой проверки основных функций системы.",
    },
    {
      projectKey: "EQA",
      name: "Regression Suite",
      description: "Регрессионные тесты для проверки стабильности после изменений.",
    },
    {
      projectKey: "MAT",
      name: "Install & Launch",
      description: "Проверка установки и запуска мобильного приложения.",
    },
    {
      projectKey: "WEB",
      name: "Cross-browser Suite",
      description: "Тесты для проверки отображения в разных браузерах.",
    },
    {
      projectKey: "API",
      name: "API Smoke",
      description: "Базовые проверки работоспособности API.",
    },
    {
      projectKey: "REG",
      name: "Full Regression",
      description: "Полный регрессионный прогон для всех продуктов.",
    },
  ];

  // Маппим projectKey на project и выбираем случайный тип, используя connect
  const mappedData = testSuites.map(suite => {
    // Находим проект по ключу
    const project = projects.find(p => p.key === suite.projectKey);
    if (!project) throw new Error(`Project with key ${suite.projectKey} not found`);
    
    // Проверяем, что массив типов сьютов не пуст
    if (suiteTypes.length === 0) throw new Error("No suite types found in the database");
    
    // Выбираем случайный тип сьюта из списка доступных
    const randomTypeIndex = Math.floor(Math.random() * suiteTypes.length);
    const suiteTypeRecord = suiteTypes[randomTypeIndex];
    
    // Убеждаемся, что запись существует
    if (!suiteTypeRecord || !suiteTypeRecord.id) {
      throw new Error(`Invalid suite type record at index ${randomTypeIndex}`);
    }
    
    return {
      name: suite.name,
      description: suite.description,
      project: { connect: { id: project.id } },
      type: { connect: { id: suiteTypeRecord.id } },
    };
  });

  // Создаём тест-сьюты по одному, используя connect для связей
  const createdSuites = [];
  for (const item of mappedData) {
    const suite = await client.testSuite.create({
      data: item
    });
    createdSuites.push(suite);
  }

  return { count: createdSuites.length };
}
