// components/Pages/Login/Login.jsx
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card } from "antd";
import { useNavigate, Link } from "react-router-dom";
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
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        {
          username: values.username,
          password: values.password,
        },
        {
          withCredentials: true,
        }
      );

      // Destructure the response to get token and user data
      const { token, user } = response.data;

      // Store the token and user data in localStorage
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect to dashboard after successful login
      history("/dashboard");
    } catch (error) {
      setLoading(false);
      console.error("Login failed:", error.message);
    }
  };

  useEffect(() => {
    document.title = "Login - OBE Application";
  }, []);

  return (
    <div className="main-container">
      <Card
        title={
          <div style={{ textAlign: "center" }}>
            <img
              src={logo} // Set the logo source here
              alt="OBE Application Logo"
              style={{
                marginTop: "5%",
                maxWidth: "100%", // Ensure the logo is responsive
                height: "auto", // Maintain aspect ratio
                width: "150px", // Set a default width for large screens
                marginBottom: "20px", // Add spacing below the logo
              }}
            />
            <h2 style={{ fontWeight: "600", fontSize: "24px" }}>User Login</h2>
            <h3 style={{ fontWeight: "300", marginTop: "5px" }}>
              OBE Application
            </h3>
          </div>
        }
        style={{
          width: 450, // Increased width for a more spacious look
          margin: "auto",
          marginTop: "50px",
          borderRadius: "10px", // Rounded corners
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
          padding: "20px",
        }}
      >
        <Form name="login" onFinish={onFinish} layout="vertical">
          {/* Username */}
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit" block size="large">
              Login
            </Button>
          </Form.Item>
        </Form>

        {/* Link to Registration */}
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <Link to="/register" style={{ fontSize: "14px", color: "#1890ff" }}>
            Don't have an account? Register here.
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
