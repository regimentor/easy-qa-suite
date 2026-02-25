import { testCasePrioritiesRepository } from "../repositories/test-case-priorities.repository";
import { TestCasePriorityNotFoundError } from "../errors/test-case-priority.errors";

export const testCasePriorityService = {
  async findAllByProjectId(projectId: string, includeArchived: boolean = false) {
    return testCasePrioritiesRepository.findByProjectId(BigInt(projectId), includeArchived);
  },

  async findById(id: string) {
    const priority = await testCasePrioritiesRepository.findById(BigInt(id));
    if (!priority) {
      throw new TestCasePriorityNotFoundError(id);
    }
    return priority;
  },

  async findByProjectIdAndValue(projectId: string, value: string) {
    const priority = await testCasePrioritiesRepository.findByProjectIdAndValue(
      BigInt(projectId),
      value
    );
    if (!priority) {
      throw new Error(`Test case priority with value ${value} not found in project`);
    }
    return priority;
  },
};
