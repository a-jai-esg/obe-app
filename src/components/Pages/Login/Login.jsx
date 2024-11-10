// components/Pages/Login/Login.jsx
import React, { useState } from "react";
import { Form, Input, Button, Card } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import { setToken } from "../../utils/auth"; // A utility function to store token in localStorage
import logo from "/uc-logo.png";
import "./Login.css";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Send login request to the backend
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        {
          username: values.username,
          password: values.password,
        }
      );

      // Save the token in localStorage
      const { token } = response.data;
      setToken(token);

      // Redirect to dashboard after successful login
      history("/dashboard");
    } catch (error) {
      setLoading(false);
      console.error("Login failed:", error.response.data.message);
    }
  };

  return (
    <div className="main-container">
      <Card
        title={
          <div style={{ textAlign: "center" }}>
            <img
              src={logo}
              alt="OBE Application Logo"
              style={{
                marginTop: "5%",
                maxWidth: "100%",
                height: "auto",
                width: "150px",
                marginBottom: "20px",
              }}
            />
            <h2 style={{ fontWeight: "600", fontSize: "24px" }}>User Login</h2>
            <h3 style={{ fontWeight: "300", marginTop: "5px" }}>
              OBE Application
            </h3>
          </div>
        }
        style={{
          width: 450,
          margin: "auto",
          marginTop: "50px",
          borderRadius: "10px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        }}
      >
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item style={{ textAlign: "right" }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
