import { gql } from "@apollo/client";

export const testCaseStatusesQuery = gql`
  query TestCaseStatuses($includeArchived: Boolean) {
    testCaseStatuses(includeArchived: $includeArchived) {
      id
      value
      description
      archived
      createdAt
      updatedAt
    }
  }
`;

export const testCaseStatusQuery = gql`
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
