import { BaseError } from "./base.errors";

export class TestCaseStatusNotFound extends BaseError {
  constructor(id: string | number | bigint) {
    super(`Test case status with ID ${id} not found`);
    this.name = "TestCaseStatusNotFound";
  }
}
