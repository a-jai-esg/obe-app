/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, DownOutlined } from "@ant-design/icons";
import { Layout, Table, Select, Button, Row, Col, Spin, Modal, Form } from "antd";
import Sidebar from "../../../Global/Sidebar";
import "../Curriculum/Curriculum.css";
import "../OBEDataConfiguration/OBEDataConfiguration.css";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Option } = Select;

export default function Curriculum() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  // Sample Data for CILO (Program Educational Objectives)
  const CILOData = [
    { key: "1", program: "BSIT", objective: "Apply IT skills.", identifier: "BSIT-CILO-01" },
    { key: "2", program: "BSIT", objective: "Pursue lifelong learning.", identifier: "BSIT-CILO-02" },
    { key: "3", program: "BSIS", objective: "Develop information systems.", identifier: "BSIS-CILO-01" },
    { key: "4", program: "BSIS", objective: "Lead IT-driven business transformation.", identifier: "BSIS-CILO-02" },
    { key: "5", program: "BSSE", objective: "Design and develop software systems.", identifier: "BSSE-CILO-01" },
    { key: "6", program: "BSSE", objective: "Solve real-world software engineering challenges.", identifier: "BSSE-CILO-02" },
  ];

  const [filteredCILOData, setFilteredCILOData] = useState([]);
  
  // State to track the values of the dropdowns
  const [dropdownValues, setDropdownValues] = useState({});

  // Define PO columns
  const CILOColumns = [
    {
      title: "PO/CILOS",
      dataIndex: "identifier",
      key: "identifier",
      render: (text) => <strong>{text}</strong>,
    },
    // Mapping POs dynamically for each program
    ...['BSIT-PO-01', 'BSIT-PO-02', 'BSIT-PO-03', 'BSIT-PO-04'].map(po => ({
      title: po,
      key: po,
      render: (_, record) => (
        <Form.Item
          name={`${record.key}-${po}`}
          initialValue=""
          rules={[{ required: true, message: `This field is required` }]} // Validation rule
        >
          <Select
            style={{ width: "full" }}
            onChange={(value) => handleDropdownChange(record.key, po, value)}
          >
            <Option value="Introduced">Introduced</Option>
            <Option value="Enhanced">Enhanced</Option>
            <Option value="Practiced">Practiced</Option>
          </Select>
        </Form.Item>
      ),
    })),
  ];

  function handleDropdownChange(key, po, value) {
    setDropdownValues((prev) => ({
      ...prev,
      [`${key}-${po}`]: value,
    }));
  }

  function handleProgramFilterChange(value) {
    if (value === "") {
      setFilteredCILOData([]);
    } else {
      setFilteredCILOData(CILOData.filter(course => course.program === value));
    }
  }

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleSave = () => {
    // Validate form
    form
      .validateFields()
      .then((values) => {
        // Logic to save the data
        console.log("Data saved successfully:", values);
        // You can add your save logic here, like making an API request
      })
      .catch((errorInfo) => {
        // Show error message if validation fails
        Modal.error({
          title: "Validation Error",
          content: "Please select a value for all dropdowns.",
        });
      });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Content>
          <div className="dashboard-content">
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
              <Col>
                <h2 className="dashboard-header">MAPPING OF (POs) to CILOs</h2>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 20 }} align="middle">
              <Col>
                <span style={{ marginRight: 8 }}><strong>Select Program to Map: </strong></span>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  defaultValue=""
                  style={{ width: '100%' }}
                  onChange={handleProgramFilterChange}
                >
                  <Option value="">Select Program</Option>
                  <Option value="BSIT">BSIT</Option>
                  <Option value="BSIS">BSIS</Option>
                  <Option value="BSSE">BSSE</Option>
                </Select>
              </Col>
            </Row>

            {loading ? (
              <div style={{ textAlign: "center", marginTop: "100px" }}>
                <Spin size="large" />
              </div>
            ) : (
              filteredCILOData.length > 0 && (
                <div className="table-shadow-wrapper">
                  <Form
                    name="CILOForm"
                    onFinish={handleSave} // This triggers the save logic
                  >
                    <Table 
                      columns={CILOColumns} 
                      dataSource={filteredCILOData} 
                      bordered 
                      pagination={{ pageSize: 10 }} 
                      responsive={true}
                      rowKey="key" // Ensure rowKey is unique for each row
                    />
                    <Row justify="end" style={{ marginTop: 20 }}>
                      <Col>
                        <Button
                          style={{ marginRight: "5px" }}
                          onClick={() => { navigate('/course-syllabus') }}
                        >
                          Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                          Save
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </div>
              )
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
