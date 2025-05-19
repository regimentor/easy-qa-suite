import { testCasesRepository } from "../repositories/test-cases.repository";
import { CreateTestCaseInput } from "../graphql/inputs/create-test-case.input";

export const testCaseService = {
  async findTestCases() {
    return testCasesRepository.findBy({});
  },

  async findTestCasesByProjectId(projectId: string) {
    return testCasesRepository.findBy({
      project_id: BigInt(projectId)
    });
  },

  async createTestCase(data: CreateTestCaseInput) {
    // Формируем данные для Prisma с учетом реляций project, priority и status по ID
    return testCasesRepository.create({
      title: data.title,
      description: data.description,
      preconditions: data.preconditions ?? null,
      postconditions: data.postconditions ?? null,
      priority: { connect: { id: BigInt(data.priorityId) } },
      status: { connect: { id: BigInt(data.statusId) } },
      project: { connect: { id: BigInt(data.projectId) } },
    });
  },
};
