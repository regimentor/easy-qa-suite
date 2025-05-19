import type { PrismaClient } from "@prisma/client";

export async function projectsSeed(client: PrismaClient) {
  // Пример данных для проектов
  const projects = [
    {
      name: "EasyQA Core",
      key: "EQA",
      description:
        "Основной проект для управления тест-кейсами и тест-сьютами.",
    },
    {
      name: "Mobile App Testing",
      key: "MAT",
      description: "Проект для тестирования мобильных приложений.",
    },
    {
      name: "Web Platform",
      key: "WEB",
      description: "Тестирование веб-платформы компании.",
    },
    {
      name: "API Automation",
      key: "API",
      description: "Автоматизация тестирования API.",
    },
    {
      name: "Regression Suite",
      key: "REG",
      description: "Регрессионное тестирование для всех продуктов.",
    },
  ];

  // Создание проектов батчем
  const result = await client.project.createMany({
    data: projects,
    skipDuplicates: true,
  });

  return result;
}
