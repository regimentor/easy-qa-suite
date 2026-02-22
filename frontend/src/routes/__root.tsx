import { AppLogo } from "@/components/app-logo";
import { ModeToggle } from "@/components/mode-toggle";
import { LoginForm } from "@/units/auth/login-form";
import {
  $userIsAuthenticeted,
  isAuthenticatedFx,
} from "@/units/user/user.store";
import { createRootRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Layout, Menu, theme } from "antd";
import type { MenuProps } from "antd";
import { useUnit } from "effector-react";
import { FolderKanban, Home, Info } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styles from "./root.module.css";

const SIDER_COLLAPSED_KEY = "app-sider-collapsed";

const Index = () => {
  const [isAuthenticated, isAuthenticatedPending, userIsAuthenticeted] =
    useUnit([
      isAuthenticatedFx,
      isAuthenticatedFx.pending,
      $userIsAuthenticeted,
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

  const menuItems: MenuProps["items"] = useMemo(
    () => [
      { key: "/", icon: <Home size={18} />, label: "Home" },
      { key: "/projects", icon: <FolderKanban size={18} />, label: "Projects" },
      { key: "/about", icon: <Info size={18} />, label: "About" },
    ],
    []
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
            justifyContent: "flex-end",
            paddingInline: 24,
            background: colorBgContainer,
            color: colorText,
            borderBottom: `1px solid ${colorBorder}`,
          }}
        >
          <ModeToggle />
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
