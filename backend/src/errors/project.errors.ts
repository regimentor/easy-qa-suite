import { BaseError } from "./base.errors";

export class ProjectNotFound extends BaseError {
  constructor(id: string | number | bigint) {
    super(`Project with id ${id} not found`);
    this.name = "ProjectNotFound";
  }
}
