import { BaseError } from "./base.errors";

export class TestSuiteNotFoundError extends BaseError {
  constructor(suiteId: string) {
    super(`Test suite with ID ${suiteId} not found`);
    this.name = 'TestSuiteNotFoundError';
  }
}

export class InvalidTestSuiteIdError extends BaseError {
  constructor(suiteId: string) {
    super(`Invalid test suite ID: ${suiteId}`);
    this.name = 'InvalidTestSuiteIdError';
  }
}

export class TestSuiteCasesUpdateError extends BaseError {
  constructor(suiteId: string) {
    super(`Failed to retrieve test suite with ID ${suiteId} after adding test cases`);
    this.name = 'TestSuiteCasesUpdateError';
  }
}
