/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import UcLogo from "../../assets/Images/uc-logo.png";
import "./Sidebar.css";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Toggle sidebar collapse state
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider
      width={200}
      collapsible
      collapsed={collapsed}
      className="custom-sidebar"
      trigger={null} // Hide the default collapse trigger
    >
      {/* Logo with onClick event to toggle collapse */}
      <div className="sidebar-logo" onClick={toggleCollapse}>
        <img 
          src={UcLogo} 
          alt="UC Logo" 
          className={`logo ${collapsed ? "collapsed-logo" : "expanded-logo"}`} 
        />
      </div>

      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        style={{ height: "100%", borderRight: 0 }}
      >
        <Menu.Item key="1" icon={<AppstoreOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          <Link to="/profile">Profile</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
