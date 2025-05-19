import { gql } from "@apollo/client";

export const testCasePrioritiesQuery = gql`
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

export const testCasePriorityQuery = gql`
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
