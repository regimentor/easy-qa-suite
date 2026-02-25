import { useQuery, useMutation } from "@apollo/client";
import { Button, Card, Form, Input, Modal, Switch, Table, Tabs, message } from "antd";
import { useTranslation } from "react-i18next";
import {
  testCasePrioritiesQuery,
  createTestCasePriorityMutation,
  updateTestCasePriorityMutation,
  type TestCasePriorityFields,
} from "@/units/test-case-priority/test-case-priority.queries";
import {
  testCaseStatusesQuery,
  createTestCaseStatusMutation,
  updateTestCaseStatusMutation,
  type TestCaseStatusFields,
} from "@/units/test-case-status/test-case-status.queries";
import { ApolloError } from "@apollo/client";
import { useState } from "react";
import styles from "./project-settings.module.css";

type ProjectSettingsProps = {
  projectId: string;
};

export function ProjectSettings({ projectId }: ProjectSettingsProps) {
  const { t } = useTranslation();
  const [priorityModalOpen, setPriorityModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [editingPriority, setEditingPriority] = useState<TestCasePriorityFields | null>(null);
  const [editingStatus, setEditingStatus] = useState<TestCaseStatusFields | null>(null);

  const [priorityForm] = Form.useForm<{ value: string; description: string }>();
  const [statusForm] = Form.useForm<{ value: string; description: string }>();

  const { data: prioritiesData, refetch: refetchPriorities } = useQuery(testCasePrioritiesQuery, {
    variables: { projectId, includeArchived: true },
    skip: !projectId,
  });
  const { data: statusesData, refetch: refetchStatuses } = useQuery(testCaseStatusesQuery, {
    variables: { projectId, includeArchived: true },
    skip: !projectId,
  });

  const [createPriority, { loading: creatingPriority }] = useMutation(
    createTestCasePriorityMutation,
    {
      onCompleted: () => {
        message.success(t("common.save"));
        setPriorityModalOpen(false);
        priorityForm.resetFields();
        refetchPriorities();
      },
      onError: (err: ApolloError) => message.error(err.message),
    }
  );
  const [updatePriority, { loading: updatingPriority }] = useMutation(
    updateTestCasePriorityMutation,
    {
      onCompleted: () => {
        message.success(t("common.save"));
        setEditingPriority(null);
        priorityForm.resetFields();
        refetchPriorities();
      },
      onError: (err: ApolloError) => message.error(err.message),
    }
  );
  const [createStatus, { loading: creatingStatus }] = useMutation(createTestCaseStatusMutation, {
    onCompleted: () => {
      message.success(t("common.save"));
      setStatusModalOpen(false);
      statusForm.resetFields();
      refetchStatuses();
    },
    onError: (err: ApolloError) => message.error(err.message),
  });
  const [updateStatus, { loading: updatingStatus }] = useMutation(updateTestCaseStatusMutation, {
    onCompleted: () => {
      message.success(t("common.save"));
      setEditingStatus(null);
      statusForm.resetFields();
      refetchStatuses();
    },
    onError: (err: ApolloError) => message.error(err.message),
  });

  const priorities = prioritiesData?.testCasePriorities ?? [];
  const statuses = statusesData?.testCaseStatuses ?? [];

  const handleAddPriority = () => {
    setEditingPriority(null);
    priorityForm.resetFields();
    setPriorityModalOpen(true);
  };
  const handleEditPriority = (record: TestCasePriorityFields) => {
    setEditingPriority(record);
    priorityForm.setFieldsValue({ value: record.value, description: record.description });
    setPriorityModalOpen(true);
  };
  const handlePrioritySubmit = () => {
    priorityForm.validateFields().then((values) => {
      if (editingPriority) {
        updatePriority({
          variables: { id: editingPriority.id, input: { value: values.value, description: values.description } },
        });
      } else {
        createPriority({
          variables: {
            input: { projectId, value: values.value, description: values.description },
          },
        });
      }
    });
  };
  const handlePriorityArchived = (record: TestCasePriorityFields, archived: boolean) => {
    updatePriority({
      variables: { id: record.id, input: { archived } },
    });
  };

  const handleAddStatus = () => {
    setEditingStatus(null);
    statusForm.resetFields();
    setStatusModalOpen(true);
  };
  const handleEditStatus = (record: TestCaseStatusFields) => {
    setEditingStatus(record);
    statusForm.setFieldsValue({ value: record.value, description: record.description });
    setStatusModalOpen(true);
  };
  const handleStatusSubmit = () => {
    statusForm.validateFields().then((values) => {
      if (editingStatus) {
        updateStatus({
          variables: { id: editingStatus.id, input: { value: values.value, description: values.description } },
        });
      } else {
        createStatus({
          variables: {
            input: { projectId, value: values.value, description: values.description },
          },
        });
      }
    });
  };
  const handleStatusArchived = (record: TestCaseStatusFields, archived: boolean) => {
    updateStatus({
      variables: { id: record.id, input: { archived } },
    });
  };

  const priorityColumns = [
    { title: t("project.value"), dataIndex: "value", key: "value" },
    { title: t("project.description"), dataIndex: "description", key: "description" },
    {
      title: t("project.archived"),
      dataIndex: "archived",
      key: "archived",
      render: (_: boolean, record: TestCasePriorityFields) => (
        <Switch
          checked={record.archived}
          onChange={(checked) => handlePriorityArchived(record, checked)}
        />
      ),
    },
    {
      title: "",
      key: "actions",
      render: (_: unknown, record: TestCasePriorityFields) => (
        <Button type="link" size="small" onClick={() => handleEditPriority(record)}>
          {t("common.edit")}
        </Button>
      ),
    },
  ];
  const statusColumns = [
    { title: t("project.value"), dataIndex: "value", key: "value" },
    { title: t("project.description"), dataIndex: "description", key: "description" },
    {
      title: t("project.archived"),
      dataIndex: "archived",
      key: "archived",
      render: (_: boolean, record: TestCaseStatusFields) => (
        <Switch
          checked={record.archived}
          onChange={(checked) => handleStatusArchived(record, checked)}
        />
      ),
    },
    {
      title: "",
      key: "actions",
      render: (_: unknown, record: TestCaseStatusFields) => (
        <Button type="link" size="small" onClick={() => handleEditStatus(record)}>
          {t("common.edit")}
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t("project.settingsTitle")}</h2>
        <p className={styles.subtitle}>{t("project.settingsSubtitle")}</p>
      </div>

      <Tabs
        items={[
          {
            key: "priorities",
            label: t("project.priorities"),
            children: (
              <Card
                extra={
                  <Button type="primary" onClick={handleAddPriority}>
                    {t("project.addPriority")}
                  </Button>
                }
              >
                <Table
                  dataSource={priorities}
                  columns={priorityColumns}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            ),
          },
          {
            key: "statuses",
            label: t("project.statuses"),
            children: (
              <Card
                extra={
                  <Button type="primary" onClick={handleAddStatus}>
                    {t("project.addStatus")}
                  </Button>
                }
              >
                <Table
                  dataSource={statuses}
                  columns={statusColumns}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            ),
          },
        ]}
      />

      <Modal
        title={editingPriority ? t("common.edit") : t("project.addPriority")}
        open={priorityModalOpen}
        onOk={handlePrioritySubmit}
        onCancel={() => {
          setPriorityModalOpen(false);
          setEditingPriority(null);
        }}
        confirmLoading={creatingPriority || updatingPriority}
      >
        <Form form={priorityForm} layout="vertical">
          <Form.Item name="value" label={t("project.value")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label={t("project.description")} rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingStatus ? t("common.edit") : t("project.addStatus")}
        open={statusModalOpen}
        onOk={handleStatusSubmit}
        onCancel={() => {
          setStatusModalOpen(false);
          setEditingStatus(null);
        }}
        confirmLoading={creatingStatus || updatingStatus}
      >
        <Form form={statusForm} layout="vertical">
          <Form.Item name="value" label={t("project.value")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label={t("project.description")} rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
