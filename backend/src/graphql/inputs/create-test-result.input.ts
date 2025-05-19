import { InputType, Field } from "type-graphql";

@InputType()
export class CreateTestResultInput {
  @Field(() => String)
  status!: string;

  @Field(() => Date)
  startedAt!: Date;

  @Field(() => Date)
  finishedAt!: Date;

  @Field(() => String)
  log!: string;

  @Field(() => String, { nullable: true })
  screenshotUrl?: string;

  @Field(() => String, { nullable: true })
  defectLink?: string;

  @Field(() => String)
  testCaseId!: string;
}
