import { InputType, Field } from "type-graphql";

@InputType()
export class CreateTestCaseInput {
  @Field(() => String)
  title!: string;

  @Field(() => String)
  description!: string;

  @Field(() => String, { nullable: true })
  preconditions?: string;

  @Field(() => String, { nullable: true })
  postconditions?: string;

  @Field(() => String)
  priorityId!: string;

  @Field(() => String)
  statusId!: string;

  @Field(() => String)
  projectId!: string;
}
