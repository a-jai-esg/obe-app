// Sidebar.jsx
import React, { useState } from "react";
import { Layout, Menu, Modal } from "antd";
import {
  UserOutlined,
  AppstoreOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import UcLogo from "../../assets/Images/uc-logo.png";
import axios from "axios";
import Cookies from "js-cookie";
import "./Sidebar.css";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Toggle sidebar collapse state
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // Handle logout with a confirmation modal
  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to log out?",
      okText: "Logout",
      cancelText: "Cancel",
      onOk: () => {
        // Clear authentication data here (e.g., localStorage/sessionStorage)
        localStorage.removeItem("token");
        axios
          .post(
            "http://localhost:3000/api/users/logout",
            {},
            { withCredentials: true }
          )
          .then(() => {
            // After logout, redirect to login page
            navigate("/login");
          })
          .catch((error) => {
            console.error("Logout failed:", error);
          });

        Cookies.remove("token");
      },
    });
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
        {/* <Menu.Item key="2" icon={<UserOutlined />}>
          <Link to="/profile">Profile</Link>
        </Menu.Item> */}
        <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
