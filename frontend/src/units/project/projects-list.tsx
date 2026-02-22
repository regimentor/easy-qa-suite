import { useQuery } from "@apollo/client";
import { projectsQuery } from "./projects.queries";
import type { ProjectFields } from "./projects.queries";
import type React from "react";
import { Button, Input } from "antd";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import { ClockIcon } from "@/components/icons/ClockIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { ErrorIcon } from "@/components/icons/ErrorIcon";
import { EmptyStateIcon } from "@/components/icons/EmptyStateIcon";
import { useNavigate } from "@tanstack/react-router";
import { formatDate } from "@/lib/format-date";
import styles from "./projects-list.module.css";

type TProjectSmallCardProps = {
  project: ProjectFields;
};

const ProjectSmallCard: React.FC<TProjectSmallCardProps> = ({ project }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate({
      to: "/projects/$project-key",
      params: { "project-key": project.key },
    });
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.cardInner}>
        <div className={styles.cardRow}>
          <div className={styles.cardKeyWrap}>
            <span className={styles.cardKey}>{project.key}</span>
          </div>
          <div className={styles.cardBody}>
            <h3 className={styles.cardName}>{project.name}</h3>
            {project.description && (
              <p className={styles.cardDesc}>{project.description}</p>
            )}
          </div>
        </div>
        <div className={styles.cardMeta}>
          <div className={styles.cardMetaItem}>
            <CalendarIcon />
            <span>Created: {formatDate(project.createdAt)}</span>
          </div>
          <div className={styles.cardMetaItem}>
            <ClockIcon />
            <span>Updated: {formatDate(project.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProjectsList: React.FC<{ listType?: "small" | "large" }> = () => {
  const { data, loading, error } = useQuery(projectsQuery);
  const navigate = useNavigate();

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>Projects</h1>
          <p className={styles.headerSub}>Manage your testing projects</p>
        </div>
        <Button type="primary" onClick={() => navigate({ to: "/projects/create" })}>
          <PlusIcon className={styles.iconMr + " " + styles.iconSize} />
          New Project
        </Button>
      </div>

      <div className={styles.searchWrap}>
        <Input
          placeholder="Search projects..."
          prefix={<SearchIcon className={styles.iconSize} />}
        />
      </div>

      <div className={styles.content}>
        {loading && (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
          </div>
        )}

        {error && (
          <div className={styles.errorWrap}>
            <ErrorIcon className={styles.errorIcon} />
            <p className={styles.errorText}>Error: {error.message}</p>
          </div>
        )}

        {data && data.projects.length === 0 && (
          <div className={styles.emptyWrap}>
            <EmptyStateIcon className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No projects found</h3>
            <p className={styles.emptySub}>
              Get started by creating a new project.
            </p>
            <div className={styles.emptyBtnWrap}>
              <Button
                type="primary"
                onClick={() => navigate({ to: "/projects/create" })}
              >
                <PlusIcon className={styles.iconMr + " " + styles.iconSize} />
                New Project
              </Button>
            </div>
          </div>
        )}

        {data && data.projects.length > 0 && (
          <div className={styles.list}>
            {data.projects.map((project) => (
              <div key={project.id} className={styles.listItem}>
                <ProjectSmallCard project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
