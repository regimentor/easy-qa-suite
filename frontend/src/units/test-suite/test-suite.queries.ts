import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type {
  CreateTestSuiteInput,
  TestSuiteModel,
  TestSuiteTypeModel,
} from "types/graphql";

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

type TestSuitesQueryData = { testSuites: TestSuiteFields[] };
type TestSuitesQueryVariables = { projectId?: string };
type CreateTestSuiteMutationData = { createTestSuite: TestSuiteFields };
type CreateTestSuiteMutationVariables = { input: CreateTestSuiteInput };

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
