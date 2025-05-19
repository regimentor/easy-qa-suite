import Prisma from ".prisma/client";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class TestSuiteTypeModel {
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

  static fromPrisma(data: Prisma.TestSuiteType): TestSuiteTypeModel {
    return {
      id: data.id.toString(),
      value: data.value,
      description: data.description,
      archived: data.archived,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  static fromPrismaArray(data: Prisma.TestSuiteType[]): TestSuiteTypeModel[] {
    return data.map((item) => TestSuiteTypeModel.fromPrisma(item));
  }
}
