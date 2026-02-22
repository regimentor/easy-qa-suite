import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type { TestSuiteTypeModel } from "types/graphql";

type TestSuiteTypeFields = Pick<
  TestSuiteTypeModel,
  "id" | "value" | "description" | "archived" | "createdAt" | "updatedAt"
>;

type TestSuiteTypesQueryData = { testSuiteTypes: TestSuiteTypeFields[] };
type TestSuiteTypesQueryVariables = { includeArchived?: boolean };

type TestSuiteTypeQueryData = { testSuiteType: TestSuiteTypeFields };
type TestSuiteTypeQueryVariables = { id: string };

export const testSuiteTypesQuery: TypedDocumentNode<
  TestSuiteTypesQueryData,
  TestSuiteTypesQueryVariables
> = gql`
  query TestSuiteTypes($includeArchived: Boolean) {
    testSuiteTypes(includeArchived: $includeArchived) {
      id
      value
      description
      archived
      createdAt
      updatedAt
    }
  }
`;

export const testSuiteTypeQuery: TypedDocumentNode<
  TestSuiteTypeQueryData,
  TestSuiteTypeQueryVariables
> = gql`
  query TestSuiteType($id: String!) {
    testSuiteType(id: $id) {
      id
      value
      description
      archived
      createdAt
      updatedAt
    }
  }
`;
