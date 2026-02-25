import { testCaseStatusesRepository } from "../repositories/test-case-statuses.repository";
import { TestCaseStatusNotFound } from "../errors/test-case-status.errors";

export const testCaseStatusService = {
  async findAllByProjectId(projectId: string, includeArchived: boolean = false) {
    return testCaseStatusesRepository.findByProjectId(BigInt(projectId), includeArchived);
  },

  async findById(id: string) {
    const status = await testCaseStatusesRepository.findById(BigInt(id));
    if (!status) {
      throw new TestCaseStatusNotFound(id);
    }
    return status;
  },

  async findByProjectIdAndValue(projectId: string, value: string) {
    const status = await testCaseStatusesRepository.findByProjectIdAndValue(
      BigInt(projectId),
      value
    );
    if (!status) {
      throw new Error(`Test case status with value ${value} not found in project`);
    }
    return status;
  },
};
