import { z } from "zod";
import type { IHandler } from "../handler";
import { jwt } from "../../jwt/jwt";

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});
export const refreshTokenPost: IHandler = async ({ req }) => {
  const body = await req.json();
  const data = refreshTokenSchema.safeParse(body);
  if (!data.success) {
    return {
      status: 400,
      data: {
        error: "Invalid request",
        details: data.error.format(),
      },
    };
  }

  const userClaims = await jwt.verifyToken(data.data.refreshToken);
  if (!userClaims) {
    return {
      status: 401,
      data: {
        error: "Invalid refresh token",
      },
    };
  }

  const newToken = await jwt.createToken({
    id: userClaims.id,
    username: userClaims.username,
  });

  const newRefreshToken = await jwt.createRefreshToken({
    id: userClaims.id,
    username: userClaims.username,
  });

  return {
    status: 200,
    data: {
      accessToken: newToken,
      refreshToken: newRefreshToken,
    },
  };
};
