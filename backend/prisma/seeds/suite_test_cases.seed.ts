import type { PrismaClient } from "@prisma/client";

export async function suiteTestCasesSeed(client: PrismaClient) {
  // Получаем все тест-сьюты и тест-кейсы
  const suites = await client.testSuite.findMany({ select: { id: true, name: true, project_id: true } });
  const testCases = await client.testCase.findMany({ select: { id: true, title: true, project_id: true } });

  // Примерная логика: для каждого сьюта добавим 2-3 тест-кейса из того же проекта
  const data: { suite_id: bigint, test_case_id: bigint, order: number }[] = [];

  for (const suite of suites) {
    // Найдём тест-кейсы, относящиеся к тому же проекту
    const relatedCases = testCases.filter(tc => tc.project_id === suite.project_id);
    // Возьмём первые 3 тест-кейса (или меньше, если их мало)
    const selectedCases = relatedCases.slice(0, 3);
    selectedCases.forEach((tc, idx) => {
      data.push({
        suite_id: suite.id,
        test_case_id: tc.id,
        order: idx + 1,
      });
    });
  }

  // Создаём связи батчем
  // Если сид запускается повторно, skipDuplicates предотвратит ошибку
  const result = await client.suiteTestCase.createMany({
    data,
    skipDuplicates: true,
  });

  return result;
}
