import { InputType, Field } from "type-graphql";

@InputType()
export class CreateProjectInput {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  key!: string;

  @Field(() => String, { nullable: true })
  description?: string;
}
