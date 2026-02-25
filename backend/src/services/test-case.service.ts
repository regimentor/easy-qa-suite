import type { Prisma } from "../generated/prisma/client";
import { testCasesRepository } from "../repositories/test-cases.repository";
import { testCasePrioritiesRepository } from "../repositories/test-case-priorities.repository";
import { testCaseStatusesRepository } from "../repositories/test-case-statuses.repository";
import { CreateTestCaseInput } from "../graphql/inputs/create-test-case.input";
import { TestCaseNotFoundError } from "../errors/test-case.errors";

export const testCaseService = {
  async findTestCases() {
    return testCasesRepository.findBy({});
  },

  async findTestCaseById(id: string) {
    const testCase = await testCasesRepository.findById(BigInt(id));
    if (!testCase) throw new TestCaseNotFoundError(id);
    return testCase;
  },

  async findTestCasesByProjectId(
    projectId: string,
    testSuiteId?: string | null
  ) {
    const where: Prisma.TestCaseWhereInput = {
      project_id: BigInt(projectId),
    };
    if (testSuiteId) {
      where.suite_test_cases = {
        some: { suite_id: BigInt(testSuiteId) },
      };
    }
    return testCasesRepository.findBy(where);
  },

  async createTestCase(data: CreateTestCaseInput) {
    const projectIdBigInt = BigInt(data.projectId);
    const priority = await testCasePrioritiesRepository.findById(BigInt(data.priorityId));
    const status = await testCaseStatusesRepository.findById(BigInt(data.statusId));
    if (!priority || priority.project_id !== projectIdBigInt) {
      throw new Error("Priority does not belong to this project");
    }
    if (!status || status.project_id !== projectIdBigInt) {
      throw new Error("Status does not belong to this project");
    }
    return testCasesRepository.create({
      title: data.title,
      description: data.description,
      preconditions: data.preconditions ?? null,
      postconditions: data.postconditions ?? null,
      priority: { connect: { id: BigInt(data.priorityId) } },
      status: { connect: { id: BigInt(data.statusId) } },
      project: { connect: { id: projectIdBigInt } },
    });
  },
};
