import { testSuiteTypesRepository } from "../repositories/test-suite-types.repository";
import { TestSuiteTypeNotFoundError } from "../errors/test-suite-type.errors";

export const testSuiteTypeService = {
  async findAll(includeArchived: boolean = false) {
    const where = includeArchived ? {} : { archived: false };
    return testSuiteTypesRepository.findBy(where);
  },

  async findById(id: string) {
    const testSuiteType = await testSuiteTypesRepository.findById(BigInt(id));

    if (!testSuiteType) {
      throw new TestSuiteTypeNotFoundError(id);
    }

    return testSuiteType;
  },
};
