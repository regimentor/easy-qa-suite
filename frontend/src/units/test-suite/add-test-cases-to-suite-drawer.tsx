import { useQuery, useMutation } from "@apollo/client";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Drawer, Button, Input, Checkbox } from "antd";
import { testCasesQuery } from "@/units/test-case/test-case.queries";
import {
  addTestCasesToSuiteMutation,
} from "@/units/test-suite/test-suite.queries";
import { SearchIcon } from "@/components/icons/SearchIcon";
import styles from "./add-test-cases-to-suite-drawer.module.css";

export type AddTestCasesToSuiteDrawerProps = {
  open: boolean;
  onClose: () => void;
  suiteId: string;
  projectId: string;
  existingTestCaseIds: string[];
  onAdded: () => void;
};

export function AddTestCasesToSuiteDrawer({
  open,
  onClose,
  suiteId,
  projectId,
  existingTestCaseIds,
  onAdded,
}: AddTestCasesToSuiteDrawerProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data, loading } = useQuery(testCasesQuery, {
    variables: { projectId },
    skip: !open || !projectId,
  });

  const [addTestCases, { loading: adding }] = useMutation(
    addTestCasesToSuiteMutation,
    {
      onCompleted: () => {
        setSelectedIds(new Set());
        onAdded();
      },
      onError: () => {
        // Error can be shown via message or toast if needed
      },
    }
  );

  const existingSet = useMemo(
    () => new Set(existingTestCaseIds),
    [existingTestCaseIds]
  );

  const availableTestCases = useMemo(() => {
    if (!data?.testCases) return [];
    return data.testCases.filter((tc) => !existingSet.has(tc.id));
  }, [data?.testCases, existingSet]);

  const filteredTestCases = useMemo(() => {
    if (!searchQuery.trim()) return availableTestCases;
    const q = searchQuery.toLowerCase();
    return availableTestCases.filter((tc) =>
      tc.title.toLowerCase().includes(q)
    );
  }, [availableTestCases, searchQuery]);

  const sortedTestCases = useMemo(() => {
    return [...filteredTestCases].sort((a, b) => {
      const aSelected = selectedIds.has(a.id);
      const bSelected = selectedIds.has(b.id);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }, [filteredTestCases, selectedIds]);

  const handleToggle = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(sortedTestCases.map((tc) => tc.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleAdd = () => {
    const testCaseIds = Array.from(selectedIds);
    if (testCaseIds.length === 0) return;
    addTestCases({
      variables: {
        data: { suiteId, testCaseIds },
      },
    });
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedIds(new Set());
    onClose();
  };

  const allSelected =
    sortedTestCases.length > 0 &&
    sortedTestCases.every((tc) => selectedIds.has(tc.id));

  return (
    <Drawer
      title={t("testSuite.addTestCasesDrawerTitle")}
      open={open}
      onClose={handleClose}
      width={420}
      destroyOnClose
      footer={
        <div className={styles.footer}>
          <Button onClick={handleClose}>{t("common.cancel")}</Button>
          <Button
            type="primary"
            onClick={handleAdd}
            disabled={selectedIds.size === 0 || adding}
            loading={adding}
          >
            {t("testSuite.addTestCases")}
          </Button>
        </div>
      }
    >
      <p className={styles.hint}>
        {t("testSuite.addTestCasesDrawerHint")}
      </p>

      <Input
        placeholder={t("testCase.searchPlaceholder")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        prefix={<SearchIcon className={styles.searchIcon} />}
        className={styles.search}
        allowClear
      />

      {sortedTestCases.length > 0 && (
        <div className={styles.selectAll}>
          <Checkbox
            checked={allSelected}
            indeterminate={
              selectedIds.size > 0 && !allSelected
            }
            onChange={(e) => handleSelectAll(e.target.checked)}
          >
            {t("common.all")}
          </Checkbox>
        </div>
      )}

      <div className={styles.list}>
        {loading && <div className={styles.loading}>{t("common.loading")}</div>}
        {!loading && sortedTestCases.length === 0 && (
          <div className={styles.empty}>
            {existingTestCaseIds.length === 0 && availableTestCases.length === 0
              ? t("testCase.noCases")
              : t("testSuite.noTestCasesToAdd")}
          </div>
        )}
        {!loading &&
          sortedTestCases.map((tc) => (
            <div key={tc.id} className={styles.item}>
              <Checkbox
                checked={selectedIds.has(tc.id)}
                onChange={(e) => handleToggle(tc.id, e.target.checked)}
              >
                <div className={styles.itemContent}>
                  <span className={styles.itemTitle}>{tc.title}</span>
                  {tc.description && (
                    <span className={styles.itemDesc}>{tc.description}</span>
                  )}
                </div>
              </Checkbox>
            </div>
          ))}
      </div>
    </Drawer>
  );
}
