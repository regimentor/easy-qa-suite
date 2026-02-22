import { App, ConfigProvider, theme } from "antd";
import enUS from "antd/locale/en_US";
import ruRU from "antd/locale/ru_RU";
import { useTheme } from "@/components/theme-provider";
import { useTranslation } from "react-i18next";

export function AntdConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme: appTheme } = useTheme();
  const { i18n } = useTranslation();

  const isDark =
    appTheme === "dark" ||
    (appTheme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const antdLocale = i18n.language === "ru" ? ruRU : enUS;

  return (
    <ConfigProvider
      componentSize="small"
      locale={antdLocale}
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
