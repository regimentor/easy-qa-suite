import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type { TestCasePriorityModel } from "types/graphql";

export type TestCasePriorityFields = Pick<
  TestCasePriorityModel,
  "id" | "value" | "description" | "archived" | "createdAt" | "updatedAt"
>;

type TestCasePrioritiesQueryData = { testCasePriorities: TestCasePriorityFields[] };
type TestCasePrioritiesQueryVariables = { includeArchived?: boolean };

type TestCasePriorityQueryData = { testCasePriority: TestCasePriorityFields };
type TestCasePriorityQueryVariables = { id: string };

export const testCasePrioritiesQuery: TypedDocumentNode<
  TestCasePrioritiesQueryData,
  TestCasePrioritiesQueryVariables
> = gql`
  query TestCasePriorities($includeArchived: Boolean) {
    testCasePriorities(includeArchived: $includeArchived) {
      id
      value
      description
      archived
      createdAt
      updatedAt
    }
  }
`;

export const testCasePriorityQuery: TypedDocumentNode<
  TestCasePriorityQueryData,
  TestCasePriorityQueryVariables
> = gql`
  query TestCasePriority($id: String!) {
    testCasePriority(id: $id) {
      id
      value
      description
      archived
      createdAt
      updatedAt
    }
  }
`;
