import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { TestSuiteModel } from "../models/test-suite.model";
import { testSuiteService } from "../../services/test-suite.service";
import { CreateTestSuiteInput } from "../inputs/create-test-suite.input";
import { ErrorHandler } from "../../decorators/error-handler";
import type { TGraphqlContext } from "../graphql";
import { logger } from "../../logger/logger";

@Resolver(() => TestSuiteModel)
@ErrorHandler()
export class TestSuiteResolver {
  @Query(() => [TestSuiteModel], {
    name: "testSuites",
  })
  async getTestSuites(@Ctx() ctx: TGraphqlContext): Promise<TestSuiteModel[]> {
    logger.debug("Fetching all test suites");
    const testSuites = await testSuiteService.findTestSuites();
    return TestSuiteModel.fromPrismaArray(testSuites);
  }

  @Mutation(() => TestSuiteModel, {
    name: "createTestSuite",
  })
  async createTestSuite(
    @Arg("data", () => CreateTestSuiteInput) data: CreateTestSuiteInput,
    @Ctx() ctx: TGraphqlContext,
  ): Promise<TestSuiteModel> {
    logger.debug("Creating test suite", { data });
    const testSuite = await testSuiteService.createTestSuite(data);
    return TestSuiteModel.fromPrisma(testSuite);
  }
}
