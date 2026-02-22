import { App, ConfigProvider, theme } from "antd";
import { useTheme } from "@/components/theme-provider";

export function AntdConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme: appTheme } = useTheme();

  const isDark =
    appTheme === "dark" ||
    (appTheme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <ConfigProvider
      componentSize="small"
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
