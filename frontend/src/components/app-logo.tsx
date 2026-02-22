import { theme } from "antd";

type AppLogoProps = {
  collapsed: boolean;
};

export function AppLogo({ collapsed }: AppLogoProps) {
  const {
    token: { colorBorder, colorText },
  } = theme.useToken();

  return (
    <div
      style={{
        height: 64,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        padding: collapsed ? 0 : "0 24px",
        borderBottom: `1px solid ${colorBorder}`,
      }}
    >
      <span
        style={{
          fontSize: collapsed ? 14 : 16,
          fontWeight: 600,
          color: colorText,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {collapsed ? "EQA" : "EasyQA"}
      </span>
    </div>
  );
}
