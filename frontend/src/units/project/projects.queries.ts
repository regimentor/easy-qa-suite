import { gql } from "@apollo/client";

export const projectsQuery = gql`
  query {
    projects {
      id
      key
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const createProjectMutation = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(data: $input) {
      id
      key
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const projectQuery = gql`
  query Project($id: String!) {
    project(id: $id) {
      id
      key
      name
      description
      createdAt
      updatedAt
    }
  }
`;
