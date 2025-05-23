# Updated List of Functional Requirements

## 1. Test Organization
- Planning and running tests (manual and automated)
- Combining tests into test plans (test sets)

## 2. Test Documentation Management
- Storage and versioning of test case descriptions (steps, expected results)
- Grouping test cases into suites and reusing them

## 3. Test Results Tracking
- Recording execution statuses (Passed/Failed/Skipped)
- Saving logs, screenshots, and information about identified defects
- Collecting metrics: pass percentage, number of failed tests, and others

## 4. Reporting and Visualization
- Dashboards with key indicators
- Generation of reports and graphs: testing status by projects, sprint progress, quality dynamics

## 5. Integration with External Systems
- Automated testing frameworks (Selenium, JUnit, Cypress, etc.) for importing results

Below is the database schema in Markdown format.

## Database Schema

### Table projects
| Field       | Type         | Description                     |
| ----------- | ------------ | ------------------------------- |
| id          | BIGINT PK    | Project ID                      |
| name        | VARCHAR(255) | Project name                    |
| key         | VARCHAR(50)  | Unique project code             |
| description | TEXT         | Project description             |
| created_at  | TIMESTAMP    | Creation date and time          |
| updated_at  | TIMESTAMP    | Last modification date and time |

### Table test_cases
| Field          | Type         | Description                                      |
| -------------- | ------------ | ------------------------------------------------ |
| id             | BIGINT PK    | Test case ID                                     |
| project_id     | BIGINT FK    | Reference to projects.id                         |
| title          | VARCHAR(255) | Brief test case title                            |
| description    | TEXT         | Detailed description of steps and expected result|
| preconditions  | TEXT         | Preconditions (environment, data, etc.)          |
| postconditions | TEXT         | Postconditions                                   |
| priority       | VARCHAR(50)  | Priority (Low/Medium/High)                       |
| status         | VARCHAR(50)  | Status (Active/Deprecated)                       |
| created_at     | TIMESTAMP    | Creation date                                    |
| updated_at     | TIMESTAMP    | Last modification date                           |

### Table test_suites
| Field       | Type         | Description                     |
| ----------- | ------------ | ------------------------------- |
| id          | BIGINT PK    | Suite ID                        |
| project_id  | BIGINT FK    | Reference to projects.id        |
| name        | VARCHAR(255) | Suite name                      |
| description | TEXT         | Description                     |
| created_at  | TIMESTAMP    | Creation date                   |
| updated_at  | TIMESTAMP    | Last modification date          |

### Table suite_test_cases (Relation "suite ⇆ test case")
| Field        | Type                    | Description                      |
| ------------ | ----------------------- | -------------------------------- |
| suite_id     | BIGINT FK               | Reference to test_suites.id      |
| test_case_id | BIGINT FK               | Reference to test_cases.id       |
| order        | INT                     | Execution order within the suite |
| PK           | (suite_id, test_case_id)| Composite primary key            |



### Table test_results
| Field          | Type              | Description                                |
| -------------- | ----------------- | ------------------------------------------ |
| id             | BIGINT PK         | Result ID                                  |
| test_case_id   | BIGINT FK         | Reference to test_cases.id                 |
| status         | VARCHAR(50)       | Execution status (Passed/Failed/Skipped)   |
| started_at     | TIMESTAMP         | Test case execution start time             |
| finished_at    | TIMESTAMP         | Completion time                            |
| log            | TEXT              | Log text                                   |
| screenshot_url | TEXT NULL         | Screenshot URL (if available)              |
| defect_link    | VARCHAR(255) NULL | Reference link for additional information  |

### Table users
| Field         | Type         | Description                         |
| ------------- | ------------ | ----------------------------------- |
| id            | BIGINT PK    | User ID                             |
| username      | VARCHAR(100) | Username                            |
| full_name     | VARCHAR(255) | Full name                           |
| email         | VARCHAR(255) | Email address                       |
| password_hash | VARCHAR(255) | Password hash or token (if SSO)     |
| created_at    | TIMESTAMP    | Creation date                       |
| updated_at    | TIMESTAMP    | Last modification date              |




### Note
For storing large volumes of logs and screenshots, it's recommended to use object storage (S3/MinIO) and only save references in the database.