import { CreateProjectInput } from "../graphql/inputs/create-project.input";
import { projectsRepository } from "../repositories/projects.repository";
import { ProjectNotFound } from "../errors/project.errors";

export const projectService = {
  async findProjects() {
    return projectsRepository.findBy({});
  },

  async findProjectById(id: string) {
    const project = await projectsRepository.firstFindBy({ id: BigInt(id) });
    if (!project) {
      throw new ProjectNotFound(id);
    }
    return project;
  },

  async createProject(data: CreateProjectInput) {
    return projectsRepository.create(data);
  },
};
