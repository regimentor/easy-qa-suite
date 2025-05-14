import { Field, InputType } from "type-graphql";

@InputType()
export class CreateUserInput {
  @Field((_) => String)
  username!: string;

  @Field((_) => String)
  password!: string;
}
