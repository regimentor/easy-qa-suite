import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { TestCaseModel } from "../models/test-case.model";
import { testCaseService } from "../../services/test-case.service";
import { CreateTestCaseInput } from "../inputs/create-test-case.input";
import { ErrorHandler } from "../../decorators/error-handler";
import type { TGraphqlContext } from "../graphql";
import { logger } from "../../logger/logger";

@Resolver(() => TestCaseModel)
@ErrorHandler()
export class TestCaseResolver {
  @Query(() => [TestCaseModel], {
    name: "testCases",
  })
  async getTestCases(
    @Arg("projectId", () => String) projectId: string,
    @Ctx() ctx: TGraphqlContext
  ): Promise<TestCaseModel[]> {
    logger.debug("Fetching test cases for project", { projectId });
    const testCases = await testCaseService.findTestCasesByProjectId(projectId);
    return TestCaseModel.fromPrismaArray(testCases);
  }

  @Mutation(() => TestCaseModel, {
    name: "createTestCase",
  })
  async createTestCase(
    @Arg("data", () => CreateTestCaseInput) data: CreateTestCaseInput,
    @Ctx() ctx: TGraphqlContext,
  ): Promise<TestCaseModel> {
    logger.debug("Creating test case", { data });
    const testCase = await testCaseService.createTestCase(data);
    return TestCaseModel.fromPrisma(testCase);
  }
}
