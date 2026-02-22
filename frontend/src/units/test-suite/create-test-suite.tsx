import { Button, Form, Input, Segmented } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
        <h3 className={styles.title}>{t("testSuite.createTitle")}</h3>
        <h4 className={styles.subtitle}>
          {t("testSuite.createSubtitle")}
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
            label={t("testSuite.name")}
            rules={[{ required: true, message: t("testSuite.nameRequired") }]}
          >
            <Input placeholder={t("testSuite.namePlaceholder")} />
          </Form.Item>
          <Form.Item name="description" label={t("project.description")}>
            <Input.TextArea
              placeholder={t("testSuite.descriptionPlaceholder")}
              rows={3}
            />
          </Form.Item>
          <Form.Item name="typeId" label={t("testSuite.type")}>
            <Segmented options={typeOptions} block />
          </Form.Item>
          {error && (
            <div className={styles.error}>
              {error.message || t("testSuite.createError")}
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
              {t("testSuite.createButton")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
