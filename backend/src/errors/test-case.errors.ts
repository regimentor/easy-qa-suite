import { BaseError } from "./base.errors";

export class TestCaseNotFoundError extends BaseError {
  constructor(testCaseId: string) {
    super(`Test case with ID ${testCaseId} not found`);
    this.name = "TestCaseNotFoundError";
  }
}
