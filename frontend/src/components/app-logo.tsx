import { theme } from "antd";

type AppLogoProps = {
  collapsed: boolean;
};

export function AppLogo({ collapsed }: AppLogoProps) {
  const {
    token: { colorBorder, colorText, borderRadius },
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
      {collapsed ? (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius,
          }}
          title="Logo"
        />
      ) : (
        <>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius,
              marginRight: 12,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: colorText,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            EasyQA
          </span>
        </>
      )}
    </div>
  );
}
