/**
 * Ant Design theme for the whole site: site blue, rounded corners, and the dark theme whenever the
 * header's dark-mode toggle puts the "dark" class on <html>.
 */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ConfigProvider, theme as antdTheme } from "antd";

const isDark = () => document.documentElement.classList.contains("dark");

export default function AntdThemeProvider({ children }) {
  const [dark, setDark] = useState(isDark);

  useEffect(() => {
    const observer = new MutationObserver(() => setDark(isDark()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    setDark(isDark()); // the header may have switched dark mode on before this ran
    return () => observer.disconnect();
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: dark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: { colorPrimary: "#2563eb", borderRadius: 8, fontFamily: "inherit", controlHeight: 42 },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

AntdThemeProvider.propTypes = { children: PropTypes.node };
