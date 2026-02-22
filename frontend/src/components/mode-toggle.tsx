import { Moon, Sun } from "lucide-react";
import { Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const menuItems: MenuProps["items"] = [
    { key: "light", label: "Light", onClick: () => setTheme("light") },
    { key: "dark", label: "Dark", onClick: () => setTheme("dark") },
    { key: "system", label: "System", onClick: () => setTheme("system") },
  ];

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
      <Button
        type="text"
        icon={isDark ? <Moon size={18} /> : <Sun size={18} />}
        aria-label="Toggle theme"
      />
    </Dropdown>
  );
}
