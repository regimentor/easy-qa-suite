import { testCasesRepository } from "../repositories/test-cases.repository";
import { CreateTestCaseInput } from "../graphql/inputs/create-test-case.input";

export const testCaseService = {
  async findTestCases() {
    return testCasesRepository.findBy({});
  },

  async createTestCase(data: CreateTestCaseInput) {
    // Формируем данные для Prisma с учетом реляции project
    return testCasesRepository.create({
      title: data.title,
      description: data.description,
      preconditions: data.preconditions ?? null,
      postconditions: data.postconditions ?? null,
      priority: data.priority,
      status: data.status,
      project: { connect: { id: BigInt(data.projectId) } },
    });
  },
};
