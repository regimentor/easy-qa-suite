import { gql } from "@apollo/client";

export const testCasesQuery = gql`
  query TestCases($projectId: String!) {
    testCases(projectId: $projectId) {
      createdAt
      description
      id
      postconditions
      preconditions
      priority
      projectId
      status
      title
      updatedAt
    }
  }
`;

export const createTestCaseMutation = gql`
  mutation CreateTestCase($input: CreateTestCaseInput!) {
    createTestCase(data: $input) {
      createdAt
      description
      id
      postconditions
      preconditions
      priority
      projectId
      status
      title
      updatedAt
    }
  }
`;
