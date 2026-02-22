import { Button, Form, Input } from "antd";
import { useMutation } from "@apollo/client";
import { useNavigate } from "@tanstack/react-router";
import { createProjectMutation } from "./projects.queries";
import styles from "./project-form.module.css";

type TProjectFormValues = {
  name: string;
  key: string;
  description?: string;
};

export function ProjectForm() {
  const navigate = useNavigate();
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
        <h3 className={styles.title}>Create Project</h3>
        <h4 className={styles.subtitle}>
          Fill in the details for the new project
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
            label="Project Name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Enter project name" />
          </Form.Item>
          <Form.Item
            name="key"
            label="Project Code"
            rules={[{ required: true, message: "Project code is required" }]}
          >
            <Input placeholder="Unique code (e.g., EQA)" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea
              placeholder="Brief project description"
              rows={3}
            />
          </Form.Item>
          {error && (
            <div className={styles.error}>
              {error.message || "An error occurred while creating the project"}
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
              Create Project
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
