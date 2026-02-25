import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { TestCaseStatusModel } from "../models/test-case-status.model";
import { testCaseStatusService } from "../../services/test-case-status.service";
import { testCaseStatusesRepository } from "../../repositories/test-case-statuses.repository";
import { ErrorHandler } from "../../decorators/error-handler";
import type { TGraphqlContext } from "../graphql";
import { logger } from "../../logger/logger";
import { CreateTestCaseStatusInput } from "../inputs/create-test-case-status.input";
import { UpdateTestCaseStatusInput } from "../inputs/update-test-case-status.input";

@Resolver(() => TestCaseStatusModel)
@ErrorHandler()
export class TestCaseStatusResolver {
  @Query(() => [TestCaseStatusModel], {
    name: "testCaseStatuses",
  })
  async getTestCaseStatuses(
    @Arg("projectId", () => String) projectId: string,
    @Arg("includeArchived", () => Boolean, { nullable: true }) includeArchived: boolean = false,
    @Ctx() _ctx: TGraphqlContext
  ): Promise<TestCaseStatusModel[]> {
    logger.debug("Fetching test case statuses", { projectId, includeArchived });
    const statuses = await testCaseStatusService.findAllByProjectId(projectId, includeArchived);
    return TestCaseStatusModel.fromPrismaArray(statuses);
  }

  @Query(() => TestCaseStatusModel, {
    name: "testCaseStatus",
  })
  async getTestCaseStatus(
    @Arg("id", () => String) id: string,
    @Ctx() _ctx: TGraphqlContext
  ): Promise<TestCaseStatusModel> {
    logger.debug("Fetching test case status by ID", { id });
    const status = await testCaseStatusService.findById(id);
    return TestCaseStatusModel.fromPrisma(status);
  }

  @Mutation(() => TestCaseStatusModel, {
    name: "createTestCaseStatus",
  })
  async createTestCaseStatus(
    @Arg("input") input: CreateTestCaseStatusInput,
    @Ctx() _ctx: TGraphqlContext
  ): Promise<TestCaseStatusModel> {
    logger.debug("Creating test case status", { projectId: input.projectId, value: input.value });
    const created = await testCaseStatusesRepository.create({
      project: { connect: { id: BigInt(input.projectId) } },
      value: input.value,
      description: input.description,
    });
    return TestCaseStatusModel.fromPrisma(created);
  }

  @Mutation(() => TestCaseStatusModel, {
    name: "updateTestCaseStatus",
  })
  async updateTestCaseStatus(
    @Arg("id", () => String) id: string,
    @Arg("input") input: UpdateTestCaseStatusInput,
    @Ctx() _ctx: TGraphqlContext
  ): Promise<TestCaseStatusModel> {
    logger.debug("Updating test case status", { id });
    const data: { value?: string; description?: string; archived?: boolean } = {};
    if (input.value !== undefined) data.value = input.value;
    if (input.description !== undefined) data.description = input.description;
    if (input.archived !== undefined) data.archived = input.archived;
    const updated = await testCaseStatusesRepository.update(BigInt(id), data);
    return TestCaseStatusModel.fromPrisma(updated);
  }
}
