import Prisma from ".prisma/client";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class TestCaseModel {
  @Field((_) => ID)
  id!: string;

  @Field((_) => String)
  title!: string;

  @Field((_) => String)
  description!: string;

  @Field((_) => String, { nullable: true })
  preconditions!: string | null;

  @Field((_) => String, { nullable: true })
  postconditions!: string | null;

  @Field((_) => String)
  priority!: string;

  @Field((_) => String)
  status!: string;

  @Field((_) => Date)
  createdAt!: Date;

  @Field((_) => Date)
  updatedAt?: Date;

  @Field((_) => String)
  projectId!: string;

  static fromPrisma(data: Prisma.TestCase): TestCaseModel {
    return {
      id: data.id.toString(),
      title: data.title,
      description: data.description,
      preconditions: data.preconditions,
      postconditions: data.postconditions,
      priority: data.priority,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      projectId: data.project_id.toString(),
    };
  }

  static fromPrismaArray(data: Prisma.TestCase[]): TestCaseModel[] {
    return data.map((item) => TestCaseModel.fromPrisma(item));
  }
}
