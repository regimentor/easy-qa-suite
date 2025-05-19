import Prisma from ".prisma/client";
import { Field, ID, ObjectType } from "type-graphql";
import { TestCaseModel } from "./test-case.model";

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

  @Field((_) => [TestCaseModel], { nullable: true })
  testCases?: TestCaseModel[];

  static fromPrisma(data: Prisma.TestSuite & { 
    suite_test_cases?: { test_case: Prisma.TestCase; order: number }[] 
  }): TestSuiteModel {
    const model = {
      id: data.id.toString(),
      name: data.name,
      description: data.description,
      type: data.type,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      projectId: data.project_id.toString(),
    };

    // Если в данных есть связанные тест-кейсы, добавляем их в модель
    if (data.suite_test_cases && data.suite_test_cases.length > 0) {
      const testCases = data.suite_test_cases
        .sort((a, b) => a.order - b.order) // Сортируем по порядку
        .map(relation => TestCaseModel.fromPrisma(relation.test_case));
      
      return { ...model, testCases };
    }

    return model;
  }

  static fromPrismaArray(data: Prisma.TestSuite[]): TestSuiteModel[] {
    return data.map((item) => TestSuiteModel.fromPrisma(item));
  }
}
