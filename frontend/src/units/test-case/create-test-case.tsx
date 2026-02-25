import { Button, Form, Input, Segmented } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  projectKey: string;
};

export function CreateTestCase({ projectId, projectKey }: CreateTestCaseProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm<TTestCaseFormValues>();

  const { data: prioritiesData } = useQuery(testCasePrioritiesQuery, {
    variables: { projectId, includeArchived: false },
    skip: !projectId,
  });
  const { data: statusesData } = useQuery(testCaseStatusesQuery, {
    variables: { projectId, includeArchived: false },
    skip: !projectId,
  });

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
        to: "/projects/$project-key",
        params: { "project-key": projectKey },
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
        <h3 className={styles.title}>{t("testCase.createTitle")}</h3>
        <h4 className={styles.subtitle}>
          {t("testCase.createSubtitle")}
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
            label={t("testCase.title")}
            rules={[{ required: true, message: t("testCase.titleRequired") }]}
          >
            <Input placeholder={t("testCase.titlePlaceholder")} />
          </Form.Item>
          <Form.Item name="description" label={t("project.description")}>
            <Input.TextArea
              placeholder={t("testCase.descriptionPlaceholder")}
              rows={3}
            />
          </Form.Item>
          <Form.Item name="preconditions" label={t("testCase.preconditions")}>
            <Input.TextArea
              placeholder={t("testCase.preconditionsPlaceholder")}
              rows={2}
            />
          </Form.Item>
          <Form.Item name="postconditions" label={t("testCase.postconditions")}>
            <Input.TextArea
              placeholder={t("testCase.postconditionsPlaceholder")}
              rows={2}
            />
          </Form.Item>
          <Form.Item name="priorityId" label={t("testCase.priority")}>
            <Segmented options={priorityOptions} block />
          </Form.Item>
          <Form.Item name="statusId" label={t("testCase.status")}>
            <Segmented options={statusOptions} block />
          </Form.Item>
          {error && (
            <div className={styles.error}>
              {error.message || t("testCase.createError")}
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
              {t("testCase.createButton")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
