import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateTestCaseStatusInput {
  @Field(() => String, { nullable: true })
  value?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Boolean, { nullable: true })
  archived?: boolean;
}
