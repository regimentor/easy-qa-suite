import { Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { theme } from "antd";
import i18n, { STORAGE_KEY } from "@/lib/i18n";

export function LanguageToggle() {
  const { t } = useTranslation();
  const {
    token: { colorText },
  } = theme.useToken();

  const handleChange = (lng: string) => {
    i18n.changeLanguage(lng);
    try {
      localStorage.setItem(STORAGE_KEY, lng);
    } catch {
      // ignore
    }
  };

  const menuItems: MenuProps["items"] = [
    { key: "en", label: t("common.english"), onClick: () => handleChange("en") },
    { key: "ru", label: t("common.russian"), onClick: () => handleChange("ru") },
  ];

  const currentLabel = i18n.language === "ru" ? "RU" : "EN";

  return (
    <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
      <Button
        type="text"
        icon={<Languages size={18} />}
        aria-label={t("common.language")}
        style={{ color: colorText }}
      >
        {currentLabel}
      </Button>
    </Dropdown>
  );
}
