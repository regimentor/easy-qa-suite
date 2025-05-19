import { BaseError } from "./base.errors";

export class TestSuiteTypeNotFoundError extends BaseError {
  constructor(id: string) {
    super(`Test suite type with ID ${id} not found`);
    this.name = 'TestSuiteTypeNotFoundError';
  }
}
