import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type {
  CreateTestCaseInput,
  TestCaseModel,
  TestCasePriorityModel,
  TestCaseStatusModel,
} from "types/graphql";

type TestCasePriorityFields = Pick<
  TestCasePriorityModel,
  "id" | "value" | "description" | "archived" | "createdAt" | "updatedAt"
>;
type TestCaseStatusFields = Pick<
  TestCaseStatusModel,
  "id" | "value" | "description" | "archived" | "createdAt" | "updatedAt"
>;
export type TestCaseFields = Pick<
  TestCaseModel,
  | "id"
  | "title"
  | "description"
  | "preconditions"
  | "postconditions"
  | "projectId"
  | "priorityId"
  | "statusId"
  | "createdAt"
  | "updatedAt"
> & {
  priority?: TestCasePriorityFields | null;
  status?: TestCaseStatusFields | null;
};

type TestCasesQueryData = { testCases: TestCaseFields[] };
type TestCasesQueryVariables = {
  projectId: string;
  testSuiteId?: string | null;
};
type TestCaseQueryData = { testCase: TestCaseFields };
type TestCaseQueryVariables = { id: string };
type CreateTestCaseMutationData = { createTestCase: TestCaseFields };
type CreateTestCaseMutationVariables = { input: CreateTestCaseInput };

export const testCasesQuery: TypedDocumentNode<
  TestCasesQueryData,
  TestCasesQueryVariables
> = gql`
  query TestCases($projectId: String!, $testSuiteId: String) {
    testCases(projectId: $projectId, testSuiteId: $testSuiteId) {
      id
      title
      description
      preconditions
      postconditions
      projectId
      priorityId
      statusId
      createdAt
      updatedAt
      status {
        id
        value
        description
        archived
        createdAt
        updatedAt
      }
      priority {
        id
        value
        description
        archived
        createdAt
        updatedAt
      }
    }
  }
`;

export const testCaseQuery: TypedDocumentNode<
  TestCaseQueryData,
  TestCaseQueryVariables
> = gql`
  query TestCase($id: String!) {
    testCase(id: $id) {
      id
      title
      description
      preconditions
      postconditions
      projectId
      priorityId
      statusId
      createdAt
      updatedAt
      status {
        id
        value
        description
        archived
        createdAt
        updatedAt
      }
      priority {
        id
        value
        description
        archived
        createdAt
        updatedAt
      }
    }
  }
`;

export const createTestCaseMutation: TypedDocumentNode<
  CreateTestCaseMutationData,
  CreateTestCaseMutationVariables
> = gql`
  mutation CreateTestCase($input: CreateTestCaseInput!) {
    createTestCase(data: $input) {
      id
      title
      description
      preconditions
      postconditions
      projectId
      priorityId
      statusId
      createdAt
      updatedAt
      status {
        id
        value
        description
        archived
        createdAt
        updatedAt
      }
      priority {
        id
        value
        description
        archived
        createdAt
        updatedAt
      }
    }
  }
`;
