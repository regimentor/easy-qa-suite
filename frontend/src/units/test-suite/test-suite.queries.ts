import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type {
  AddTestCasesToSuiteInput,
  CreateTestSuiteInput,
  TestSuiteModel,
  TestSuiteTypeModel,
} from "types/graphql";
import type { TestCaseFields } from "@/units/test-case/test-case.queries";

type TestSuiteTypeFields = Pick<
  TestSuiteTypeModel,
  "id" | "value" | "description" | "archived" | "createdAt" | "updatedAt"
>;
export type TestSuiteFields = Pick<
  TestSuiteModel,
  "id" | "name" | "description" | "projectId" | "typeId" | "createdAt" | "updatedAt"
> & {
  type?: TestSuiteTypeFields | null;
};

export type TestSuiteDetailFields = TestSuiteFields & {
  testCases?: TestCaseFields[] | null;
};

type TestSuitesQueryData = { testSuites: TestSuiteFields[] };
type TestSuitesQueryVariables = { projectId?: string };
type CreateTestSuiteMutationData = { createTestSuite: TestSuiteFields };
type CreateTestSuiteMutationVariables = { input: CreateTestSuiteInput };
type TestSuiteQueryData = { testSuite: TestSuiteDetailFields };
type TestSuiteQueryVariables = { id: string };
type AddTestCasesToSuiteMutationData = { addTestCasesToSuite: TestSuiteDetailFields };
type AddTestCasesToSuiteMutationVariables = { data: AddTestCasesToSuiteInput };

export const testSuitesQuery: TypedDocumentNode<
  TestSuitesQueryData,
  TestSuitesQueryVariables
> = gql`
  query TestSuites($projectId: String) {
    testSuites(projectId: $projectId) {
      id
      name
      description
      projectId
      typeId
      createdAt
      updatedAt
      type {
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

export const createTestSuiteMutation: TypedDocumentNode<
  CreateTestSuiteMutationData,
  CreateTestSuiteMutationVariables
> = gql`
  mutation CreateTestSuite($input: CreateTestSuiteInput!) {
    createTestSuite(data: $input) {
      id
      name
      description
      projectId
      typeId
      createdAt
      updatedAt
      type {
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

const testCaseInSuiteFields = gql`
  fragment TestCaseInSuiteFields on TestCaseModel {
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
`;

export const testSuiteQuery: TypedDocumentNode<
  TestSuiteQueryData,
  TestSuiteQueryVariables
> = gql`
  query TestSuite($id: String!) {
    testSuite(id: $id) {
      id
      name
      description
      projectId
      typeId
      createdAt
      updatedAt
      type {
        id
        value
        description
        archived
        createdAt
        updatedAt
      }
      testCases {
        ...TestCaseInSuiteFields
      }
    }
  }
  ${testCaseInSuiteFields}
`;

export const addTestCasesToSuiteMutation: TypedDocumentNode<
  AddTestCasesToSuiteMutationData,
  AddTestCasesToSuiteMutationVariables
> = gql`
  mutation AddTestCasesToSuite($data: AddTestCasesToSuiteInput!) {
    addTestCasesToSuite(data: $data) {
      id
      name
      description
      projectId
      typeId
      createdAt
      updatedAt
      type {
        id
        value
        description
        archived
        createdAt
        updatedAt
      }
      testCases {
        ...TestCaseInSuiteFields
      }
    }
  }
  ${testCaseInSuiteFields}
`;
