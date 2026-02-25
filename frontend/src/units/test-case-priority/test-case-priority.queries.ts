import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type { TestCasePriorityModel } from "types/graphql";

export type TestCasePriorityFields = Pick<
  TestCasePriorityModel,
  "id" | "value" | "description" | "archived" | "createdAt" | "updatedAt"
>;

type TestCasePrioritiesQueryData = { testCasePriorities: TestCasePriorityFields[] };
type TestCasePrioritiesQueryVariables = { projectId: string; includeArchived?: boolean };

type TestCasePriorityQueryData = { testCasePriority: TestCasePriorityFields };
type TestCasePriorityQueryVariables = { id: string };

export const testCasePrioritiesQuery: TypedDocumentNode<
  TestCasePrioritiesQueryData,
  TestCasePrioritiesQueryVariables
> = gql`
  query TestCasePriorities($projectId: String!, $includeArchived: Boolean) {
    testCasePriorities(projectId: $projectId, includeArchived: $includeArchived) {
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

export const createTestCasePriorityMutation = gql`
  mutation CreateTestCasePriority($input: CreateTestCasePriorityInput!) {
    createTestCasePriority(input: $input) {
      id
      value
      description
      archived
      createdAt
      updatedAt
    }
  }
`;

export const updateTestCasePriorityMutation = gql`
  mutation UpdateTestCasePriority($id: String!, $input: UpdateTestCasePriorityInput!) {
    updateTestCasePriority(id: $id, input: $input) {
      id
      value
      description
      archived
      createdAt
      updatedAt
    }
  }
`;
