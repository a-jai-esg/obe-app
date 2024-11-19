/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Layout,
  Table,
  Select,
  Button,
  Row,
  Col,
  Spin,
  Modal,
  Form,
} from "antd";
import Sidebar from "../../../Global/Sidebar";
import "../Curriculum/Curriculum.css";
import "./OBEDataConfiguration.css";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Option } = Select;

export default function Curriculum() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const PEOData = [
    { key: "1", program: "BSIT", courseCode: "IT101", objective: "Apply IT skills.", identifier: "BSIT-PEO-01", status: "Enhanced" },
    { key: "2", program: "BSIT", courseCode: "IT102", objective: "Pursue lifelong learning.", identifier: "BSIT-PEO-02", status: "Introduced" },
    { key: "3", program: "BSIS", courseCode: "IS201", objective: "Develop information systems.", identifier: "BSIS-PEO-01", status: "Practiced" },
    { key: "4", program: "BSIS", courseCode: "IS202", objective: "Lead IT-driven business transformation.", identifier: "BSIS-PEO-02", status: "Enhanced" },
    { key: "5", program: "BSSE", courseCode: "SE301", objective: "Design and develop software systems.", identifier: "BSSE-PEO-01", status: "Introduced" },
    { key: "6", program: "BSSE", courseCode: "SE302", objective: "Solve real-world software engineering challenges.", identifier: "BSSE-PEO-02", status: "Practiced" },
  ];

  const [filteredPEOData, setFilteredPEOData] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedCourseCode, setSelectedCourseCode] = useState("");

  const PEOColumns = [
    {
      title: "PEO/PO",
      dataIndex: "identifier",
      key: "identifier",
      render: (text) => <strong>{text}</strong>,
    },
    ...["PO-01", "PO-02", "PO-03", "PO-04"].map((po) => ({
      title: po,
      key: po,
      render: (_, record) => (
        <Form.Item
          name={`${record.key}-${po}`}
          initialValue={record.status || ""} // Set initial value to status (if available)
          rules={[{ required: true, message: `This field is required` }]}
        >
          <Select style={{ width: "100%" }}>
            <Option value="Introduced">Introduced</Option>
            <Option value="Enhanced">Enhanced</Option>
            <Option value="Practiced">Practiced</Option>
          </Select>
        </Form.Item>
      ),
    })),
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleProgramFilterChange = (value) => {
    setSelectedProgram(value);
    setSelectedCourseCode(""); // Reset course code when program changes
    const filteredData = value ? PEOData.filter((item) => item.program === value) : [];
    setFilteredPEOData(filteredData);
  };

  const handleCourseCodeFilterChange = (value) => {
    setSelectedCourseCode(value);
    const filteredData = PEOData.filter(
      (item) =>
        item.program === selectedProgram &&
        (value ? item.courseCode === value : true)
    );
    setFilteredPEOData(filteredData);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Saved Values:", values);
        axios.post('/api/updatePILO', values)
          .then(response => {
            console.log('PILO data updated successfully:', response.data);
          })
          .catch(error => {
            console.error('Error updating PILO data:', error);
          });
        Modal.success({ title: "Success", content: "Data saved successfully." });
      })
      .catch((err) => {
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
            <Row justify="space-between" style={{ marginBottom: 20 }}>
              <Col>
                <h2 className="dashboard-header">Mapping of POs to PEOs</h2>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <strong>Select Program:</strong>
                <Select
                  value={selectedProgram}
                  onChange={handleProgramFilterChange}
                  style={{ width: "100%", marginTop: 8 }}
                >
                  <Option value="">Select Program</Option>
                  <Option value="BSIT">BSIT</Option>
                  <Option value="BSIS">BSIS</Option>
                  <Option value="BSSE">BSSE</Option>
                </Select>
              </Col>
              {/* <Col xs={24} sm={12} md={8} lg={6}>
                <strong>Select Course Code:</strong>
                <Select
                  value={selectedCourseCode}
                  onChange={handleCourseCodeFilterChange}
                  style={{ width: "100%", marginTop: 8 }}
                  disabled={!selectedProgram}
                >
                  <Option value="">Select Course Code</Option>
                  {PEOData.filter(
                    (item) => item.program === selectedProgram
                  ).map((item) => (
                    <Option key={item.courseCode} value={item.courseCode}>
                      {item.courseCode}
                    </Option>
                  ))}
                </Select>
              </Col> */}
            </Row>

            {loading ? (
              <div style={{ textAlign: "center", marginTop: 50 }}>
                <Spin size="large" />
              </div>
            ) : filteredPEOData.length > 0 ? (
              <div className="table-shadow-wrapper">
                <Form form={form} onFinish={handleSave}>
                  <Table
                    columns={PEOColumns}
                    dataSource={filteredPEOData}
                    pagination={{ pageSize: 5 }}
                    rowKey="key"
                  />
                  <Row justify="end" style={{ marginTop: 20 }}>
                    <Button
                      style={{ marginRight: 8 }}
                      onClick={() => navigate("/obe-data-configuration")}
                    >
                      Cancel
                    </Button>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Row>
                </Form>
              </div>
            ) : (
              <div style={{ textAlign: "center", marginTop: 50 }}>
                <p>Please select a program to view data.</p>
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
