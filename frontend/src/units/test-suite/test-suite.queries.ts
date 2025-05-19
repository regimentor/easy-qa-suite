import { gql } from "@apollo/client";

export const testSuitesQuery = gql`
  query TestSuites($projectId: String!) {
    testSuites(projectId: $projectId) {
      id
      name
      description
      type
      createdAt
      updatedAt
      projectId
    }
  }
`;

export const createTestSuiteMutation = gql`
  mutation CreateTestSuite($input: CreateTestSuiteInput!) {
    createTestSuite(data: $input) {
      id
      name
      description
      type
      createdAt
      updatedAt
      projectId
    }
  }
`;
