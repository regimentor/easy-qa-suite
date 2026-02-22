import { Breadcrumb } from "antd";
import { Link, useLocation } from "@tanstack/react-router";
import type React from "react";
import { useMemo } from "react";

function getSegmentLabel(segments: string[], index: number): string {
  const seg = segments[index];
  if (!seg) return "";

  if (index === 0) {
    if (seg === "projects") return "Projects";
    if (seg === "about") return "About";
    return seg;
  }

  if (index === 1 && segments[0] === "projects") {
    if (seg === "create") return "New project";
    return seg; // project key
  }

  if (index === 2 && segments[0] === "projects") {
    if (seg === "test-suites") return "Test Suites";
    if (seg === "test-cases") return "Test Cases";
    return seg;
  }

  if (index === 3 && segments[0] === "projects") {
    const parent = segments[2];
    if (parent === "test-suites") {
      if (seg === "create") return "New";
      if (seg === "edit") return "Edit";
      return `#${seg}`; // suite id
    }
    if (parent === "test-cases" && seg === "create") return "New";
    return seg;
  }

  return seg;
}

function pathnameToItems(pathname: string): { title: React.ReactNode }[] {
  const segments = pathname
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);

  if (segments.length === 0) {
    return [{ title: "Home" }];
  }

  const items: { title: React.ReactNode }[] = [];

  for (let i = 0; i < segments.length; i++) {
    const basePath = "/" + segments.slice(0, i + 1).join("/");
    const label = getSegmentLabel(segments, i);
    const isLast = i === segments.length - 1;

    items.push({
      title: isLast ? label : <Link to={basePath}>{label}</Link>,
    });
  }

  return items;
}

export function AppBreadcrumbs() {
  const { pathname } = useLocation();

  const items = useMemo(() => pathnameToItems(pathname), [pathname]);

  if (items.length === 0) return null;

  return <Breadcrumb items={items} />;
}
