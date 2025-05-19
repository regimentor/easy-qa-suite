import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { TestResultModel } from "../models/test-result.model";
import { testResultService } from "../../services/test-result.service";
import { CreateTestResultInput } from "../inputs/create-test-result.input";
import { ErrorHandler } from "../../decorators/error-handler";
import type { TGraphqlContext } from "../graphql";
import { logger } from "../../logger/logger";

@Resolver(() => TestResultModel)
@ErrorHandler()
export class TestResultResolver {
  @Query(() => [TestResultModel], {
    name: "testResults",
  })
  async getTestResults(@Ctx() ctx: TGraphqlContext): Promise<TestResultModel[]> {
    logger.debug("Fetching all test results");
    const testResults = await testResultService.findTestResults();
    return TestResultModel.fromPrismaArray(testResults);
  }

  @Mutation(() => TestResultModel, {
    name: "createTestResult",
  })
  async createTestResult(
    @Arg("data", () => CreateTestResultInput) data: CreateTestResultInput,
    @Ctx() ctx: TGraphqlContext,
  ): Promise<TestResultModel> {
    logger.debug("Creating test result", { data });
    const testResult = await testResultService.createTestResult(data);
    return TestResultModel.fromPrisma(testResult);
  }
}
