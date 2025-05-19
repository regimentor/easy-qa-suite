import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { TestSuiteTypeModel } from "../models/test-suite-type.model";
import { testSuiteTypeService } from "../../services/test-suite-type.service";
import { ErrorHandler } from "../../decorators/error-handler";
import type { TGraphqlContext } from "../graphql";
import { logger } from "../../logger/logger";

@Resolver(() => TestSuiteTypeModel)
@ErrorHandler()
export class TestSuiteTypeResolver {
  @Query(() => [TestSuiteTypeModel], {
    name: "testSuiteTypes",
  })
  async getTestSuiteTypes(
    @Arg("includeArchived", () => Boolean, { nullable: true }) includeArchived: boolean = false,
    @Ctx() ctx: TGraphqlContext
  ): Promise<TestSuiteTypeModel[]> {
    logger.debug("Fetching test suite types", { includeArchived });
    const types = await testSuiteTypeService.findAll(includeArchived);
    return TestSuiteTypeModel.fromPrismaArray(types);
  }

  @Query(() => TestSuiteTypeModel, {
    name: "testSuiteType",
  })
  async getTestSuiteType(
    @Arg("id", () => String) id: string,
    @Ctx() ctx: TGraphqlContext
  ): Promise<TestSuiteTypeModel> {
    logger.debug("Fetching test suite type by ID", { id });
    const type = await testSuiteTypeService.findById(id);
    return TestSuiteTypeModel.fromPrisma(type);
  }
}
