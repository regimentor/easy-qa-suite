import { testCasePrioritiesRepository } from "../repositories/test-case-priorities.repository";
import { TestCasePriorityNotFoundError } from "../errors/test-case-priority.errors";

export const testCasePriorityService = {
  async findAll(includeArchived: boolean = false) {
    const where = includeArchived ? {} : { archived: false };
    return testCasePrioritiesRepository.findBy(where);
  },

  async findById(id: string) {
    const priority = await testCasePrioritiesRepository.findById(BigInt(id));
    if (!priority) {
      throw new TestCasePriorityNotFoundError(id);
    }
    return priority;
  },

  async findByValue(value: string) {
    const priority = await testCasePrioritiesRepository.findByValue(value);
    if (!priority) {
      throw new Error(`Test case priority with value ${value} not found`);
    }
    return priority;
  }
};
