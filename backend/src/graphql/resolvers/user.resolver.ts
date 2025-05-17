import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UserModel } from "../models/user.model";
import { userService } from "../../services/user.service";
import { CreateUserInput } from "../inputs/create-user.input";
import { ErrorHandler } from "../../decorators/error-handler";
import type { TGraphqlContext } from "../graphql";
import { logger } from "../../logger/logger";
import { AuthGuard } from "../decorators/auth-guard.decorator";

@Resolver(() => UserModel)
@ErrorHandler()
@Authorized()
export class UserResolver {
  @Query(() => [UserModel], {
    name: "users",
  })
  async getUsers(@Ctx() ctx: TGraphqlContext): Promise<UserModel[]> {
    logger.debug("Fetching all users");
    const users = await userService.findUsers();
    return UserModel.fromPrismaArray(users);
  }

  @Mutation(() => UserModel, {
    name: "createUser",
  })
  async createUser(
    @Arg("data", () => CreateUserInput) data: CreateUserInput,
    @Ctx() ctx: TGraphqlContext,
  ): Promise<UserModel> {
    logger.debug("Creating user", { data });
    const user = await userService.createUser(data);
    return UserModel.fromPrisma(user);
  }
}
