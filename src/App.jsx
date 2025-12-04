import React, { useState } from "react";
import {
  Layout,
  ConfigProvider,
  Switch,
  Typography,
  Space,
  theme as antdTheme,
} from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import UserTable from "./components/UserTable.jsx";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// Wrap the layout in a component that can read theme tokens
function AppLayout({ isDark, setIsDark }) {
  const { token } = antdTheme.useToken();

  return (
    <Layout
      style={{
        height: "100vh",
        background: token.colorBgLayout,
      }}
    >
      {/* HEADER */}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
        }}
      >
        <Title level={4} style={{ color: "#fff", margin: 0 }}>
          User Management
        </Title>

        <Space align="center">
          <Text style={{ color: "#fff" }}>
            {isDark ? "Dark mode" : "Light mode"}
          </Text>
          <Switch
            checked={isDark}
            onChange={setIsDark}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
        </Space>
      </Header>

      {/* BODY (scrolls inside here) */}
      <Content
        style={{
          padding: "24px 40px 40px",
          height: "calc(100vh - 64px)",
          overflow: "auto",
        }}
      >
        {/* Card container that follows the theme (light & dark) */}
        <div
          style={{
            background: token.colorBgContainer,
            borderRadius: 8,
            boxShadow: token.boxShadowSecondary,
            padding: 16,
          }}
        >
          <UserTable />
        </div>
      </Content>
    </Layout>
  );
}

function App() {
  const [isDark, setIsDark] = useState(false);

  const themeConfig = {
    algorithm: isDark
      ? antdTheme.darkAlgorithm
      : antdTheme.defaultAlgorithm,
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <AppLayout isDark={isDark} setIsDark={setIsDark} />
    </ConfigProvider>
  );
}

export default App;
