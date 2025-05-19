import Prisma from ".prisma/client";
import { Field, ID, ObjectType } from "type-graphql";
import { TestCaseStatusModel } from "./test-case-status.model";
import { TestCasePriorityModel } from "./test-case-priority.model";

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

  @Field((_) => Date)
  createdAt!: Date;

  @Field((_) => Date)
  updatedAt?: Date;

  @Field((_) => String)
  projectId!: string;

  @Field((_) => ID)
  statusId!: string;

  @Field((_) => ID)
  priorityId!: string;

  @Field((_) => TestCaseStatusModel, { nullable: true })
  status?: TestCaseStatusModel;

  @Field((_) => TestCasePriorityModel, { nullable: true })
  priority?: TestCasePriorityModel;

  static fromPrisma(
    data: Prisma.TestCase & {
      status?: Prisma.TestCaseStatus;
      priority?: Prisma.TestCasePriority;
    }
  ): TestCaseModel {
    const model: TestCaseModel = {
      id: data.id.toString(),
      title: data.title,
      description: data.description,
      preconditions: data.preconditions,
      postconditions: data.postconditions,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      projectId: data.project_id.toString(),
      priorityId: data.priority_id.toString(),
      statusId: data.status_id.toString(),
    };

    if (data.status) {
      model.status = TestCaseStatusModel.fromPrisma(data.status);
    }

    if (data.priority) {
      model.priority = TestCasePriorityModel.fromPrisma(data.priority);
    }

    return model;
  }

  static fromPrismaArray(data: Prisma.TestCase[]): TestCaseModel[] {
    return data.map((item) => TestCaseModel.fromPrisma(item));
  }
}
