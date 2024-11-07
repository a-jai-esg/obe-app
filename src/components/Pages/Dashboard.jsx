import React from "react";
import { Layout } from "antd";
import Sidebar from "../Global/Sidebar";

const { Header, Content, Footer } = Layout;

const Dashboard = () => (
  <Layout style={{ minHeight: "100vh" }}>
    <Sidebar />
    <Layout>
      <Header
        className="site-layout-sub-header-background"
        style={{ padding: 0 }}
      />
      <Content style={{ margin: "24px 16px 0" }}>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 360 }}
        >
          Welcome to the Dashboard!
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2024 Created by Ant UED
      </Footer>
    </Layout>
  </Layout>
);

export default Dashboard;
