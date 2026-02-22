import { useQuery } from "@apollo/client";
import { projectQuery } from "./projects.queries";
import type React from "react";
import { useTranslation } from "react-i18next";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import { ClockIcon } from "@/components/icons/ClockIcon";
import { DateTime } from "luxon";
import styles from "./project-details.module.css";

type TProjectDetails = {
  id: string;
};

export const ProjectDetails: React.FC<TProjectDetails> = ({ id }) => {
  const { t } = useTranslation();
  const { data, loading, error } = useQuery(projectQuery, {
    variables: { id },
  });

  const formatDate = (dateString: string) => {
    return DateTime.fromISO(dateString).toFormat("d MMM yyyy");
  };

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
        <div className={styles.row}>
          <div className={styles.keyWrap}>
            <span className={styles.key}>{project.key}</span>
          </div>
          <div className={styles.body}>
            <h1 className={styles.title}>{project.name}</h1>
            {project.description && (
              <p className={styles.desc}>{project.description}</p>
            )}
          </div>
        </div>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <CalendarIcon />
            <span>{t("project.created")}: {formatDate(project.createdAt)}</span>
          </div>
          <div className={styles.metaItem}>
            <ClockIcon />
            <span>{t("project.updated")}: {formatDate(project.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
