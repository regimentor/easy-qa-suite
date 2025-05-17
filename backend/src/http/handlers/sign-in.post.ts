import { z } from "zod";
import type { IHandler } from "../handler";
import { jwt } from "../../jwt/jwt";
import { userService } from "../../services/user.service";
import { logger } from "../../logger/logger";

const signInSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const signInPost: IHandler = async ({ req, ctx }) => {
  logger.debug("Sign in handler called");
  const body = await req.json();
  const parsedBody = signInSchema.safeParse(body);
  if (!parsedBody.success) {
    logger.error("Sign in handler validation error");
    return {
      data: parsedBody.error.issues,
      status: 400,
    };
  }

  const userExists = await userService.userExists(parsedBody.data.username);
  if (!userExists) {
    logger.error("User does not exist");
    return {
      data: {
        message: "User does not exist",
      },
      status: 400,
    };
  }

  const passVerified = await userService.verifyUserPassword(
    parsedBody.data.username,
    parsedBody.data.password
  );
  if (!passVerified) {
    logger.error("Invalid password");
    return {
      data: {
        message: "Invalid password",
      },
      status: 400,
    };
  }

  const token = await jwt.createToken({
    id: parsedBody.data.username,
    username: parsedBody.data.username,
  });

  const refreshToken = await jwt.createRefreshToken({
    id: parsedBody.data.username,
    username: parsedBody.data.username,
  });

  return {
    data: {
      token,
      refreshToken,
    },
    status: 200,
  };
};
