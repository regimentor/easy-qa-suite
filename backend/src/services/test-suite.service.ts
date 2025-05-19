import { testSuitesRepository } from "../repositories/test-suites.repository";
import { CreateTestSuiteInput } from "../graphql/inputs/create-test-suite.input";

export const testSuiteService = {
  async findTestSuites() {
    return testSuitesRepository.findBy({});
  },

  async createTestSuite(data: CreateTestSuiteInput) {
    return testSuitesRepository.create({
      name: data.name,
      description: data.description ?? null,
      type: data.type,
      project: { connect: { id: BigInt(data.projectId) } },
    });
  },
};
