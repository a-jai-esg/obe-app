/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from "react";
import { Form, Input, Button, Card, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import axios from "axios";
import logo from "/uc-logo.png";

const { Option } = Select;

const Registration = () => {
  const history = useNavigate();
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    document.title = "Registration - OBE Application";
    // Fetch departments when component mounts
    axios
      .get("http://localhost:3000/api/department/list")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
        message.error("Failed to load departments.");
      });
  }, []);

  const onFinish = async (values) => {
    const mergedValues = {
      first_name: values.firstname,
      last_name: values.lastname,
      email_address: values.email_address,
      username: values.username,
      password: values.password,
      department_id: values.department, // Use the department ID
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/register",
        mergedValues
      );
      message.success("Registration successful!");
      history("/login"); // Redirect to login page after successful registration
    } catch (error) {
      console.error("Registration failed:", error);
      message.error("Registration failed. Please try again.");
    }
  };

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
            <h2 style={{ fontWeight: "600", fontSize: "24px" }}>
              User Account Registration
            </h2>
            <h3 style={{ fontWeight: "300", marginTop: "5px" }}>
              OBE Application
            </h3>
          </div>
        }
        style={{
          width: 450, // Increased width
          margin: "auto",
          marginTop: "50px",
          borderRadius: "10px", // Rounded corners for a smoother look
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Added box shadow for depth
          padding: "20px",
        }}
      >
        <Form name="register" onFinish={onFinish} layout="vertical">
          {/* First Name */}
          <Form.Item
            name="firstname"
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input placeholder="First Name" />
          </Form.Item>

          {/* Last Name */}
          <Form.Item
            name="lastname"
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>

          {/* Email Address */}
          <Form.Item
            name="email_address"
            rules={[
              { required: true, message: "Please input your email address!" },
              { type: "email", message: "Please input a valid email address!" },
            ]}
          >
            <Input placeholder="Email Address" />
          </Form.Item>

          {/* Department Selection (Drop-down) */}
          <Form.Item
            name="department"
            rules={[
              { required: true, message: "Please select your department!" },
            ]}
          >
            <Select placeholder="Select Department">
              {departments.map((dept) => (
                <Option key={dept.Department_Code} value={dept.Record_ID}>
                  {dept.Department_Code}
                </Option>
              ))}
            </Select>
          </Form.Item>

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

          {/* Confirm Password */}
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Register
            </Button>
          </Form.Item>
        </Form>

        {/* Link to Login */}
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <Link to="/login" style={{ fontSize: "14px", color: "#1890ff" }}>
            Already have an account? Login here.
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Registration;
