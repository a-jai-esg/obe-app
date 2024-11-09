/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  CheckCircleOutlined
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
import "./CourseSyllabus.css";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Option } = Select;

export default function Curriculum() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [isAddClicked, setIsAddClicked] = useState(false);

  const allData = [
    {
      id: "BSIT-CILO-01",
      key: '1',
      program: 'BSIT',
      effectiveYear: '2024',
      courseCode: 'MATH101',
      descriptiveTitle: 'Mathematics 101',
      units: 3,
      courseObjective: 'Learn fundamental mathematics concepts.',
      courseStatus: 'Introduced', // Add courseStatus
    },
    {
      id: "BSIT-CILO-02",
      key: '2',
      program: 'BSIT',
      effectiveYear: '2024',
      courseCode: 'CS101',
      descriptiveTitle: 'Computer Science 101',
      units: 3,
      courseObjective: 'Introduce basics of computer science and programming.',
      courseStatus: 'Enhanced', // Add courseStatus
    },
    {
      id: "BSIS-CILO-01",
      key: '3',
      program: 'BSIS',
      effectiveYear: '2024',
      courseCode: 'IT101',
      descriptiveTitle: 'Information Technology 101',
      units: 4,
      courseObjective: 'Explore information technology principles and applications.',
      courseStatus: 'Practiced', // Add courseStatus
    },
    {
      id: "BSIT-CILO-03",
      key: '4',
      program: 'BSIT',
      effectiveYear: '2023',
      courseCode: 'MATH102',
      descriptiveTitle: 'Mathematics 102',
      units: 3,
      courseObjective: 'Advance knowledge in mathematics for scientific applications.',
      courseStatus: 'Introduced', // Add courseStatus
    },
    {
      id: "BSIS-CILO-02",
      key: '5',
      program: 'BSIS',
      effectiveYear: '2023',
      courseCode: 'DBMS101',
      descriptiveTitle: 'Database Management Systems',
      units: 3,
      courseObjective: 'Learn about database management and SQL fundamentals.',
      courseStatus: 'Enhanced', // Add courseStatus
    }
  ];

  const columns = [
    {
      title: 'No.',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Course Objective',
      dataIndex: 'courseObjective',
      key: 'courseObjective',
    },
    ...(isAddClicked
      ? [
          {
            title: "",
            dataIndex: "actions",
            key: "actions",
            width: 150,
            align: "center",
            render: (_, record) => {
              const menu = (
                <Menu>
                  <Menu.Item key="edit" icon={<EditOutlined />}>
                    Edit
                  </Menu.Item>
                  <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
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
        ]
      : []), // Ensure it's an empty array when `isAddClicked` is false
  ];
  
  const [filteredData, setFilteredData] = useState(allData);
  const [mappingData, setMappingData] = useState(allData);

  function handleProgramFilterChange(value) {
    // Filter data based on the selected value, allowing dynamic filtering
    setFilteredData(allData.filter(course => course.program === value));
    setMappingData(allData.filter(course => course.program === value));
  }

  const syllabusMappingColumns = [
    {
      title: 'PO/CILO Mapping',
      dataIndex: 'id',
      key: 'id',
    },
    ...filteredData.map((course) => ({
      title: course.id,
      dataIndex: course.id,
      key: course.id,
      render: (text, record) => (
        <Select
          value={record.courseStatus}
          onChange={(value) => {
            // Update the course status on change
            record.courseStatus = value;
            setMappingData([...mappingData]); // Ensure updated mapping data is reflected
          }}
          placeholder="Select Mapping"
          disabled={!isAddClicked}
          style={{ width: 120 }}
        >
          <Option value="Introduced">Introduced</Option>
          <Option value="Enhanced">Enhanced</Option>
          <Option value="Practiced">Practiced</Option>
        </Select>
      ),
    })),
    ...(isAddClicked
      ? [
          {
            title: "",
            dataIndex: "actions",
            key: "actions",
            width: 150,
            align: "center",
            render: (_, record) => {
              const menu = (
                <Menu>
                  <Menu.Item key="edit" icon={<EditOutlined />}>
                    Edit
                  </Menu.Item>
                  <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
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
        ]
      : []),
  ];

  function handleSaveChanges() {
    form
        .validateFields()
        .then((values) => {
            if (isAddClicked) {
                // Handle update logic for the course
                console.log("Editing course", values);
            } else {
                // Handle add logic for the new course
                console.log("Adding new course", values);
            }
            form.resetFields(); // Reset form fields after save
            setIsAddClicked(false); // Close the add form after saving
        })
        .catch((info) => {
            console.log("Validation failed:", info);
        });
}

//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//     }, 500);
//   }, []);

  // Initialize filtering on component mount with default value as "BSIT"
  useEffect(() => {
    setFilteredData(allData.filter(course => course.program === "BSIT"));
    setMappingData(allData.filter(course => course.program === "BSIT"));
    setLoading(false);
  }, []);

  return (
    <Layout style={{ minHeight: "150vh" }}>
      <Sidebar />
      <Layout>
        <Content>
          <div className="dashboard-content">
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
              <Col>
                <h2 className="dashboard-header">COURSE SYLLABUS</h2>
              </Col>
              <Col>
                {!isAddClicked && (
                  <Button
                    type="primary"
                    className="add-curriculum-btn"
                    icon={<PlusCircleOutlined />}
                    onClick={() => setIsAddClicked(true)}
                  >
                    Add Course Syllabus
                  </Button>
                )}
              </Col>
            </Row>

            {isAddClicked && (
              <div className="form-container">
                <Form form={form} layout="vertical">
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
                    <Col xs={24} md={8}>
                        <Form.Item
                        label="Effective Year"
                        name="effectiveYear"
                        rules={[{ required: true, message: "Please enter the effective year" }]}
                        >
                        <Input placeholder="Enter Effective Year" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                        label="Course Code"
                        name="courseCode"
                        rules={[{ required: true, message: "Please enter the course code" }]}
                        >
                        <Input placeholder="Enter Course Code" />
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
                    <Col xs={24}>
                        <Form.Item
                        label="Course Objective"
                        name="courseObjective"
                        rules={[{ required: true, message: "Please enter the course objective" }]}
                        >
                        <Input.TextArea rows={3} placeholder="State Course Objective" />
                        </Form.Item>
                    </Col>
                    </Row>
                    <Row justify="end" gutter={[16, 16]} style={{marginBottom:"15px"}}>
                        <Col>
                            <Button block onClick={() => setIsAddClicked(false)}>
                                Cancel
                            </Button>
                        </Col>
                        <Col>
                        <Button type="primary" 
                            block 
                            onClick={handleSaveChanges}
                            icon={<CheckCircleOutlined/>}
                        >
                           Save Changes
                        </Button>
                        </Col>
                    </Row>
                </Form>
              </div>
            )}
            {!isAddClicked && (
            <Row gutter={16} style={{ marginBottom: 20 }} align="middle">
                <Col>
                <span style={{ marginRight: 8 }}><strong>Filter by: </strong></span>
                </Col>
                <Col xs={24} sm={12} md={8}>
                <Select
                    defaultValue="BSIT"
                    style={{ width: '100%' }}
                    onChange={handleProgramFilterChange}
                >
                    <Option value="BSIT">BSIT</Option>
                    <Option value="BSIS">BSIS</Option>
                    <Option value="BSSE">BSSE</Option>
                </Select>
                </Col>
            </Row>
            )}
            {loading ? (
              <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <Spin size="large" />
              </div>
            ) : (
              <>
                <div className="table-shadow-wrapper">
                    <Table
                    columns={columns}
                    dataSource={filteredData}
                    bordered
                    pagination={{ pageSize: 10 }}
                    responsive={true}
                    />
                </div>
                <div className="table-shadow-wrapper" style={{marginTop:"20px"}}>
                <Table
                columns={syllabusMappingColumns}
                dataSource={mappingData}
                rowKey="key"
                bordered
                pagination={{ pageSize: 10 }}
                responsive={true}
                />
                </div>
              </>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
