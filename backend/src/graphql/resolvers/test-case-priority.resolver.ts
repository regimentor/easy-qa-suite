import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { TestCasePriorityModel } from "../models/test-case-priority.model";
import { testCasePriorityService } from "../../services/test-case-priority.service";
import { testCasePrioritiesRepository } from "../../repositories/test-case-priorities.repository";
import { ErrorHandler } from "../../decorators/error-handler";
import type { TGraphqlContext } from "../graphql";
import { logger } from "../../logger/logger";
import { CreateTestCasePriorityInput } from "../inputs/create-test-case-priority.input";
import { UpdateTestCasePriorityInput } from "../inputs/update-test-case-priority.input";

@Resolver(() => TestCasePriorityModel)
@ErrorHandler()
export class TestCasePriorityResolver {
  @Query(() => [TestCasePriorityModel], {
    name: "testCasePriorities",
  })
  async getTestCasePriorities(
    @Arg("projectId", () => String) projectId: string,
    @Arg("includeArchived", () => Boolean, { nullable: true }) includeArchived: boolean = false,
    @Ctx() _ctx: TGraphqlContext
  ): Promise<TestCasePriorityModel[]> {
    logger.debug("Fetching test case priorities", { projectId, includeArchived });
    const priorities = await testCasePriorityService.findAllByProjectId(projectId, includeArchived);
    return TestCasePriorityModel.fromPrismaArray(priorities);
  }

  @Query(() => TestCasePriorityModel, {
    name: "testCasePriority",
  })
  async getTestCasePriority(
    @Arg("id", () => String) id: string,
    @Ctx() _ctx: TGraphqlContext
  ): Promise<TestCasePriorityModel> {
    logger.debug("Fetching test case priority by ID", { id });
    const priority = await testCasePriorityService.findById(id);
    return TestCasePriorityModel.fromPrisma(priority);
  }

  @Mutation(() => TestCasePriorityModel, {
    name: "createTestCasePriority",
  })
  async createTestCasePriority(
    @Arg("input") input: CreateTestCasePriorityInput,
    @Ctx() _ctx: TGraphqlContext
  ): Promise<TestCasePriorityModel> {
    logger.debug("Creating test case priority", { projectId: input.projectId, value: input.value });
    const created = await testCasePrioritiesRepository.create({
      project: { connect: { id: BigInt(input.projectId) } },
      value: input.value,
      description: input.description,
    });
    return TestCasePriorityModel.fromPrisma(created);
  }

  @Mutation(() => TestCasePriorityModel, {
    name: "updateTestCasePriority",
  })
  async updateTestCasePriority(
    @Arg("id", () => String) id: string,
    @Arg("input") input: UpdateTestCasePriorityInput,
    @Ctx() _ctx: TGraphqlContext
  ): Promise<TestCasePriorityModel> {
    logger.debug("Updating test case priority", { id });
    const data: { value?: string; description?: string; archived?: boolean } = {};
    if (input.value !== undefined) data.value = input.value;
    if (input.description !== undefined) data.description = input.description;
    if (input.archived !== undefined) data.archived = input.archived;
    const updated = await testCasePrioritiesRepository.update(BigInt(id), data);
    return TestCasePriorityModel.fromPrisma(updated);
  }
}
