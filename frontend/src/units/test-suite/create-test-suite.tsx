import { Button, Form, Input, Segmented } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { createTestSuiteMutation } from "./test-suite.queries";
import { testSuiteTypesQuery } from "@/units/test-suite-type/test-suite-type.queries";
import styles from "./create-test-suite.module.css";

type TTestSuiteFormValues = {
  name: string;
  description?: string;
  typeId: string;
};

type CreateTestSuiteProps = {
  projectId: string;
  projectKey: string;
};

export function CreateTestSuite({ projectId, projectKey }: CreateTestSuiteProps) {
  const navigate = useNavigate();
  const [form] = Form.useForm<TTestSuiteFormValues>();

  const { data: typesData } = useQuery(testSuiteTypesQuery);

  const typeOptions =
    typesData?.testSuiteTypes.map((t) => ({
      label: t.value,
      value: t.id,
    })) ?? [];

  const [mutate, { loading, error }] = useMutation(createTestSuiteMutation, {
    onCompleted: () => {
      form.resetFields();
      navigate({
        to: "/projects/$project-key",
        params: { "project-key": projectKey },
        hash: "test-suites",
      });
    },
  });

  const handleSubmit = (values: TTestSuiteFormValues) => {
    mutate({
      variables: {
        input: {
          name: values.name,
          description: values.description ?? "",
          typeId: values.typeId,
          projectId,
        },
      },
    });
  };

  const defaultTypeId =
    typesData?.testSuiteTypes.find(
      (t) => t.value.toUpperCase() === "FUNCTIONAL"
    )?.id ?? typesData?.testSuiteTypes[0]?.id ?? "";

  useEffect(() => {
    if (defaultTypeId) {
      form.setFieldsValue({ typeId: defaultTypeId });
    }
  }, [defaultTypeId, form]);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h3 className={styles.title}>Create Test Suite</h3>
        <h4 className={styles.subtitle}>
          Fill in the details for the new test suite
        </h4>
      </div>
      <div className={styles.formWrap}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ typeId: "" }}
          className={styles.form}
        >
          <Form.Item
            name="name"
            label="Test Suite Name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Enter test suite name" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea
              placeholder="Detailed description of the test suite"
              rows={3}
            />
          </Form.Item>
          <Form.Item name="typeId" label="Type">
            <Segmented options={typeOptions} block />
          </Form.Item>
          {error && (
            <div className={styles.error}>
              {error.message ||
                "An error occurred while creating the test suite"}
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
              Create Test Suite
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
