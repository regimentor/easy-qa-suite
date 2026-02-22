import { Breadcrumb } from "antd";
import { Link, useLocation } from "@tanstack/react-router";
import type React from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

function getSegmentLabel(
  segments: string[],
  index: number,
  t: (key: string) => string
): string {
  const seg = segments[index];
  if (!seg) return "";

  if (index === 0) {
    if (seg === "projects") return t("breadcrumb.projects");
    if (seg === "about") return t("breadcrumb.about");
    return seg;
  }

  if (index === 1 && segments[0] === "projects") {
    if (seg === "create") return t("breadcrumb.newProject");
    return seg; // project key
  }

  if (index === 2 && segments[0] === "projects") {
    if (seg === "test-suites") return t("breadcrumb.testSuites");
    if (seg === "test-cases") return t("breadcrumb.testCases");
    return seg;
  }

  if (index === 3 && segments[0] === "projects") {
    const parent = segments[2];
    if (parent === "test-suites") {
      if (seg === "create") return t("breadcrumb.new");
      if (seg === "edit") return t("breadcrumb.edit");
      return `#${seg}`; // suite id
    }
    if (parent === "test-cases" && seg === "create") return t("breadcrumb.new");
    return seg;
  }

  return seg;
}

function pathnameToItems(
  pathname: string,
  t: (key: string) => string
): { title: React.ReactNode }[] {
  const segments = pathname
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);

  if (segments.length === 0) {
    return [{ title: t("breadcrumb.home") }];
  }

  const items: { title: React.ReactNode }[] = [];

  for (let i = 0; i < segments.length; i++) {
    const basePath = "/" + segments.slice(0, i + 1).join("/");
    const label = getSegmentLabel(segments, i, t);
    const isLast = i === segments.length - 1;

    items.push({
      title: isLast ? label : <Link to={basePath}>{label}</Link>,
    });
  }

  return items;
}

export function AppBreadcrumbs() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const items = useMemo(() => pathnameToItems(pathname, t), [pathname, t]);

  if (items.length === 0) return null;

  return <Breadcrumb items={items} />;
}
