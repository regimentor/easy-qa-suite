import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { TestCaseStatusModel } from "../models/test-case-status.model";
import { testCaseStatusService } from "../../services/test-case-status.service";
import { ErrorHandler } from "../../decorators/error-handler";
import type { TGraphqlContext } from "../graphql";
import { logger } from "../../logger/logger";

@Resolver(() => TestCaseStatusModel)
@ErrorHandler()
export class TestCaseStatusResolver {
  @Query(() => [TestCaseStatusModel], {
    name: "testCaseStatuses",
  })
  async getTestCaseStatuses(
    @Arg("includeArchived", () => Boolean, { nullable: true }) includeArchived: boolean = false,
    @Ctx() ctx: TGraphqlContext
  ): Promise<TestCaseStatusModel[]> {
    logger.debug("Fetching test case statuses", { includeArchived });
    const statuses = await testCaseStatusService.findAll(includeArchived);
    return TestCaseStatusModel.fromPrismaArray(statuses);
  }

  @Query(() => TestCaseStatusModel, {
    name: "testCaseStatus",
  })
  async getTestCaseStatus(
    @Arg("id", () => String) id: string,
    @Ctx() ctx: TGraphqlContext
  ): Promise<TestCaseStatusModel> {
    logger.debug("Fetching test case status by ID", { id });
    const status = await testCaseStatusService.findById(id);
    return TestCaseStatusModel.fromPrisma(status);
  }
}
