import { useQuery } from "@apollo/client";
import { testSuitesQuery } from "./test-suite.queries";
import type React from "react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input, Select } from "antd";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { ErrorIcon } from "@/components/icons/ErrorIcon";
import { EmptyStateIcon } from "@/components/icons/EmptyStateIcon";
import { useNavigate } from "@tanstack/react-router";
import { TEST_SUITE_TYPES } from "./const";
import { TestSuiteCard } from "./test-suite-card";
import styles from "./test-suite-list.module.css";

type TTestSuiteListProps = {
  projectId: string;
  projectKey: string;
  selectedSuiteId?: string | null;
  onSuiteSelect?: (suiteId: string | null) => void;
};

const getTypeOptions = (t: (key: string) => string) =>
  TEST_SUITE_TYPES.map((type) => ({
    label: type === "All" ? t("common.all") : type,
    value: type,
  }));

export const TestSuiteList: React.FC<TTestSuiteListProps> = ({
  projectId,
  projectKey,
  selectedSuiteId,
  onSuiteSelect,
}) => {
  const isSelectable = typeof onSuiteSelect === "function";
  const { data, loading, error } = useQuery(testSuitesQuery, {
    variables: { projectId },
  });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const typeOptions = getTypeOptions(t);

  const filteredTestSuites = useMemo(() => {
    if (!data?.testSuites) return [];
    return data.testSuites.filter((testSuite) => {
      const matchesSearch = testSuite.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        selectedType.toLowerCase() === "all" ||
        (testSuite.type?.value?.toLowerCase() ?? "") ===
          selectedType.toLowerCase();
      return matchesSearch && matchesType;
    });
  }, [data?.testSuites, searchQuery, selectedType]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>{t("testSuite.listTitle")}</h1>
        <Button
          type="primary"
          icon={<PlusIcon className={styles.iconSize} />}
          title={t("testSuite.newTestSuite")}
          onClick={() =>
            navigate({
              to: "/projects/$project-key/test-suites/create",
              params: { "project-key": projectKey },
            })
          }
        />
      </div>

      <div className={styles.filters}>
        <Input
          placeholder={t("testSuite.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e)}
          prefix={<SearchIcon className={styles.searchIcon} />}
          className={styles.searchInput}
        />
        <Select
          value={selectedType}
          onChange={setSelectedType}
          options={typeOptions}
          className={styles.typeSelect}
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
            <p className={styles.errorText}>{t("common.error")}: {error.message}</p>
          </div>
        )}

        {data && data.testSuites.length === 0 && (
          <div className={styles.emptyWrap}>
            <EmptyStateIcon className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>{t("testSuite.noSuites")}</h3>
            <p className={styles.emptySub}>
              {t("testSuite.noSuitesHint")}
            </p>
            <div className={styles.emptyBtnWrap}>
              <Button
                type="primary"
                onClick={() =>
                  navigate({
                    to: "/projects/$project-key/test-suites/create",
                    params: { "project-key": projectKey },
                  })
                }
              >
                <PlusIcon className={styles.iconSize} />
                {t("testSuite.newTestSuite")}
              </Button>
            </div>
          </div>
        )}

        {data &&
          data.testSuites.length > 0 &&
          filteredTestSuites.length === 0 && (
            <div className={styles.emptyWrap}>
              <EmptyStateIcon className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>{t("testSuite.noMatching")}</h3>
              <p className={styles.emptySub}>
                {t("testSuite.noMatchingHint")}
              </p>
            </div>
          )}

        {data &&
          data.testSuites.length > 0 &&
          filteredTestSuites.length > 0 && (
            <div className={styles.list}>
              {filteredTestSuites.map((testSuite) => (
                <div key={testSuite.id} className={styles.listItem}>
                  <TestSuiteCard
                    testSuite={testSuite}
                    projectKey={projectKey}
                    selectable={isSelectable}
                    selected={testSuite.id === selectedSuiteId}
                    onSelect={
                      isSelectable
                        ? () =>
                            onSuiteSelect?.(
                              testSuite.id === selectedSuiteId
                                ? null
                                : testSuite.id
                            )
                        : undefined
                    }
                  />
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};
