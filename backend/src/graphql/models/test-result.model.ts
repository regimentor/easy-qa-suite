import Prisma from ".prisma/client";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class TestResultModel {
  @Field((_) => ID)
  id!: string;

  @Field((_) => String)
  status!: string;

  @Field((_) => Date)
  startedAt!: Date;

  @Field((_) => Date)
  finishedAt!: Date;

  @Field((_) => String)
  log!: string;

  @Field((_) => String, { nullable: true })
  screenshotUrl!: string | null;

  @Field((_) => String, { nullable: true })
  defectLink!: string | null;

  @Field((_) => String)
  testCaseId!: string;

  static fromPrisma(data: Prisma.TestResult): TestResultModel {
    return {
      id: data.id.toString(),
      status: data.status,
      startedAt: data.started_at,
      finishedAt: data.finished_at,
      log: data.log,
      screenshotUrl: data.screenshot_url,
      defectLink: data.defect_link,
      testCaseId: data.test_case_id.toString(),
    };
  }

  static fromPrismaArray(data: Prisma.TestResult[]): TestResultModel[] {
    return data.map((item) => TestResultModel.fromPrisma(item));
  }
}
