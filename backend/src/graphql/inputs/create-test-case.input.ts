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
  priority!: string;

  @Field(() => String)
  status!: string;

  @Field(() => String)
  projectId!: string;
}
