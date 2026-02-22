import { Moon, Sun } from "lucide-react";
import { Button, Dropdown, theme } from "antd";
import type { MenuProps } from "antd";
import { useTheme } from "@/components/theme-provider";
import { useTranslation } from "react-i18next";

export function ModeToggle() {
  const { theme: appTheme, setTheme } = useTheme();
  const { t } = useTranslation();
  const {
    token: { colorText },
  } = theme.useToken();

  const menuItems: MenuProps["items"] = [
    { key: "light", label: t("common.light"), onClick: () => setTheme("light") },
    { key: "dark", label: t("common.dark"), onClick: () => setTheme("dark") },
    { key: "system", label: t("common.system"), onClick: () => setTheme("system") },
  ];

  const isDark =
    appTheme === "dark" ||
    (appTheme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
      <Button
        type="text"
        icon={isDark ? <Moon size={18} /> : <Sun size={18} />}
        aria-label={t("common.toggleTheme")}
        style={{ color: colorText }}
      />
    </Dropdown>
  );
}
