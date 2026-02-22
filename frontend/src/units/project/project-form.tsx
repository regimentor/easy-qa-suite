import { Button, Form, Input } from "antd";
import { useMutation } from "@apollo/client";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { createProjectMutation } from "./projects.queries";
import styles from "./project-form.module.css";

type TProjectFormValues = {
  name: string;
  key: string;
  description?: string;
};

export function ProjectForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm<TProjectFormValues>();

  const [mutate, { loading, error }] = useMutation(createProjectMutation, {
    onCompleted: (data) => {
      form.resetFields();
      navigate({
        to: "/projects/$project-key",
        params: { "project-key": data.createProject.key },
      });
    },
  });

  const handleSubmit = (values: TProjectFormValues) => {
    mutate({
      variables: {
        input: {
          name: values.name,
          key: values.key,
          description: values.description || "",
        },
      },
    });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t("project.createTitle")}</h3>
        <h4 className={styles.subtitle}>
          {t("project.createSubtitle")}
        </h4>
      </div>
      <div className={styles.formWrap}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
        >
          <Form.Item
            name="name"
            label={t("project.name")}
            rules={[{ required: true, message: t("project.nameRequired") }]}
          >
            <Input placeholder={t("project.namePlaceholder")} />
          </Form.Item>
          <Form.Item
            name="key"
            label={t("project.code")}
            rules={[{ required: true, message: t("project.codeRequired") }]}
          >
            <Input placeholder={t("project.codePlaceholder")} />
          </Form.Item>
          <Form.Item name="description" label={t("project.description")}>
            <Input.TextArea
              placeholder={t("project.descriptionPlaceholder")}
              rows={3}
            />
          </Form.Item>
          {error && (
            <div className={styles.error}>
              {error.message || t("project.createError")}
            </div>
          )}
          <Form.Item>
            <Button
              className={styles.submitBtn}
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              {t("project.createButton")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
