import { Button, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Link } from "@tanstack/react-router";
import type { TestCaseFields } from "./test-case.queries";

type TTranslate = (key: string) => string;

export function getTestCasesColumns(
  t: TTranslate,
  projectKey: string,
  setEditingCase: (record: TestCaseFields | null) => void,
  styles: Record<"tagCell" | "titleLink" | "actionBtn", string>
): ColumnsType<TestCaseFields> {
  return [
    {
      title: t("testCase.priority"),
      dataIndex: ["priority", "value"],
      key: "priority",
      width: 120,
      render: (value: string) => (
        <span className={styles.tagCell}>
          {value ? <Tag>{value}</Tag> : "—"}
        </span>
      ),
    },
    {
      title: t("testCase.status"),
      dataIndex: ["status", "value"],
      key: "status",
      width: 120,
      render: (value: string) => (
        <span className={styles.tagCell}>
          {value ? <Tag>{value}</Tag> : "—"}
        </span>
      ),
    },
    {
      title: t("testCase.title"),
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (title: string, record) => (
        <Link
          to="/projects/$project-key/test-cases/$case-id"
          params={{ "project-key": projectKey, "case-id": record.id }}
          className={styles.titleLink}
        >
          {title}
        </Link>
      ),
    },
    {
      title: "",
      key: "action",
      width: 72,
      align: "center",
      render: (_, record) => (
        <Button
          type="text"
          size="small"
          icon={<EditOutlined />}
          title={t("common.edit")}
          onClick={(e) => {
            e.stopPropagation();
            setEditingCase(record);
          }}
          className={styles.actionBtn}
        />
      ),
    },
  ];
}
