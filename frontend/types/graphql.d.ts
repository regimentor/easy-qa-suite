export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: any; output: any; }
};

export type AddTestCasesToSuiteInput = {
  suiteId: Scalars['String']['input'];
  testCaseIds: Array<Scalars['String']['input']>;
};

export type CreateProjectInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateTestCaseInput = {
  description: Scalars['String']['input'];
  postconditions?: InputMaybe<Scalars['String']['input']>;
  preconditions?: InputMaybe<Scalars['String']['input']>;
  priority: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  status: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateTestResultInput = {
  defectLink?: InputMaybe<Scalars['String']['input']>;
  finishedAt: Scalars['DateTimeISO']['input'];
  log: Scalars['String']['input'];
  screenshotUrl?: InputMaybe<Scalars['String']['input']>;
  startedAt: Scalars['DateTimeISO']['input'];
  status: Scalars['String']['input'];
  testCaseId: Scalars['String']['input'];
};

export type CreateTestSuiteInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type CreateUserInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addTestCasesToSuite: TestSuiteModel;
  createProject: ProjectModel;
  createTestCase: TestCaseModel;
  createTestResult: TestResultModel;
  createTestSuite: TestSuiteModel;
  createUser: UserModel;
};


export type MutationAddTestCasesToSuiteArgs = {
  data: AddTestCasesToSuiteInput;
};


export type MutationCreateProjectArgs = {
  data: CreateProjectInput;
};


export type MutationCreateTestCaseArgs = {
  data: CreateTestCaseInput;
};


export type MutationCreateTestResultArgs = {
  data: CreateTestResultInput;
};


export type MutationCreateTestSuiteArgs = {
  data: CreateTestSuiteInput;
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};

export type ProjectModel = {
  __typename?: 'ProjectModel';
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type Query = {
  __typename?: 'Query';
  projects: Array<ProjectModel>;
  testCases: Array<TestCaseModel>;
  testResults: Array<TestResultModel>;
  testSuite: TestSuiteModel;
  testSuites: Array<TestSuiteModel>;
  users: Array<UserModel>;
};


export type QueryTestSuiteArgs = {
  id: Scalars['String']['input'];
};

export type TestCaseModel = {
  __typename?: 'TestCaseModel';
  createdAt: Scalars['DateTimeISO']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  postconditions?: Maybe<Scalars['String']['output']>;
  preconditions?: Maybe<Scalars['String']['output']>;
  priority: Scalars['String']['output'];
  projectId: Scalars['String']['output'];
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type TestResultModel = {
  __typename?: 'TestResultModel';
  defectLink?: Maybe<Scalars['String']['output']>;
  finishedAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  log: Scalars['String']['output'];
  screenshotUrl?: Maybe<Scalars['String']['output']>;
  startedAt: Scalars['DateTimeISO']['output'];
  status: Scalars['String']['output'];
  testCaseId: Scalars['String']['output'];
};

export type TestSuiteModel = {
  __typename?: 'TestSuiteModel';
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  projectId: Scalars['String']['output'];
  testCases?: Maybe<Array<TestCaseModel>>;
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type UserModel = {
  __typename?: 'UserModel';
  createdAt: Scalars['DateTimeISO']['output'];
  email?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  username: Scalars['String']['output'];
};
