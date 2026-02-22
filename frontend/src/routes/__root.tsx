import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import { AppLogo } from "@/components/app-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { ModeToggle } from "@/components/mode-toggle";
import { LoginForm } from "@/units/auth/login-form";
import {
  $user,
  $userIsAuthenticeted,
  isAuthenticatedFx,
  logOutFx,
} from "@/units/user/user.store";
import { createRootRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Avatar, Button, Dropdown, Layout, Menu, theme } from "antd";
import type { MenuProps } from "antd";
import { useUnit } from "effector-react";
import { FolderKanban, Home, Info, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./root.module.css";

function getInitials(fullName: string, username: string): string {
  const trimmed = (fullName ?? "").trim();
  if (trimmed.length > 0) {
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
    }
    return trimmed.slice(0, 2).toUpperCase();
  }
  return (username ?? "").slice(0, 2).toUpperCase() || "?";
}

const SIDER_COLLAPSED_KEY = "app-sider-collapsed";

const Index = () => {
  const [isAuthenticated, isAuthenticatedPending, userIsAuthenticeted, user] =
    useUnit([
      isAuthenticatedFx,
      isAuthenticatedFx.pending,
      $userIsAuthenticeted,
      $user,
    ]);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, colorBorder, colorText, borderRadiusLG },
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem(SIDER_COLLAPSED_KEY) === "true"
      : false
  );

  useEffect(() => {
    isAuthenticated();
  }, [isAuthenticated]);

  const handleCollapse = (next: boolean) => {
    setCollapsed(next);
    try {
      localStorage.setItem(SIDER_COLLAPSED_KEY, String(next));
    } catch {
      // ignore
    }
  };

  const { t } = useTranslation();
  const menuItems: MenuProps["items"] = useMemo(
    () => [
      { key: "/", icon: <Home size={18} />, label: t("common.home") },
      { key: "/projects", icon: <FolderKanban size={18} />, label: t("common.projects") },
      { key: "/about", icon: <Info size={18} />, label: t("common.about") },
    ],
    [t]
  );

  const selectedKey = useMemo(() => {
    const exact = pathname;
    if (exact === "/") return "/";
    if (exact === "/projects" || exact.startsWith("/projects/")) return "/projects";
    if (exact === "/about") return "/about";
    return pathname;
  }, [pathname]);

  if (isAuthenticatedPending) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.loader} />
      </div>
    );
  }

  if (!userIsAuthenticeted) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginToggle}>
          <LanguageToggle />
          <ModeToggle />
        </div>
        <LoginForm />
      </div>
    );
  }

  return (
    <Layout hasSider style={{ height: "100vh", overflow: "hidden" }}>
      <Layout.Sider
        collapsible
        collapsed={collapsed}
        onCollapse={handleCollapse}
        collapsedWidth={80}
        width={200}
        breakpoint="lg"
        trigger={null}
        style={{ background: colorBgContainer }}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <AppLogo collapsed={collapsed} />
          <Menu
            selectedKeys={[selectedKey]}
            mode="inline"
            style={{ flex: 1, minHeight: 0, borderRight: 0 }}
            items={menuItems}
            onClick={({ key }) => navigate({ to: key })}
          />
        </div>
      </Layout.Sider>
      <Layout
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Layout.Header
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingInline: 24,
            gap: 16,
            background: colorBgContainer,
            color: colorText,
            borderBottom: `1px solid ${colorBorder}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
            <Button
              type="text"
              icon={collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
              onClick={() => handleCollapse(!collapsed)}
              aria-label={collapsed ? t("common.expandSidebar") : t("common.collapseSidebar")}
            />
            <AppBreadcrumbs />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <LanguageToggle />
            <ModeToggle />
            {user && (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "user",
                      label: (
                        <span style={{ cursor: "default" }}>
                          {user.full_name || user.username}
                          {user.email ? ` · ${user.email}` : ""}
                        </span>
                      ),
                      disabled: true,
                    },
                    { type: "divider" },
                    {
                      key: "logout",
                      label: t("common.logout"),
                      icon: <LogOut size={14} />,
                      onClick: () => logOutFx(),
                    },
                  ],
                }}
                trigger={["click"]}
              >
                <button
                  type="button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 8px",
                    border: 0,
                    borderRadius: 4,
                    background: "transparent",
                    color: colorText,
                    cursor: "pointer",
                  }}
                  aria-label={t("common.userMenu")}
                >
                  <Avatar style={{ flexShrink: 0 }}>
                    {getInitials(user.full_name, user.username)}
                  </Avatar>
                  <span style={{ fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 120 }}>
                    {user.full_name || user.username}
                  </span>
                </button>
              </Dropdown>
            )}
          </div>
        </Layout.Header>
        <Layout.Content
          style={{
            flex: 1,
            minHeight: 0,
            padding: 24,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            minWidth: 0,
            background: colorBgContainer,
          }}
        >
          <div
            style={{
              width: "100%",
              minWidth: 0,
              minHeight: "min-content",
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export const Route = createRootRoute({
  component: () => <Index />,
});
