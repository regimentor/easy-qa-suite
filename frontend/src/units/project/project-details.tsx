import { useQuery } from "@apollo/client";
import { Link } from "@tanstack/react-router";
import { projectQuery } from "./projects.queries";
import type React from "react";
import { useTranslation } from "react-i18next";
import { SettingOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import styles from "./project-details.module.css";

type TProjectDetails = {
  id: string;
  projectKey?: string;
};

export const ProjectDetails: React.FC<TProjectDetails> = ({ id, projectKey }) => {
  const { t } = useTranslation();
  const { data, loading, error } = useQuery(projectQuery, {
    variables: { id },
  });

  if (loading)
    return <div className={styles.loading}>Loading project details...</div>;
  if (error)
    return (
      <div className={styles.error}>
        Error loading project: {error.message}
      </div>
    );
  if (!data?.project)
    return <div className={styles.notFound}>Project not found</div>;

  const project = data.project;

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <Space orientation="vertical" size="small" style={{ width: "100%" }}>
          <div className={styles.header}>
            <Space size="small" className={styles.mainLine} wrap={false}>
              <Typography.Text strong>{project.key}</Typography.Text>
              <Typography.Text type="secondary">·</Typography.Text>
              <Typography.Text strong>{project.name}</Typography.Text>
              {project.description && (
                <>
                  <Typography.Text type="secondary">·</Typography.Text>
                  <Typography.Text ellipsis className={styles.desc}>
                    {project.description}
                  </Typography.Text>
                </>
              )}
            </Space>
            {projectKey && (
              <Link
                to="/projects/$project-key/settings"
                params={{ "project-key": projectKey }}
                className={styles.settingsLink}
                title={t("project.settings")}
              >
                <SettingOutlined />
              </Link>
            )}
          </div>
        </Space>
      </div>
    </div>
  );
};
