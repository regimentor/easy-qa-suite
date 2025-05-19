import { testResultsRepository } from "../repositories/test-results.repository";
import { CreateTestResultInput } from "../graphql/inputs/create-test-result.input";

export const testResultService = {
  async findTestResults() {
    return testResultsRepository.findBy({});
  },

  async createTestResult(data: CreateTestResultInput) {
    return testResultsRepository.create({
      status: data.status,
      started_at: data.startedAt,
      finished_at: data.finishedAt,
      log: data.log,
      screenshot_url: data.screenshotUrl ?? null,
      defect_link: data.defectLink ?? null,
      test_case: { connect: { id: BigInt(data.testCaseId) } },
    });
  },
};
