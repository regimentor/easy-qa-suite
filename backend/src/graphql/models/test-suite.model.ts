import Prisma from ".prisma/client";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class TestSuiteModel {
  @Field((_) => ID)
  id!: string;

  @Field((_) => String)
  name!: string;

  @Field((_) => String, { nullable: true })
  description!: string | null;

  @Field((_) => String)
  type!: string;

  @Field((_) => Date)
  createdAt!: Date;

  @Field((_) => Date)
  updatedAt?: Date;

  @Field((_) => String)
  projectId!: string;

  static fromPrisma(data: Prisma.TestSuite): TestSuiteModel {
    return {
      id: data.id.toString(),
      name: data.name,
      description: data.description,
      type: data.type,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      projectId: data.project_id.toString(),
    };
  }

  static fromPrismaArray(data: Prisma.TestSuite[]): TestSuiteModel[] {
    return data.map((item) => TestSuiteModel.fromPrisma(item));
  }
}
