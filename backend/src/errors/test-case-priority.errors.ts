import { BaseError } from "./base.errors";

export class TestCasePriorityNotFoundError extends BaseError {
  constructor(id: string) {
    super(`Test case priority with ID ${id} not found`);
    this.name = "TestCasePriorityNotFoundError";
  }
}
