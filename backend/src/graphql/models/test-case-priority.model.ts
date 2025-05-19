import Prisma from ".prisma/client";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class TestCasePriorityModel {
  @Field((_) => ID)
  id!: string;

  @Field((_) => String)
  value!: string;

  @Field((_) => String)
  description!: string;

  @Field((_) => Boolean)
  archived!: boolean;

  @Field((_) => Date)
  createdAt!: Date;

  @Field((_) => Date)
  updatedAt!: Date;

  static fromPrisma(data: Prisma.TestCasePriority): TestCasePriorityModel {
    return {
      id: data.id.toString(),
      value: data.value,
      description: data.description,
      archived: data.archived,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  static fromPrismaArray(data: Prisma.TestCasePriority[]): TestCasePriorityModel[] {
    return data.map((item) => TestCasePriorityModel.fromPrisma(item));
  }
}
