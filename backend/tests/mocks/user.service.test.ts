import { mock } from "bun:test";
import type { User } from "@prisma/client";
import { createMockUser } from "./user.test";

export type UserServiceMock = {
  createUser: ReturnType<typeof mock>;
  findUsers: ReturnType<typeof mock>;
  userExists: ReturnType<typeof mock>;
  verifyUserPassword: ReturnType<typeof mock>;
};

export const userServiceMock: UserServiceMock = {
  createUser: mock(() => Promise.resolve(createMockUser())),
  findUsers: mock(() => Promise.resolve([])),
  userExists: mock(() => Promise.resolve(false)),
  verifyUserPassword: mock(() => Promise.resolve(false)),
};

export function mockUserService() {
  mock.module("../../src/services/user.service", () => {
    return {
      userService: userServiceMock,
    };
  });
}

// Helper function to mock successful user creation
export function mockUserCreationSuccess(userData: Partial<User> = {}) {
  const mockUser = createMockUser(userData);
  userServiceMock.createUser.mockImplementation(() => Promise.resolve(mockUser));
  return mockUser;
}

// Helper function to mock user creation failure with specific error
export function mockUserCreationFailure(error: Error) {
  userServiceMock.createUser.mockImplementation(() => Promise.reject(error));
}

// Helper function to mock user existence check
export function mockUserExistence(exists: boolean = true) {
  userServiceMock.userExists.mockImplementation(() => Promise.resolve(exists));
}

// Helper function to mock successful password verification
export function mockPasswordVerificationSuccess() {
  userServiceMock.verifyUserPassword.mockImplementation(() => Promise.resolve(true));
}

// Helper function to mock failed password verification
export function mockPasswordVerificationFailure() {
  userServiceMock.verifyUserPassword.mockImplementation(() => Promise.resolve(false));
}

// Helper function to mock finding multiple users
export function mockFindUsers(users: User[] = []) {
  userServiceMock.findUsers.mockImplementation(() => Promise.resolve(users));
}
