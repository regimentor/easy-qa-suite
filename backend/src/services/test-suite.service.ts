import { testSuitesRepository } from "../repositories/test-suites.repository";
import { suiteTestCasesRepository } from "../repositories/suite-test-cases.repository";
import { CreateTestSuiteInput } from "../graphql/inputs/create-test-suite.input";
import { AddTestCasesToSuiteInput } from "../graphql/inputs/add-test-cases-to-suite.input";
import { prismaClient } from "../prisma.client";
import { 
  TestSuiteNotFoundError,
  InvalidTestSuiteIdError,
  TestSuiteCasesUpdateError
} from "../errors/test-suite.errors";

export const testSuiteService = {
  async findTestSuites(projectId?: string | null) {
    const where: Record<string, any> = {};
    
    if (projectId) {
      where.project_id = BigInt(projectId);
    }
    
    return testSuitesRepository.findBy(where);
  },

  async findTestCasesBySuiteId(suiteId: string) {
    try {
      const id = BigInt(suiteId);
      const suiteTestCases = await suiteTestCasesRepository.findBy({
        suite_id: id
      });

      if (suiteTestCases.length === 0) {
        return [];
      }

      // Получаем тест-кейсы через prismaClient для включения полных данных
      const testCases = await prismaClient.testCase.findMany({
        where: {
          id: {
            in: suiteTestCases.map(stc => stc.test_case_id)
          }
        }
      });

      // Сортируем тест-кейсы в соответствии с порядком в сьюте
      const orderMap = new Map(
        suiteTestCases.map(stc => [stc.test_case_id.toString(), stc.order])
      );

      return testCases.sort((a, b) => {
        const orderA = orderMap.get(a.id.toString()) || 0;
        const orderB = orderMap.get(b.id.toString()) || 0;
        return orderA - orderB;
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new InvalidTestSuiteIdError(suiteId);
    }
  },

  async findTestSuiteById(id: string) {
    try {
      const suiteId = BigInt(id);
      const testSuite = await prismaClient.testSuite.findUnique({
        where: { id: suiteId },
        include: {
          suite_test_cases: {
            include: {
              test_case: true
            },
            orderBy: {
              order: 'asc'
            }
          }
        }
      });
      
      if (!testSuite) {
        throw new TestSuiteNotFoundError(id);
      }
      
      return testSuite;
    } catch (error) {
      if (error instanceof TestSuiteNotFoundError) {
        // Проброс существующей ошибки
        throw error;
      }
      // Если ошибка при конвертации id в BigInt
      throw new InvalidTestSuiteIdError(id);
    }
  },

  async createTestSuite(data: CreateTestSuiteInput) {
    return testSuitesRepository.create({
      name: data.name,
      description: data.description ?? null,
      type: data.type,
      project: { connect: { id: BigInt(data.projectId) } },
    });
  },

  async addTestCasesToSuite(data: AddTestCasesToSuiteInput) {
    try {
      const suiteId = BigInt(data.suiteId);
      
      // Проверяем существование тест-сьюта
      const testSuite = await prismaClient.testSuite.findUnique({
        where: { id: suiteId }
      });
      
      if (!testSuite) {
        throw new TestSuiteNotFoundError(data.suiteId);
      }
      
      // Получаем максимальный порядок тест-кейсов в сьюте, чтобы добавить новые в конец
      const existingTestCases = await suiteTestCasesRepository.findBy({
        suite_id: suiteId
      });
      
      let maxOrder = 0;
      if (existingTestCases.length > 0) {
        maxOrder = Math.max(...existingTestCases.map(tc => tc.order));
      }
      
      // Подготавливаем данные для создания связей
      const testCaseInputs = data.testCaseIds.map((testCaseId, index) => ({
        suite_id: suiteId,
        test_case_id: BigInt(testCaseId),
        order: maxOrder + index + 1
      }));
      
      // Создаём связи между сьютом и тест-кейсами
      await suiteTestCasesRepository.createMany(testCaseInputs);
      
      // Возвращаем обновлённый тест-сьют с тест-кейсами
      const result = await prismaClient.testSuite.findUnique({
        where: { id: suiteId },
        include: {
          suite_test_cases: {
            include: {
              test_case: true
            },
            orderBy: {
              order: 'asc'
            }
          }
        }
      });
      
      if (!result) {
        throw new TestSuiteCasesUpdateError(data.suiteId);
      }
      
      return result;
    } catch (error) {
      if (error instanceof TestSuiteNotFoundError || 
          error instanceof TestSuiteCasesUpdateError) {
        throw error;
      }
      throw new InvalidTestSuiteIdError(data.suiteId);
    }
  },
};
