import { InputType, Field } from "type-graphql";

@InputType()
export class CreateTestSuiteInput {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String)
  typeId!: string;

  @Field(() => String)
  projectId!: string;
}
