import { sleep } from "bun";
import { describe, expect, mock, test } from "bun:test";

mock.module("../../src/logger/logger", () => {
  return {
    logger: {
      error: mock(() => {}),
    },
  };
});
const { jwt } = await import("../../src/jwt/jwt");

describe("JWT", () => {
  test("should sign jwt token", async () => {
    const token = await jwt.createToken({ id: "1", username: "test" });
    expect(token).toBeDefined();
  });

  test("should verify jwt token", async () => {
    const token = await jwt.createToken({ id: "1", username: "test" });
    const payload = await jwt.verifyToken(token);
    expect(payload).toBeDefined();
    expect(payload?.id).toBe("1");
    expect(payload?.username).toBe("test");
  });

  test("should refresh jwt token", async () => {
    const token = await jwt.createToken({ id: "1", username: "test" });
    await sleep(1000)
    const newToken = await jwt.refreshToken(token);

    expect(newToken).toBeDefined();
    expect(newToken).not.toBe(token);
  });

  test("should return null for invalid token", async () => {
    const payload = await jwt.verifyToken("invalid-token");
    expect(payload).toBeNull();
  });

  test("should return null for expired token", async () => {
    const token = await jwt.createToken({ id: "1", username: "test" }, "1s");
    await sleep(2000); // Wait for 2 hours
    const payload = await jwt.verifyToken(token);
    expect(payload).toBeNull();
  });

  test("should return null for invalid token on refresh", async () => {
    const newToken = await jwt.refreshToken("invalid-token");
    expect(newToken).toBeNull();
  });
});
