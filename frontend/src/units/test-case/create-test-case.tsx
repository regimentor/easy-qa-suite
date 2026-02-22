import { Button, Form, Input, Segmented } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { createTestCaseMutation } from "./test-case.queries";
import {
  testCasePrioritiesQuery,
  type TestCasePriorityFields,
} from "@/units/test-case-priority/test-case-priority.queries";
import {
  testCaseStatusesQuery,
  type TestCaseStatusFields,
} from "@/units/test-case-status/test-case-status.queries";
import styles from "./create-test-case.module.css";

type TTestCaseFormValues = {
  title: string;
  description?: string;
  preconditions?: string;
  postconditions?: string;
  priorityId: string;
  statusId: string;
};

type CreateTestCaseProps = {
  projectId: string;
};

export function CreateTestCase({ projectId }: CreateTestCaseProps) {
  const navigate = useNavigate();
  const [form] = Form.useForm<TTestCaseFormValues>();

  const { data: prioritiesData } = useQuery(testCasePrioritiesQuery);
  const { data: statusesData } = useQuery(testCaseStatusesQuery);

  const priorityOptions =
    prioritiesData?.testCasePriorities.map((p: TestCasePriorityFields) => ({
      label: p.value,
      value: p.id,
    })) ?? [];
  const statusOptions =
    statusesData?.testCaseStatuses.map((s: TestCaseStatusFields) => ({
      label: s.value,
      value: s.id,
    })) ?? [];

  const [mutate, { loading, error }] = useMutation(createTestCaseMutation, {
    onCompleted: () => {
      form.resetFields();
      navigate({
        to: "/projects/$project-id",
        params: { "project-id": projectId },
        hash: "test-cases",
      });
    },
  });

  const handleSubmit = (values: TTestCaseFormValues) => {
    mutate({
      variables: {
        input: {
          title: values.title,
          description: values.description ?? "",
          preconditions: values.preconditions ?? "",
          postconditions: values.postconditions ?? "",
          priorityId: values.priorityId,
          statusId: values.statusId,
          projectId,
        },
      },
    });
  };

  const defaultPriorityId =
    prioritiesData?.testCasePriorities.find(
      (p: TestCasePriorityFields) => p.value.toUpperCase() === "MEDIUM"
    )?.id ?? prioritiesData?.testCasePriorities[0]?.id ?? "";
  const defaultStatusId =
    statusesData?.testCaseStatuses.find(
      (s: TestCaseStatusFields) => s.value.toUpperCase() === "DRAFT"
    )?.id ?? statusesData?.testCaseStatuses[0]?.id ?? "";

  useEffect(() => {
    if (defaultPriorityId || defaultStatusId) {
      form.setFieldsValue({
        priorityId: defaultPriorityId || form.getFieldValue("priorityId"),
        statusId: defaultStatusId || form.getFieldValue("statusId"),
      });
    }
  }, [defaultPriorityId, defaultStatusId, form]);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h3 className={styles.title}>Create Test Case</h3>
        <h4 className={styles.subtitle}>
          Fill in the details for the new test case
        </h4>
      </div>
      <div className={styles.formWrap}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ priorityId: "", statusId: "" }}
          className={styles.form}
        >
          <Form.Item
            name="title"
            label="Test Case Title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="Enter test case title" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea
              placeholder="Detailed description of the test case"
              rows={3}
            />
          </Form.Item>
          <Form.Item name="preconditions" label="Preconditions">
            <Input.TextArea
              placeholder="Conditions that must be met before running the test"
              rows={2}
            />
          </Form.Item>
          <Form.Item name="postconditions" label="Postconditions">
            <Input.TextArea
              placeholder="Results that should be achieved after successful test execution"
              rows={2}
            />
          </Form.Item>
          <Form.Item name="priorityId" label="Priority">
            <Segmented options={priorityOptions} block />
          </Form.Item>
          <Form.Item name="statusId" label="Status">
            <Segmented options={statusOptions} block />
          </Form.Item>
          {error && (
            <div className={styles.error}>
              {error.message ||
                "An error occurred while creating the test case"}
            </div>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.submitBtn}
              block
              loading={loading}
            >
              Create Test Case
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
