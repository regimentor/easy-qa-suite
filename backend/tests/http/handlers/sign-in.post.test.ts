import { describe, test, expect, mock, beforeEach } from "bun:test";

// Mock dependencies
import { mockJwt, jwtMock } from "../../mocks/jwt.test";
import { mockUserService, userServiceMock } from "../../mocks/user.service.test";

mockJwt();
mockUserService();

// Import the handler after mocking dependencies
const { signInPost } = await import("../../../src/http/handlers/sign-in.post");

describe("signInPost handler", () => {
  beforeEach(() => {
    // Reset all mocks
    jwtMock.createToken.mockReset();
    jwtMock.createRefreshToken.mockReset();
    userServiceMock.userExists.mockReset();
    userServiceMock.verifyUserPassword.mockReset();

    // Default implementations
    jwtMock.createToken.mockImplementation(() => Promise.resolve("mocked-access-token"));
    jwtMock.createRefreshToken.mockImplementation(() => Promise.resolve("mocked-refresh-token"));
    userServiceMock.userExists.mockImplementation(() => Promise.resolve(true));
    userServiceMock.verifyUserPassword.mockImplementation(() => Promise.resolve(true));
  });

  test("should return 400 for invalid request body", async () => {
    // Create a simple mock request with invalid body (missing password)
    const mockReq = {
      json: mock(() => Promise.resolve({ username: "testuser" })),
    };

    // Act
    const response = await signInPost({ req: mockReq as any, ctx: {} });

    // Assert
    expect(response.status).toBe(400);
    expect(userServiceMock.userExists).not.toHaveBeenCalled();
    expect(userServiceMock.verifyUserPassword).not.toHaveBeenCalled();
  });

  test("should return 400 if user does not exist", async () => {
    // Create a simple mock request with valid body
    const mockReq = {
      json: mock(() => Promise.resolve({
        username: "nonexistentuser",
        password: "password123"
      })),
    };

    // Configure mock to simulate user not existing
    userServiceMock.userExists.mockImplementation(() => Promise.resolve(false));

    // Act
    const response = await signInPost({ req: mockReq as any, ctx: {} });

    // Assert
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      message: "User does not exist"
    });
    expect(userServiceMock.userExists).toHaveBeenCalledWith("nonexistentuser");
    expect(userServiceMock.verifyUserPassword).not.toHaveBeenCalled();
    expect(jwtMock.createToken).not.toHaveBeenCalled();
  });

  test("should return 400 for invalid password", async () => {
    // Create a simple mock request with valid body
    const mockReq = {
      json: mock(() => Promise.resolve({
        username: "testuser",
        password: "wrongpassword"
      })),
    };

    // User exists but password is wrong
    userServiceMock.userExists.mockImplementation(() => Promise.resolve(true));
    userServiceMock.verifyUserPassword.mockImplementation(() => Promise.resolve(false));

    // Act
    const response = await signInPost({ req: mockReq as any, ctx: {} });

    // Assert
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      message: "Invalid password"
    });
    expect(userServiceMock.userExists).toHaveBeenCalledWith("testuser");
    expect(userServiceMock.verifyUserPassword).toHaveBeenCalledWith("testuser", "wrongpassword");
    expect(jwtMock.createToken).not.toHaveBeenCalled();
  });

  test("should return 200 with tokens for valid credentials", async () => {
    // Arrange
    const username = "testuser";
    const password = "correctpassword";

    // Create a simple mock request with valid body
    const mockReq = {
      json: mock(() => Promise.resolve({ username, password })),
    };

    // Act
    const response = await signInPost({ req: mockReq as any, ctx: {} });

    // Assert
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      token: "mocked-access-token",
      refreshToken: "mocked-refresh-token"
    });
    expect(userServiceMock.userExists).toHaveBeenCalledWith(username);
    expect(userServiceMock.verifyUserPassword).toHaveBeenCalledWith(username, password);
    expect(jwtMock.createToken).toHaveBeenCalledWith({
      id: username,
      username
    });
    expect(jwtMock.createRefreshToken).toHaveBeenCalledWith({
      id: username,
      username
    });
  });
});
