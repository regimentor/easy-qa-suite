import type { PrismaClient } from "@prisma/client";

export async function testResultsSeed(client: PrismaClient) {
  // Получаем все тест-кейсы
  const testCases = await client.testCase.findMany({ select: { id: true, title: true } });

  // Примерные статусы и логи
  const statuses = ["Passed", "Failed", "Blocked", "Skipped"];
  const logs = [
    "Тест успешно выполнен. Все шаги прошли корректно.",
    "Ошибка на шаге 2: неверный ответ сервера.",
    "Тест заблокирован из-за недоступности окружения.",
    "Тест пропущен по причине изменений в требованиях."
  ];

  // Для первых 5 тест-кейсов создадим по 2 результата с разными статусами
  const data: any[] = [];
  const now = new Date();

  testCases.slice(0, 5).forEach((tc, idx) => {
    // Первый результат — Passed
    data.push({
      test_case_id: tc.id,
      status: "Passed",
      started_at: new Date(now.getTime() - 1000 * 60 * (idx + 10)),
      finished_at: new Date(now.getTime() - 1000 * 60 * (idx + 9)),
      log: logs[0],
      screenshot_url: null,
      defect_link: null,
    });
    // Второй результат — случайный статус (кроме Passed)
    const statusIdx = 1 + (idx % (statuses.length - 1));
    data.push({
      test_case_id: tc.id,
      status: statuses[statusIdx],
      started_at: new Date(now.getTime() - 1000 * 60 * (idx + 5)),
      finished_at: new Date(now.getTime() - 1000 * 60 * (idx + 4)),
      log: logs[statusIdx],
      screenshot_url: statusIdx === 1 ? "https://example.com/screenshot1.png" : null,
      defect_link: statusIdx === 1 ? "https://tracker.example.com/defect/123" : null,
    });
  });

  // Создаём результаты батчем
  const result = await client.testResult.createMany({
    data,
    skipDuplicates: true,
  });

  return result;
}
