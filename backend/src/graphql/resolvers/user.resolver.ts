import { Arg, Args, Mutation, Query, Resolver } from "type-graphql";
import { UserModel } from "../models/user.model";
import { userService } from "../../services/user.service";
import { CreateUserInput } from "../inputs/create-user.input";
import { ErrorHandler } from "../../decorators/error-handler";

@Resolver(() => UserModel)
@ErrorHandler()
export class UserResolver {
  @Query(() => [UserModel], {
    name: "users",
  })
  async getUsers(): Promise<UserModel[]> {
    const users = await userService.findUsers();
    return UserModel.fromPrismaArray(users);
  }

  @Mutation(() => UserModel, {
    name: "createUser",
  })
  async createUser(
    @Arg("data", () => CreateUserInput) data: CreateUserInput,
  ): Promise<UserModel> {
    const user = await userService.createUser(data);
    return UserModel.fromPrisma(user);
  }
}
