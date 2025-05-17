import { describe, test, expect, mock, beforeEach } from "bun:test";

// Mock dependencies
import { mockJwt, jwtMock } from "../../mocks/jwt.test";

mockJwt();

// Import the handler after mocking dependencies
const { refreshTokenPost } = await import("../../../src/http/handlers/refresh-token.post");

describe("refreshTokenPost handler", () => {
  beforeEach(() => {
    // Reset all mocks
    jwtMock.verifyToken.mockReset();
    jwtMock.createToken.mockReset();
    jwtMock.createRefreshToken.mockReset();

    // Default implementations
    jwtMock.verifyToken.mockImplementation(() =>
      Promise.resolve({ id: "1", username: "testuser" })
    );
    jwtMock.createToken.mockImplementation(() =>
      Promise.resolve("mocked-new-access-token")
    );
    jwtMock.createRefreshToken.mockImplementation(() =>
      Promise.resolve("mocked-new-refresh-token")
    );
  });

  test("should return 400 for invalid request body", async () => {
    // Create a simple mock request with invalid body (missing refreshToken)
    const mockReq = {
      json: mock(() => Promise.resolve({})),
    };

    // Act
    const response = await refreshTokenPost({ req: mockReq as any, ctx: {} });

    // Assert
    expect(response.status).toBe(400);
    expect(response.data.error).toEqual("Invalid request");
    expect(jwtMock.verifyToken).not.toHaveBeenCalled();
  });

  test("should return 401 for invalid refresh token", async () => {
    // Create a simple mock request with invalid token
    const mockReq = {
      json: mock(() => Promise.resolve({
        refreshToken: "invalid-refresh-token"
      })),
    };

    // Configure mocks to simulate invalid token
    jwtMock.verifyToken.mockImplementation(() => Promise.resolve(null));

    // Act
    const response = await refreshTokenPost({ req: mockReq as any, ctx: {} });

    // Assert
    expect(response.status).toBe(401);
    expect(response.data).toEqual({
      error: "Invalid refresh token"
    });
    expect(jwtMock.verifyToken).toHaveBeenCalledWith("invalid-refresh-token");
    expect(jwtMock.createToken).not.toHaveBeenCalled();
    expect(jwtMock.createRefreshToken).not.toHaveBeenCalled();
  });

  test("should return 200 with new tokens for valid refresh token", async () => {
    // Arrange
    const validRefreshToken = "valid-refresh-token";
    const userClaims = { id: "1", username: "testuser" };

    // Create a simple mock request with valid token
    const mockReq = {
      json: mock(() => Promise.resolve({
        refreshToken: validRefreshToken
      })),
    };

    // Configure mocks to simulate valid token
    jwtMock.verifyToken.mockImplementation(() => Promise.resolve(userClaims));

    // Act
    const response = await refreshTokenPost({ req: mockReq as any, ctx: {} });

    // Assert
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      accessToken: "mocked-new-access-token",
      refreshToken: "mocked-new-refresh-token"
    });
    expect(jwtMock.verifyToken).toHaveBeenCalledWith(validRefreshToken);
    expect(jwtMock.createToken).toHaveBeenCalledWith(userClaims);
    expect(jwtMock.createRefreshToken).toHaveBeenCalledWith(userClaims);
  });

  test("should handle expired refresh tokens", async () => {
    // Arrange
    const expiredRefreshToken = "expired-refresh-token";

    // Create a simple mock request with expired token
    const mockReq = {
      json: mock(() => Promise.resolve({
        refreshToken: expiredRefreshToken
      })),
    };

    // Configure mocks to simulate expired token
    jwtMock.verifyToken.mockImplementation(() => Promise.resolve(null));

    // Act
    const response = await refreshTokenPost({ req: mockReq as any, ctx: {} });

    // Assert
    expect(response.status).toBe(401);
    expect(response.data).toEqual({
      error: "Invalid refresh token"
    });
    expect(jwtMock.verifyToken).toHaveBeenCalledWith(expiredRefreshToken);
    expect(jwtMock.createToken).not.toHaveBeenCalled();
    expect(jwtMock.createRefreshToken).not.toHaveBeenCalled();
  });
});
