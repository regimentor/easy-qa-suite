import type { IHandler } from "../handler";
import { jwt } from "../../jwt/jwt";
import { userService } from "../../services/user.service";

export const meGet: IHandler = async ({ req }) => {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return {
      data: { error: "Unauthorized" },
      status: 401,
    };
  }

  const tokenClaims = await jwt.verifyToken(token);
  if (!tokenClaims) {
    return {
      data: { error: "Unauthorized" },
      status: 401,
    };
  }

  const user = await userService.userExists(tokenClaims.username);
  if (!user) {
    return {
      data: { error: "Unauthorized" },
      status: 401,
    };
  }

  return {
    data: { ...user, password_hash: undefined },
    status: 200,
  };
};
