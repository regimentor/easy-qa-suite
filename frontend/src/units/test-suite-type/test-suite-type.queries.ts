import { gql } from "@apollo/client";

export const testSuiteTypesQuery = gql`
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

export const testSuiteTypeQuery = gql`
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
