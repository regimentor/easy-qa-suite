import { Field, InputType } from "type-graphql";

@InputType()
export class CreateTestCasePriorityInput {
  @Field(() => String)
  projectId!: string;

  @Field(() => String)
  value!: string;

  @Field(() => String)
  description!: string;
}
