import { Prisma } from ".prisma/client";
import { prismaClient } from "../prisma.client";

function findBy(where: Prisma.ProjectWhereInput) {
  return prismaClient.project.findMany({ where });
}

function firstFindBy(where: Prisma.ProjectWhereInput) {
  return prismaClient.project.findFirst({ where });
}

function create(data: Prisma.ProjectCreateInput) {
  return prismaClient.project.create({ data });
}

export const projectsRepository = {
  findBy,
  firstFindBy,
  create
};
