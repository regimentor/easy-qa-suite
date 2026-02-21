import { Moon, Sun } from "lucide-react";
import { Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useTheme } from "@/components/theme-provider";
import styles from "./mode-toggle.module.css";

export function ModeToggle() {
  const { setTheme } = useTheme();

  const menuItems: MenuProps["items"] = [
    { key: "light", label: "Light", onClick: () => setTheme("light") },
    { key: "dark", label: "Dark", onClick: () => setTheme("dark") },
    { key: "system", label: "System", onClick: () => setTheme("system") },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
      <Button className={styles.triggerBtn} type="text" aria-label="Toggle theme">
        <span className={styles.iconWrap}>
          <Sun className={styles.sunIcon} size={18} />
          <Moon className={styles.moonIcon} size={18} />
        </span>
        <span className={styles.srOnly}>Toggle theme</span>
      </Button>
    </Dropdown>
  );
}
