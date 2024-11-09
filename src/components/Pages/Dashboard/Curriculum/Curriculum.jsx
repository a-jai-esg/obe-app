/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined
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
  InputNumber
} from "antd";
import Sidebar from "../../../Global/Sidebar";
import "./Curriculum.css";
import { useNavigate } from "react-router-dom";

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

  // Open Edit Modal
  function handleEditClick(course) {
        setIsEditMode(true); // Set to Edit Mode
        setIsEditModalVisible(true);
        form.setFieldsValue(course);
    }

  // Open Add Modal
  function handleAddClick() {
        form.resetFields();
        setIsEditMode(false); // Set to Add Mode
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

  const allData = [
            {
              key: '1',
              program: 'BSIT',
              effectiveYear: '2024',
              courseCode: 'MATH101',
              descriptiveTitle: 'Mathematics 101',
              year: '1st Year',
              semester: '1st Semester',
              units: 3,
            },
            {
              key: '2',
              program: 'BSIT',
              effectiveYear: '2024',
              courseCode: 'CS101',
              descriptiveTitle: 'Computer Science 101',
              year: '1st Year',
              semester: '1st Semester',
              units: 3,
            },
            {
              key: '3',
              program: 'BSIS',
              effectiveYear: '2024',
              courseCode: 'IT101',
              descriptiveTitle: 'Information Technology 101',
              year: '1st Year',
              semester: '1st Semester',
              units: 4,
            },
            {
              key: '4',
              program: 'BSIT',
              effectiveYear: '2023',
              courseCode: 'MATH102',
              descriptiveTitle: 'Mathematics 102',
              year: '2nd Year',
              semester: '2nd Semester',
              units: 3,
            },
            {
              key: '5',
              program: 'BSIS',
              effectiveYear: '2023',
              courseCode: 'DBMS101',
              descriptiveTitle: 'Database Management Systems',
              year: '2nd Year',
              semester: '2nd Semester',
              units: 3,
            },
          ];
        
          // Columns definition for the table
          const columns = [ 
            {
              title: 'Course Code',
              dataIndex: 'courseCode',
              key: 'courseCode',
            },
            {
              title: 'Descriptive Title',
              dataIndex: 'descriptiveTitle',
              key: 'descriptiveTitle',
            },
            {
              title: 'Year',
              dataIndex: 'year',
              key: 'year',
            },
            {
            title: 'Program',
            dataIndex: 'program',
            key: 'program',
            },
            {
              title: 'Semester',
              dataIndex: 'semester',
              key: 'semester',
            },
            {
              title: 'Units',
              dataIndex: 'units',
              key: 'units',
            },
            {
            title: 'Effective Year',
            dataIndex: 'effectiveYear',
            key: 'effectiveYear',
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

  // State for filtered data based on program and year
  const [filteredData, setFilteredData] = useState(allData);

  // Handle filter change for program
  function handleProgramFilterChange(value) {
    setFilteredData(allData.filter(course => course.program === value || value === 'all'));
  }

  // Handle filter change for year
  function handleYearFilterChange(value) {
    setFilteredData(allData.filter(course => course.year === value || value === 'all'));
  }

  // Simulate data fetching
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Content>
          <div className="dashboard-content">
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
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
              <span style={{ marginRight: 8 }}><strong>Filter by: </strong></span>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  defaultValue="all"
                  style={{ width: '100%' }}
                  onChange={handleProgramFilterChange}
                >
                  <Option value="all">All Programs</Option>
                  <Option value="BSIT">BSIT</Option>
                  <Option value="BSIS">BSIS</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={3}>
                <Select
                  defaultValue="all"
                  style={{ width: '100%' }}
                  onChange={handleYearFilterChange}
                >
                  <Option value="all">All Years</Option>
                  <Option value="1st Year">1st Year</Option>
                  <Option value="2nd Year">2nd Year</Option>
                </Select>
              </Col>
            </Row>

            {loading ? (
              <div style={{ textAlign: 'center', marginTop: '100px' }}>
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
        <Form
          form={form}
          initialValues={isEditMode ? form.getFieldsValue() : {}}
          layout="vertical"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24}>
             <Form.Item
                label="Program"
                name="program"
                rules={[{ required: true, message: "Please select a program" }]}
                >
                <Select placeholder="Select Program">
                    <Option value="BSIT">BSIT</Option>
                    <Option value="BSIS">BSIS</Option>
                    <Option value="BSSE">BSSE</Option>
                </Select>
                </Form.Item>
            </Col>
            </Row>

            <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
                <Form.Item
                label="Effective Year"
                name="effectiveYear"
                rules={[{ required: true, message: "Please enter the effective year" }]}
                >
                <Input placeholder="Enter Effective Year" />
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item
                label="Course Code"
                name="courseCode"
                rules={[{ required: true, message: "Please enter the course code" }]}
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
                rules={[{ required: true, message: "Please enter the descriptive title" }]}
                >
                <Input placeholder="Enter Descriptive Title" />
                </Form.Item>
            </Col>
            </Row>

            <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
                <Form.Item
                label="Year Level"
                name="year"
                rules={[{ required: true, message: "Please select the year" }]}
                >
                <Select placeholder="Select Year">
                    <Option value="1st Year">1st Year</Option>
                    <Option value="2nd Year">2nd Year</Option>
                    <Option value="3rd Year">3rd Year</Option>
                    <Option value="4th Year">4th Year</Option>
                </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={8}>
                <Form.Item
                label="Semester"
                name="semester"
                rules={[{ required: true, message: "Please select the semester" }]}
                >
                <Select placeholder="Select Semester">
                    <Option value="1st Semester">1st Semester</Option>
                    <Option value="2nd Semester">2nd Semester</Option>
                </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={8}>
                <Form.Item
                label="Units"
                name="units"
                rules={[{ required: true, message: "Please enter the number of units" }]}
                >
                <InputNumber min={1} max={10} placeholder="Enter Units" style={{ width: '100%' }} />
                </Form.Item>
            </Col>
            </Row>

            <Row justify="end" gutter={[16, 16]}>
                 <Col>
                     <Button block onClick={handleModalCancel}>
                         Cancel
                     </Button>
                 </Col>
                 <Col>
                 <Button type="primary" block onClick={handleSaveChanges}>
                     {isEditMode ? "Save Changes" : "Add"}
                 </Button>
                 </Col>
            </Row>
        </Form>
      </Modal>

      <Modal
        title="Delete Curriculum"
        open={isDeleteModalVisible}
        onCancel={handleDeleteCancel}
        onOk={handleDeleteConfirm}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this curriclum?</p>
      </Modal>
    </Layout>
);
}
