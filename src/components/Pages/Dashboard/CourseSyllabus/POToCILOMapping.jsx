/* eslint-disable no-unused-vars */
import axios from "axios";
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
  const [programFilter, setProgramFilter] = useState("");
  const [courseCodeFilter, setCourseCodeFilter] = useState("");
  const [filteredCILOData, setFilteredCILOData] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [courseCodes, setCourseCodes] = useState([]);
  const [departmentCode, setDepartmentCode] = useState("");
  const [programData, setProgramData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [programTitles, setProgramTitles] = useState([]);

  // Sample Data for CILO (Program Educational Objectives)
  const CILOData = [
    { key: "1", program: "BSIT", courseCode: "CS101", objective: "Apply IT skills.", identifier: "BSIT-CILO-01", status: "" },
    { key: "2", program: "BSIT", courseCode: "CS102", objective: "Pursue lifelong learning.", identifier: "BSIT-CILO-02", status: "Enhanced" },
    { key: "3", program: "BSIS", courseCode: "IS101", objective: "Develop information systems.", identifier: "BSIS-CILO-01", status: "Practiced" },
    { key: "4", program: "BSIS", courseCode: "IS102", objective: "Lead IT-driven business transformation.", identifier: "BSIS-CILO-02", status: "Introduced" },
    { key: "5", program: "BSSE", courseCode: "SE101", objective: "Design and develop software systems.", identifier: "BSSE-CILO-01", status: "Enhanced" },
    { key: "6", program: "BSSE", courseCode: "SE102", objective: "Solve real-world software engineering challenges.", identifier: "BSSE-CILO-02", status: "" },
  ];

  // State to track the values of the dropdowns
  const [dropdownValues, setDropdownValues] = useState({});

  // Define PO columns
  const CILOColumns = [
    { title: "PO/CILOS", dataIndex: "identifier", key: "identifier", render: (text) => <strong>{text}</strong> },
    ...['BSIT-PO-01', 'BSIT-PO-02', 'BSIT-PO-03', 'BSIT-PO-04'].map(po => ({
      title: po,
      key: po,
      render: (_, record) => (
        <Form.Item
          name={`${record.key}-${po}`}
          initialValue={record.status || ""}
        >
          <Select
            style={{ width: "100%" }}
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

  const fetchProgramCodes = async () => {
    setLoading(true);
    try {
      const extractedUserObject = localStorage.getItem("user");
      const parsedObject = JSON.parse(extractedUserObject);
      setDepartmentCode(parsedObject.Department_Code);

      const response = await axios.post(
        "http://localhost:3000/api/system/programs-master/read",
        { dept_code: parsedObject.Department_Code },
        { withCredentials: true }
      );

      const data = response?.data;
      setProgramData(data);

      const titles = Array.from(
        new Set(data.map((item) => item.Program_Title))
      );
      setProgramTitles(titles);

    } catch (error) {
      console.error("Error fetching program data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseCodes = async (programCode) => {
    setLoading(true);
    try {
      const extractedUserObject = localStorage.getItem("user");
      const parsedObject = JSON.parse(extractedUserObject);
      setDepartmentCode(parsedObject.Department_Code);

      const response = await axios.post(
        "http://localhost:3000/api/system/curriculum-courses-file-master/read",
        { dept_code: parsedObject.Department_Code, program_code: programCode },
        { withCredentials: true }
      );

      const data = response?.data;
      setCourseData(data);

      // Map the correct field for course codes
      const codes = Array.from(
        new Set(data.map((item) => item.Curr_Course_Code))
      );
      setCourseCodes(codes);

    } catch (error) {
      console.error("Error fetching course code data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramCodes();
  }, []);

  function handleDropdownChange(key, po, value) {
    setDropdownValues((prev) => ({
      ...prev,
      [`${key}-${po}`]: value,
    }));
  }

  function handleProgramFilterChange(value) {
    setProgramFilter(value);

    // Filter CILOData by program
    const filteredData = value ? CILOData.filter(course => course.program === value) : CILOData;
    setFilteredCILOData(filteredData);

    // Fetch Course Codes for the selected program
    const selectedProgram = programData.find((program) => program.Program_Title === value);
    if (selectedProgram) {
      fetchCourseCodes(selectedProgram.Program_Code);
    } else {
      setCourseCodes([]); // Clear course codes if no program is selected
    }
  }

  function handleCourseCodeFilterChange(value) {
    setCourseCodeFilter(value);

    // Filter CILOData based on program and course code
    const filteredData = CILOData.filter(course => {
      return (course.program === programFilter || programFilter === "") && (value ? course.courseCode === value : true);
    });

    setFilteredCILOData(filteredData);
  }

  const handleSave = () => {
    form.validateFields()
      .then((values) => {
        console.log("Data saved successfully:", values);
        axios.post('/api/updatePILO', values)
          .then(response => {
            console.log('PILO data updated successfully:', response.data);
          })
          .catch(error => {
            console.error('Error updating PILO data:', error);
          });
        Modal.success({ title: "Success", content: "Data saved successfully." });
      })
      .catch((errorInfo) => {
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
              <Col xs={24} lg={10}>
                <Select
                  defaultValue=""
                  style={{ width: '100%' }}
                  onChange={handleProgramFilterChange}
                >
                  {programTitles.map((title) => (
                    <Option key={title} value={title}>
                      {title}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 20 }} align="middle">
              <Col>
                <span style={{ marginRight: 8 }}><strong>Select Course Code to Filter: </strong></span>
              </Col>
              <Col xs={24} lg={6}>
                <Select
                  value={courseCodeFilter}
                  style={{ width: '100%' }}
                  onChange={handleCourseCodeFilterChange}
                  disabled={!programFilter} // Disable course code filter if no program is selected
                >
                  <Option value="">Select Course Code</Option>
                  {courseCodes.map(code => (
                    <Option key={code} value={code}>{code}</Option>
                  ))}
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
                    form={form}
                    name="CILOForm"
                    onFinish={handleSave}
                  >
                    <Table
                      columns={CILOColumns}
                      dataSource={filteredCILOData}
                      bordered
                      pagination={{ pageSize: 10 }}
                      responsive
                      rowKey="key"
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
