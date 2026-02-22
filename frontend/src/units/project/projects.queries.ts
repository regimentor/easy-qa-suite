import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type { CreateProjectInput, ProjectModel } from "types/graphql";

export type ProjectFields = Pick<
  ProjectModel,
  "id" | "key" | "name" | "description" | "createdAt" | "updatedAt"
>;

type ProjectsQueryData = { projects: ProjectFields[] };
type ProjectsQueryVariables = Record<string, never>;

type ProjectQueryData = { project: ProjectFields };
type ProjectQueryVariables = { id: string };

type ProjectByKeyQueryData = { projectByKey: ProjectFields };
type ProjectByKeyQueryVariables = { key: string };

type CreateProjectMutationData = { createProject: ProjectFields };
type CreateProjectMutationVariables = { input: CreateProjectInput };

export const projectsQuery: TypedDocumentNode<
  ProjectsQueryData,
  ProjectsQueryVariables
> = gql`
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

export const createProjectMutation: TypedDocumentNode<
  CreateProjectMutationData,
  CreateProjectMutationVariables
> = gql`
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

export const projectQuery: TypedDocumentNode<
  ProjectQueryData,
  ProjectQueryVariables
> = gql`
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

export const projectByKeyQuery: TypedDocumentNode<
  ProjectByKeyQueryData,
  ProjectByKeyQueryVariables
> = gql`
  query ProjectByKey($key: String!) {
    projectByKey(key: $key) {
      id
      key
      name
      description
      createdAt
      updatedAt
    }
  }
`;
