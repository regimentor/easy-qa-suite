import { describe, test, expect, beforeEach, afterEach, mock } from "bun:test";
import { UserAlreadyExistsError } from "../../src/errors/user.errors";
import {
  mockUsersRepository,
  usersRepositoryMock,
  mockPasswordHashing,
} from "../mocks/users.repository.mock";
import { createMockUser, createUserInput, mockUsers } from "../mocks/user.mock";

// Setup mocks before importing the service
mockUsersRepository();

// Import the service after setting up mocks
const { userService } = await import("../../src/services/user.service");

describe("User Service", () => {
  let passwordMock: ReturnType<typeof mockPasswordHashing>;

  beforeEach(() => {
    // Reset all mocks before each test
    mock.restore();

    // Setup password hashing mock
    passwordMock = mockPasswordHashing();
  });

  afterEach(() => {
    // Restore original hashing method
    passwordMock.restoreOriginal();
  });

  describe("createUser", () => {
    test("should create a new user if username does not exist", async () => {
      // Arrange - preparation
      const userData = createUserInput();
      const mockCreatedUser = createMockUser({
        username: userData.username,
      });

      // Configure mock behavior
      usersRepositoryMock.firstFindBy.mockImplementation(() =>
        Promise.resolve(null),
      );
      usersRepositoryMock.create.mockImplementation(() =>
        Promise.resolve(mockCreatedUser),
      );

      // Act - action
      const result = await userService.createUser(userData);

      // Assert - verification
      expect(usersRepositoryMock.firstFindBy).toHaveBeenCalledWith({
        username: userData.username,
      });
      expect(passwordMock.mockHash).toHaveBeenCalledWith(userData.password, {
        algorithm: "bcrypt",
      });
      expect(usersRepositoryMock.create).toHaveBeenCalledWith({
        username: userData.username,
        password_hash: "mocked-password-hash",
      });
      expect(result).toEqual(mockCreatedUser);
    });

    test("should throw UserAlreadyExistsError if username already exists", async () => {
      // Arrange - preparation
      const userData = createUserInput({ username: "existinguser" });
      const existingUser = createMockUser({ username: userData.username });

      // Configure mock to simulate existing user
      usersRepositoryMock.firstFindBy.mockImplementation(() =>
        Promise.resolve(existingUser),
      );

      // Reset call history for create method
      usersRepositoryMock.create.mockClear();

      // Act & Assert - action and verification
      await expect(userService.createUser(userData)).rejects.toThrow(
        UserAlreadyExistsError,
      );
      expect(usersRepositoryMock.firstFindBy).toHaveBeenCalledWith({
        username: userData.username,
      });
      expect(usersRepositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe("findUsers", () => {
    test("should return all users", async () => {
      // Configure mock to return test users
      usersRepositoryMock.findBy.mockImplementation(() =>
        Promise.resolve(mockUsers),
      );

      // Act - action
      const result = await userService.findUsers();

      // Assert - verification
      expect(usersRepositoryMock.findBy).toHaveBeenCalledWith({});
      expect(result).toEqual(mockUsers);
    });
  });
});
