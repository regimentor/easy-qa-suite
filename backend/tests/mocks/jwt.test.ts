import { mock } from "bun:test";

export type JwtMock = {
  createToken: ReturnType<typeof mock>;
  verifyToken: ReturnType<typeof mock>;
  refreshToken: ReturnType<typeof mock>;
  createRefreshToken: ReturnType<typeof mock>;
};

export const jwtMock: JwtMock = {
  createToken: mock(() => Promise.resolve("mocked-jwt-token")),
  verifyToken: mock(() => Promise.resolve({ id: "1", username: "test" })),
  refreshToken: mock(() => Promise.resolve("mocked-refreshed-token")),
  createRefreshToken: mock(() => Promise.resolve("mocked-refresh-token")),
};

export function mockJwt() {
  mock.module("../../src/jwt/jwt", () => {
    return {
      jwt: jwtMock,
    };
  });
}

// Helper function to create different token verification results
export function mockJwtVerification(
  payload: { id: string; username: string } | null = { id: "1", username: "test" }
) {
  jwtMock.verifyToken.mockImplementation(() => Promise.resolve(payload));
}

// Helper function to simulate expired token
export function mockExpiredToken() {
  jwtMock.verifyToken.mockImplementation(() => Promise.resolve(null));
  jwtMock.refreshToken.mockImplementation(() => Promise.resolve(null));
}

// Helper function to create custom token creation behavior
export function mockTokenCreation(token: string = "custom-mocked-token") {
  jwtMock.createToken.mockImplementation(() => Promise.resolve(token));
}

// Helper function to create custom refresh token creation behavior
export function mockRefreshTokenCreation(token: string = "custom-mocked-refresh-token") {
  jwtMock.createRefreshToken.mockImplementation(() => Promise.resolve(token));
}