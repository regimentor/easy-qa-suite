import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { TestCasePriorityModel } from "../models/test-case-priority.model";
import { testCasePriorityService } from "../../services/test-case-priority.service";
import { ErrorHandler } from "../../decorators/error-handler";
import type { TGraphqlContext } from "../graphql";
import { logger } from "../../logger/logger";

@Resolver(() => TestCasePriorityModel)
@ErrorHandler()
export class TestCasePriorityResolver {
  @Query(() => [TestCasePriorityModel], {
    name: "testCasePriorities",
  })
  async getTestCasePriorities(
    @Arg("includeArchived", () => Boolean, { nullable: true }) includeArchived: boolean = false,
    @Ctx() ctx: TGraphqlContext
  ): Promise<TestCasePriorityModel[]> {
    logger.debug("Fetching test case priorities", { includeArchived });
    const priorities = await testCasePriorityService.findAll(includeArchived);
    return TestCasePriorityModel.fromPrismaArray(priorities);
  }

  @Query(() => TestCasePriorityModel, {
    name: "testCasePriority",
  })
  async getTestCasePriority(
    @Arg("id", () => String) id: string,
    @Ctx() ctx: TGraphqlContext
  ): Promise<TestCasePriorityModel> {
    logger.debug("Fetching test case priority by ID", { id });
    const priority = await testCasePriorityService.findById(id);
    return TestCasePriorityModel.fromPrisma(priority);
  }
}
