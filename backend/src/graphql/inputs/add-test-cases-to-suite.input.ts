import { InputType, Field } from "type-graphql";

@InputType()
export class AddTestCasesToSuiteInput {
  @Field(() => String)
  suiteId!: string;

  @Field(() => [String])
  testCaseIds!: string[];
}
