import { testCaseStatusesRepository } from "../repositories/test-case-statuses.repository";
import { TestCaseStatusNotFound } from "../errors/test-case-status.errors";

export const testCaseStatusService = {
  async findAll(includeArchived: boolean = false) {
    const where = includeArchived ? {} : { archived: false };
    return testCaseStatusesRepository.findBy(where);
  },

  async findById(id: string) {
    const status = await testCaseStatusesRepository.findById(BigInt(id));
    if (!status) {
      throw new TestCaseStatusNotFound(id);
    }
    return status;
  },
};
