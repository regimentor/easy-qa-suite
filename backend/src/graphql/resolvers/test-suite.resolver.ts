import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { TestSuiteModel } from "../models/test-suite.model";
import { TestCaseModel } from "../models/test-case.model";
import { TestSuiteTypeModel } from "../models/test-suite-type.model";
import { testSuiteService } from "../../services/test-suite.service";
import { testSuiteTypeService } from "../../services/test-suite-type.service";
import { CreateTestSuiteInput } from "../inputs/create-test-suite.input";
import { AddTestCasesToSuiteInput } from "../inputs/add-test-cases-to-suite.input";
import { ErrorHandler } from "../../decorators/error-handler";
import type { TGraphqlContext } from "../graphql";
import { logger } from "../../logger/logger";

@Resolver(() => TestSuiteModel)
@ErrorHandler()
export class TestSuiteResolver {
  @Query(() => [TestSuiteModel], {
    name: "testSuites",
  })
  async getTestSuites(
    @Arg("projectId", () => String, { nullable: true })
    projectId: string | null,
    @Ctx() ctx: TGraphqlContext
  ): Promise<TestSuiteModel[]> {
    logger.debug("Fetching test suites", projectId ? { projectId } : {});
    const testSuites = await testSuiteService.findTestSuites(projectId);
    return TestSuiteModel.fromPrismaArray(testSuites);
  }

  @Query(() => TestSuiteModel, {
    name: "testSuite",
  })
  async getTestSuite(
    @Arg("id", () => String) id: string,
    @Ctx() ctx: TGraphqlContext
  ): Promise<TestSuiteModel> {
    logger.debug("Fetching test suite by ID", { id });
    const testSuite = await testSuiteService.findTestSuiteById(id);
    return TestSuiteModel.fromPrisma(testSuite);
  }

  @Mutation(() => TestSuiteModel, {
    name: "createTestSuite",
  })
  async createTestSuite(
    @Arg("data", () => CreateTestSuiteInput) data: CreateTestSuiteInput,
    @Ctx() ctx: TGraphqlContext
  ): Promise<TestSuiteModel> {
    logger.debug("Creating test suite", { data });
    const testSuite = await testSuiteService.createTestSuite(data);
    return TestSuiteModel.fromPrisma(testSuite);
  }

  @Mutation(() => TestSuiteModel, {
    name: "addTestCasesToSuite",
  })
  async addTestCasesToSuite(
    @Arg("data", () => AddTestCasesToSuiteInput) data: AddTestCasesToSuiteInput,
    @Ctx() ctx: TGraphqlContext
  ): Promise<TestSuiteModel> {
    logger.debug("Adding test cases to suite", { data });
    const result = await testSuiteService.addTestCasesToSuite(data);
    return TestSuiteModel.fromPrisma(result);
  }

  @FieldResolver(() => [TestCaseModel])
  async testCases(@Root() testSuite: TestSuiteModel): Promise<TestCaseModel[]> {
    logger.debug("Resolving test cases for test suite", {
      testSuiteId: testSuite.id,
    });

    // Если тест-кейсы уже загружены при получении тест-сьюта, используем их
    if (testSuite.testCases) {
      return testSuite.testCases;
    }

    // В противном случае загружаем тест-кейсы через сервис
    const testCases = await testSuiteService.findTestCasesBySuiteId(
      testSuite.id
    );
    return TestCaseModel.fromPrismaArray(testCases);
  }

  @FieldResolver(() => TestSuiteTypeModel, { nullable: true })
  async typeModel(
    @Root() testSuite: TestSuiteModel
  ): Promise<TestSuiteTypeModel | null> {
    if (testSuite.type) {
      return testSuite.type;
    }

    try {
      const type = await testSuiteTypeService.findById(testSuite.typeId);
      return type ? TestSuiteTypeModel.fromPrisma(type) : null;
    } catch (error) {
      logger.error("Error resolving test suite type", {
        testSuiteId: testSuite.id,
        error,
      });
      return null;
    }
  }
}
