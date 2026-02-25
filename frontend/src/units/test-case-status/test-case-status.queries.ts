import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type { TestCaseStatusModel } from "types/graphql";

export type TestCaseStatusFields = Pick<
  TestCaseStatusModel,
  "id" | "value" | "description" | "archived" | "createdAt" | "updatedAt"
>;

type TestCaseStatusesQueryData = { testCaseStatuses: TestCaseStatusFields[] };
type TestCaseStatusesQueryVariables = { projectId: string; includeArchived?: boolean };

type TestCaseStatusQueryData = { testCaseStatus: TestCaseStatusFields };
type TestCaseStatusQueryVariables = { id: string };

export const testCaseStatusesQuery: TypedDocumentNode<
  TestCaseStatusesQueryData,
  TestCaseStatusesQueryVariables
> = gql`
  query TestCaseStatuses($projectId: String!, $includeArchived: Boolean) {
    testCaseStatuses(projectId: $projectId, includeArchived: $includeArchived) {
      id
      value
      description
      archived
      createdAt
      updatedAt
    }
  }
`;

export const testCaseStatusQuery: TypedDocumentNode<
  TestCaseStatusQueryData,
  TestCaseStatusQueryVariables
> = gql`
  query TestCaseStatus($id: String!) {
    testCaseStatus(id: $id) {
      id
      value
      description
      archived
      createdAt
      updatedAt
    }
  }
`;

export const createTestCaseStatusMutation = gql`
  mutation CreateTestCaseStatus($input: CreateTestCaseStatusInput!) {
    createTestCaseStatus(input: $input) {
      id
      value
      description
      archived
      createdAt
      updatedAt
    }
  }
`;

export const updateTestCaseStatusMutation = gql`
  mutation UpdateTestCaseStatus($id: String!, $input: UpdateTestCaseStatusInput!) {
    updateTestCaseStatus(id: $id, input: $input) {
      id
      value
      description
      archived
      createdAt
      updatedAt
    }
  }
`;
