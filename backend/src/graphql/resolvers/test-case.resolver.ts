import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { TestCaseModel } from "../models/test-case.model";
import { TestCaseStatusModel } from "../models/test-case-status.model";
import { TestCasePriorityModel } from "../models/test-case-priority.model";
import { testCaseService } from "../../services/test-case.service";
import { testCaseStatusService } from "../../services/test-case-status.service";
import { testCasePriorityService } from "../../services/test-case-priority.service";
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
    @Ctx() ctx: TGraphqlContext
  ): Promise<TestCaseModel> {
    logger.debug("Creating test case", { data });
    const testCase = await testCaseService.createTestCase(data);
    return TestCaseModel.fromPrisma(testCase);
  }

  @FieldResolver(() => TestCaseStatusModel, { nullable: true })
  async status(
    @Root() testCase: TestCaseModel
  ): Promise<TestCaseStatusModel | null> {
    if (testCase.status) {
      return testCase.status;
    }

    try {
      const status = await testCaseStatusService.findById(testCase.statusId);
      return status ? TestCaseStatusModel.fromPrisma(status) : null;
    } catch (error) {
      logger.error("Error resolving test case status", {
        testCaseId: testCase.id,
        error,
      });
      return null;
    }
  }

  @FieldResolver(() => TestCasePriorityModel, { nullable: true })
  async priority(
    @Root() testCase: TestCaseModel
  ): Promise<TestCasePriorityModel | null> {
    if (testCase.priority) {
      return testCase.priority;
    }

    try {
      const priority = await testCasePriorityService.findById(
        testCase.priorityId
      );
      return priority ? TestCasePriorityModel.fromPrisma(priority) : null;
    } catch (error) {
      logger.error("Error resolving test case priority", {
        testCaseId: testCase.id,
        error,
      });
      return null;
    }
  }
}
