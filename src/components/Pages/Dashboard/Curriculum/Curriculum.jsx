import React, { useState, useEffect } from "react";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Table,
  Select,
  Button,
  Row,
  Col,
  Spin,
  Menu,
  Dropdown,
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";
import Sidebar from "../../../Global/Sidebar";
import "./Curriculum.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Content } = Layout;
const { Option } = Select;

export default function Curriculum() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  // States for handling modals
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Track edit mode

  // State for program data fetched from API
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [programTitles, setProgramTitles] = useState([]);

  // Fetch program data from API
  useEffect(() => {
    setLoading(true);
    const extractedUserObject = localStorage.getItem("user");
    const parsedObject = JSON.parse(extractedUserObject);

    const departmentCode = parsedObject.Department_Code;
    console.log(departmentCode);

    axios
      .post(
        "http://localhost:3000/api/system/programs-master/read",
        {
          Department_Code: departmentCode,
        },
        { withCredentials: true }
      ) // Update with your API endpoint
      .then((response) => {
        const data = response.data;
        setAllData(data);
        setFilteredData(data);
        setLoading(false);
        // Extract unique program titles
        const titles = Array.from(
          new Set(data.map((item) => item.Program_Title))
        );
        setProgramTitles(titles);
      })
      .catch((error) => {
        console.error("Error fetching program data:", error);
        setLoading(false);
      });
  }, []);

  // Open Edit Modal
  function handleEditClick(course) {
    setIsEditMode(true);
    setIsEditModalVisible(true);
    form.setFieldsValue(course);
  }

  // Open Add Modal
  function handleAddClick() {
    form.resetFields();
    setIsEditMode(false);
    setIsEditModalVisible(true);
  }

  // Close Modal and Reset the Form
  function handleModalCancel() {
    form.resetFields();
    setIsEditMode(false);
    setIsEditModalVisible(false);
  }

  function handleSaveChanges() {
    form
      .validateFields()
      .then((values) => {
        if (isEditMode) {
          // Handle update logic for the course
          console.log("Editing course", values);
          form.resetFields();
        } else {
          // Handle add logic for the new course
          console.log("Adding new course", values);
          form.resetFields();
        }
        setIsEditModalVisible(false); // Close the modal after saving
        form.resetFields(); // Reset form fields after save
      })
      .catch((info) => {
        console.log("Validation failed:", info);
      });
  }

  // Handle Delete Confirmation
  function handleDeleteClick(course) {
    setIsDeleteModalVisible(true);
  }

  function handleDeleteConfirm() {
    // Handle the deletion logic here
    setIsDeleteModalVisible(false);
  }

  function handleDeleteCancel() {
    form.resetFields();
    setIsDeleteModalVisible(false);
  }

  // Handle filter change for program
  function handleProgramFilterChange(value) {
    setFilteredData(
      allData.filter(
        (course) => course.Program_Title === value || value === "all"
      )
    );
  }

  // Handle filter change for year
  function handleYearFilterChange(value) {
    setFilteredData(
      allData.filter((course) => course.year === value || value === "all")
    );
  }

  const columns = [
    {
      title: "Program",
      dataIndex: "program",
      key: "program",
    },
    {
      title: "Course Code",
      dataIndex: "courseCode",
      key: "courseCode",
    },
    {
      title: "Descriptive Title",
      dataIndex: "descriptiveTitle",
      key: "descriptiveTitle",
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
    },
    {
      title: "Units",
      dataIndex: "units",
      key: "units",
    },
    {
      title: "Effective Year",
      dataIndex: "effectiveYear",
      key: "effectiveYear",
    },
    {
      title: "",
      key: "action",
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item
              key="edit"
              icon={<EditOutlined />}
              onClick={() => handleEditClick(record)}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              key="delete"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteClick(record)}
              danger
            >
              Delete
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button>
              Actions <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Content>
          <div className="dashboard-content">
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: 20 }}
            >
              <Col>
                <h2 className="dashboard-header">CURRICULUM</h2>
              </Col>
              <Col>
                <Button
                  type="primary"
                  className="add-curriculum-btn"
                  icon={<PlusCircleOutlined />}
                  onClick={handleAddClick}
                >
                  Add Curriculum
                </Button>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 20 }} align="middle">
              <Col>
                <span style={{ marginRight: 8 }}>
                  <strong>Filter by: </strong>
                </span>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  defaultValue="all"
                  style={{ width: "100%" }}
                  onChange={handleProgramFilterChange}
                >
                  <Option value="all">All Programs</Option>
                  {programTitles.map((title) => (
                    <Option key={title} value={title}>
                      {title}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={3}>
                <Select
                  defaultValue="all"
                  style={{ width: "100%" }}
                  onChange={handleYearFilterChange}
                >
                  <Option value="all">All Years</Option>
                  <Option value="1st Year">1st Year</Option>
                  <Option value="2nd Year">2nd Year</Option>
                </Select>
              </Col>
            </Row>

            {loading ? (
              <div style={{ textAlign: "center", marginTop: "100px" }}>
                <Spin size="large" />
              </div>
            ) : (
              <div className="table-shadow-wrapper">
                <Table
                  columns={columns}
                  dataSource={filteredData}
                  bordered
                  pagination={{ pageSize: 10 }}
                  responsive={true}
                />
              </div>
            )}
          </div>
        </Content>
      </Layout>

      <Modal
        title={isEditMode ? "Edit Curriculum" : "Add Curriculum"}
        open={isEditModalVisible}
        onCancel={handleModalCancel}
        onClose={handleModalCancel}
        footer={[]}
        width={800}
        maskClosable={false}
      >
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item
                label="Program"
                name="program"
                rules={[{ required: true, message: "Please select a program" }]}
              >
                <Select placeholder="Select Program">
                  {programTitles.map((title) => (
                    <Option key={title} value={title}>
                      {title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Effective Year"
                name="effectiveYear"
                rules={[
                  {
                    required: true,
                    message: "Please enter effective year",
                  },
                ]}
              >
                <Input placeholder="Enter Effective Year" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Course Code"
                name="courseCode"
                rules={[
                  {
                    required: true,
                    message: "Please enter course code",
                  },
                ]}
              >
                <Input placeholder="Enter Course Code" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item
                label="Descriptive Title"
                name="descriptiveTitle"
                rules={[
                  {
                    required: true,
                    message: "Please enter descriptive title",
                  },
                ]}
              >
                <Input placeholder="Enter Descriptive Title" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Year"
                name="year"
                rules={[
                  {
                    required: true,
                    message: "Please enter year",
                  },
                ]}
              >
                <Input placeholder="Enter Year" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Semester"
                name="semester"
                rules={[
                  {
                    required: true,
                    message: "Please enter semester",
                  },
                ]}
              >
                <Input placeholder="Enter Semester" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Units"
                name="units"
                rules={[
                  {
                    required: true,
                    message: "Please enter units",
                  },
                ]}
              >
                <Input placeholder="Enter Units" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Hours"
                name="hours"
                rules={[
                  {
                    required: true,
                    message: "Please enter hours",
                  },
                ]}
              >
                <Input placeholder="Enter Hours" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item>
                <Button type="primary" onClick={handleSaveChanges}>
                  {isEditMode ? "Save Changes" : "Add Curriculum"}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="Confirm Delete"
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      >
        <p>Are you sure you want to delete this course?</p>
      </Modal>
    </Layout>
  );
}
