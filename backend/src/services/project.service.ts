import { PrismaClient } from "@prisma/client";
import { CreateProjectInput } from "../graphql/inputs/create-project.input";
const prisma = new PrismaClient();

export const projectService = {
  async findProjects() {
    return prisma.project.findMany();
  },

  async createProject(data: CreateProjectInput) {
    return prisma.project.create({ data });
  },
};
