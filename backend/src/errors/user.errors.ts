import { BaseError } from "./base.errors";

export class UserAlreadyExistsError extends BaseError {
  constructor(username: string) {
    super(`User with username ${username} already exists`);
    this.name = 'UserAlreadyExistsError';
  }
}

export class UserNotFoundError extends BaseError {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`);
    this.name = 'UserNotFoundError';
  }
}

export class InvalidCredentialsError extends BaseError {
  constructor() {
    super('Invalid credentials');
    this.name = 'InvalidCredentialsError';
  }
}
