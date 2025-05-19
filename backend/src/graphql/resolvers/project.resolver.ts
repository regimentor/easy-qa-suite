import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { ProjectModel } from "../models/project.model";
import { projectService } from "../../services/project.service";
import { ErrorHandler } from "../../decorators/error-handler";
import type { TGraphqlContext } from "../graphql";
import { logger } from "../../logger/logger";
import { CreateProjectInput } from "../inputs/create-project.input";

@Resolver(() => ProjectModel)
@ErrorHandler()
export class ProjectResolver {
  @Query(() => [ProjectModel], {
    name: "projects",
  })
  async getProjects(@Ctx() ctx: TGraphqlContext): Promise<ProjectModel[]> {
    logger.debug("Fetching all projects");
    const projects = await projectService.findProjects();
    return ProjectModel.fromPrismaArray(projects);
  }

  @Mutation(() => ProjectModel, {
    name: "createProject",
  })
  async createProject(
    @Arg("data", () => CreateProjectInput) data: CreateProjectInput,
    @Ctx() ctx: TGraphqlContext
  ): Promise<ProjectModel> {
    logger.debug("Creating project", { data });
    const project = await projectService.createProject(data);
    return ProjectModel.fromPrisma(project);
  }
}
