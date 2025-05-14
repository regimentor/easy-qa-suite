import { Prisma } from ".prisma/client";
import { prismaClient } from "../prisma.client";

function findBy(where: Prisma.UserWhereInput) {
  return prismaClient.user.findMany({ where });
}

function firstFindBy(where: Prisma.UserWhereInput) {
  return prismaClient.user.findFirst({ where });
}

function create(data: Prisma.UserCreateInput) {
  return prismaClient.user.create({ data });
}

export const usersRepository = {
  findBy,
  firstFindBy,
  create
};
