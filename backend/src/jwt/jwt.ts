import { SignJWT, jwtVerify } from "jose";
import { logger } from "../logger/logger";

const secret = new TextEncoder().encode(Bun.env.JWT_SECRET || "secret");

type TUserClaim = {
  id: string;
  username: string;
};
async function createToken(params: TUserClaim, expiresIn: string = "2h") {
  const token = new SignJWT({ ...params });
  token
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn);

  const tokenString = await token.sign(secret);

  return tokenString;
}

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify<TUserClaim>(token, secret);
    return payload;
  } catch (error) {
    logger.error("Error verifying token", error);
    return null;
  }
}

async function refreshToken(token: string) {
  try {
    const { payload } = await jwtVerify<TUserClaim>(token, secret);
    const newToken = await createToken(payload);
    return newToken;
  } catch (error) {
    logger.error("Error refreshing token", error);
    return null;
  }
}

export const jwt = {
  createToken,
  verifyToken,
  refreshToken,
};
