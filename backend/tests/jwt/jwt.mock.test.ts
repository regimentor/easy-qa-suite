import { describe, test, expect, beforeEach } from "bun:test";
import {
  mockJwt,
  jwtMock,
  mockJwtVerification,
  mockExpiredToken,
  mockTokenCreation,
  mockRefreshTokenCreation
} from "../mocks/jwt.test";

// Mock JWT before importing any modules that use it
mockJwt();

describe("JWT Mock Demonstration", () => {
  beforeEach(() => {
    // Reset mock implementations before each test
    jwtMock.createToken.mockReset();
    jwtMock.verifyToken.mockReset();
    jwtMock.refreshToken.mockReset();
    jwtMock.createRefreshToken.mockReset();

    // Restore default implementations
    jwtMock.createToken.mockImplementation(() => Promise.resolve("mocked-jwt-token"));
    jwtMock.verifyToken.mockImplementation(() => Promise.resolve({ id: "1", username: "test" }));
    jwtMock.refreshToken.mockImplementation(() => Promise.resolve("mocked-refreshed-token"));
    jwtMock.createRefreshToken.mockImplementation(() => Promise.resolve("mocked-refresh-token"));
  });

  test("should use default mock implementations", async () => {
    // Test default mocked JWT behavior
    const token = await jwtMock.createToken({ id: "1", username: "test" });
    const payload = await jwtMock.verifyToken(token);
    const refreshToken = await jwtMock.createRefreshToken({ id: "1", username: "test" });
    const newToken = await jwtMock.refreshToken(refreshToken);

    expect(token).toBe("mocked-jwt-token");
    expect(payload).toEqual({ id: "1", username: "test" });
    expect(refreshToken).toBe("mocked-refresh-token");
    expect(newToken).toBe("mocked-refreshed-token");
  });

  test("should allow custom verification result", async () => {
    // Setup custom verification result
    const customPayload = { id: "42", username: "customuser" };
    mockJwtVerification(customPayload);

    // Use the JWT mock with custom verification
    const payload = await jwtMock.verifyToken("any-token");

    expect(payload).toEqual(customPayload);
  });

  test("should simulate token verification failure", async () => {
    // Setup verification to return null (invalid token)
    mockJwtVerification(null);

    // Use the JWT mock with failed verification
    const payload = await jwtMock.verifyToken("invalid-token");

    expect(payload).toBeNull();
  });

  test("should simulate expired token", async () => {
    // Setup expired token simulation
    mockExpiredToken();

    // Use the JWT mock with expired token
    const verifyResult = await jwtMock.verifyToken("expired-token");
    const refreshResult = await jwtMock.refreshToken("expired-token");

    expect(verifyResult).toBeNull();
    expect(refreshResult).toBeNull();
  });

  test("should use custom token creation", async () => {
    // Setup custom token creation
    const customToken = "custom-token-for-testing";
    mockTokenCreation(customToken);

    // Use the JWT mock with custom token
    const token = await jwtMock.createToken({ id: "1", username: "test" });

    expect(token).toBe(customToken);
  });

  test("should use custom refresh token creation", async () => {
    // Setup custom refresh token creation
    const customRefreshToken = "custom-refresh-token-for-testing";
    mockRefreshTokenCreation(customRefreshToken);

    // Use the JWT mock with custom refresh token
    const refreshToken = await jwtMock.createRefreshToken({ id: "1", username: "test" });

    expect(refreshToken).toBe(customRefreshToken);
  });
});
