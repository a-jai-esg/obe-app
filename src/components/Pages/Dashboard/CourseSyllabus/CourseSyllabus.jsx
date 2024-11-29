/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  SettingOutlined,
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
import axios from "axios";
import Sidebar from "../../../Global/Sidebar";
import "../Curriculum/Curriculum.css";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Option } = Select;

export default function CourseSyllabus() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  // States for handling modals
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Track edit mode
  const [cloFields, setCloFields] = useState([{ id: Date.now(), value: "" }]); // State for CLOs
  const [selectedCourse, setSelectedCourse] = useState(null); // Store selected course data

  const [programTitles, setProgramTitles] = useState([]);
  const [selectedFilterValue, setSelectedFilterValue] = useState("all");
  const [programData, setProgramData] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null); // Store selected program

  // Program related data
  const [filteredPEOData, setFilteredPEOData] = useState([]);
  const [filteredPILOData, setFilteredPILOData] = useState([]);
  const [programCode, setProgramCode] = useState();
  const [deptCode, setDepartmentCode] = useState();
  // Open Edit Modal
  function handleEditClick(course) {
    form.setFieldsValue(course); // Set form fields with selected course data
    setCloFields(
      course.courseIntendedLearningOutcomes.map((outcome, index) => ({
        id: index,
        value: outcome,
      }))
    ); // Set CLO fields based on course data
    setSelectedCourse(course); // Store selected course
    setIsEditMode(true); // Set to Edit Mode
    setIsEditModalVisible(true);
  }

  // Open Add Modal
  function handleAddClick() {
    form.resetFields();
    setIsEditMode(false); // Set to Add Mode
    setIsEditModalVisible(true);
  }

  function handleModalCancel() {
    form.resetFields(); // Reset form fields
    setIsEditModalVisible(false); // Close the modal
    setIsEditMode(false); // Reset edit mode
    setCloFields([{ id: Date.now(), value: "" }]); // Reset CLO fields
  }

  function handleSaveChanges() {
    // Get the form values without validation
    const values = form.getFieldsValue();
    const objectivesOrOutcomes = groupedData.map((field) => field.value);

    const selectedProgram = programData.find(
      (program) => program.Program_Title === selectedFilterValue
    );

    const handlePostRequest = (url, data) => {
      axios
        .post(url, data, { withCredentials: true })
        .then((response) => {
          console.log("Data updated successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    };

    const updateData = (item) => ({
      ...item,
      [currentType === "PEO" ? "objectives" : "outcomes"]: objectivesOrOutcomes,
      program: values.program,
    });

    if (isEditMode) {
      if (currentType === "PEO") {
        const updatedPEOData = filteredPEOData.map((item) =>
          item.key === currentRecord.key ? updateData(item) : item
        );
        setFilteredPEOData(updatedPEOData);
      } else {
        const updatedPILOData = filteredPILOData.map((item) =>
          item.key === currentRecord.key ? updateData(item) : item
        );
        setFilteredPILOData(updatedPILOData);
      }
    } else {
      const newData = {
        ...values,
        [currentType === "PEO" ? "objectives" : "outcomes"]:
          objectivesOrOutcomes,
      };

      if (currentType === "PEO") {
        setFilteredPEOData([...filteredPEOData, newData]);

        objectivesOrOutcomes.forEach((objective) => {
          handlePostRequest(
            "http://localhost:3000/api/system/peo-master/create",
            {
              program_code: selectedProgram?.Program_Code,
              peo_desc: objective,
              peo_status: 1,
              peo_custom_field1: null,
              peo_custom_field2: null,
              peo_custom_field3: null,
            }
          );
        });
      } else {
        setFilteredPILOData([...filteredPILOData, newData]);

        objectivesOrOutcomes.forEach((outcome) => {
          handlePostRequest(
            "http://localhost:3000/api/system/po-master/create",
            {
              program_code: selectedProgram?.Program_Code,
              po_desc: outcome,
              po_status: 1,
              po_custom_field1: null,
              po_custom_field2: null,
              po_custom_field3: null,
            }
          );
        });
      }
    }

    form.resetFields(); // Reset the form fields
    setIsModalVisible(false); // Hide the modal
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
      id: "BSIT-CILO-01",
      key: "1",
      program: "BSIT",
      effectiveYear: "2024",
      courseCode: "MATH101",
      units: 3,
      descriptiveTitle: "Mathematics 101",
      courseObjective: "Learn fundamental mathematics concepts.",
      courseIntendedLearningOutcomes: [
        "Understand basic arithmetic",
        "Apply mathematical principles to real-world problems",
      ],
    },
    {
      id: "BSIT-CILO-02",
      key: "2",
      program: "BSIT",
      effectiveYear: "2024",
      courseCode: "CS101",
      units: 3,
      descriptiveTitle: "Computer Science 101",
      courseObjective: "Introduce basics of computer science and programming.",
      courseIntendedLearningOutcomes: [
        "Understand the fundamentals of programming",
        "Solve basic problems using algorithms",
      ],
    },
    {
      id: "BSIS-CILO-01",
      key: "3",
      program: "BSIS",
      effectiveYear: "2024",
      courseCode: "IT101",
      units: 4,
      descriptiveTitle: "Information Technology 101",
      courseObjective:
        "Explore information technology principles and applications.",
      courseIntendedLearningOutcomes: [
        "Understand IT fundamentals",
        "Use technology to solve basic problems",
      ],
    },
    {
      id: "BSIT-CILO-03",
      key: "4",
      program: "BSIT",
      effectiveYear: "2023",
      courseCode: "MATH102",
      units: 3,
      descriptiveTitle: "Mathematics 102",
      courseObjective:
        "Advance knowledge in mathematics for scientific applications.",
      courseIntendedLearningOutcomes: [
        "Solve complex mathematical problems",
        "Apply mathematical techniques to real-world scenarios",
      ],
    },
    {
      id: "BSIS-CILO-02",
      key: "5",
      program: "BSIS",
      effectiveYear: "2023",
      courseCode: "DBMS101",
      units: 3,
      descriptiveTitle: "Database Management Systems",
      courseObjective: "Learn about database management and SQL fundamentals.",
      courseIntendedLearningOutcomes: [
        "Design basic databases",
        "Understand SQL and its application in data management",
      ],
    },
  ];

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
      title: "Course Intended Learning Outcomes",
      dataIndex: "courseIntendedLearningOutcomes",
      key: "courseIntendedLearningOutcomes",
      render: (outcomes) => (
        <ul>
          {outcomes.map((outcome, index) => (
            <li key={index}>{outcome}</li>
          ))}
        </ul>
      ),
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

  const handleProgramFilterChange = (value) => {
    setSelectedFilterValue(value); // Update selected filter value

    if (value === "all") {
      // Handle "All Programs" case: Set selectedProgram to null and programCode to null
      setSelectedProgram(null);
      setProgramCode(null); // Clear the program code when "all" is selected
    } else {
      // Find the selected program from the list and set it
      const program = programData.find(
        (program) => program.Program_Title === value
      );
      setSelectedProgram(program);
      setProgramCode(program.Program_Code); // Set the program code based on the selected program
    }
  };

  useEffect(() => {
    const fetchProgramData = async () => {
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

        setProgramData(response.data);
        const titles = Array.from(
          new Set(response.data.map((item) => item.Program_Title))
        );
        setProgramTitles(titles);

        // When the filter is "all", reset selected program to null or show all programs
        if (selectedFilterValue === "all") {
          setSelectedProgram(null);
          setProgramCode(null); // Clear program code when "all" is selected
        } else {
          const program = response.data.find(
            (program) => program.Program_Title === selectedFilterValue
          );
          setSelectedProgram(program);
          setProgramCode(program.Program_Code); // Set program code based on the selected program
        }
      } catch (error) {
        console.error("Error fetching program data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramData();
  }, [selectedFilterValue]); // Depend on selectedFilterValue to change program selection

  // Handle filter change for year
  function handleYearFilterChange(value) {
    setFilteredData(
      allData.filter(
        (course) => course.effectiveYear === value || value === "all"
      )
    );
  }

  // Simulate data fetching
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  // Handle change in CLO input field
  function handleCloChange(value, id) {
    const newCloFields = cloFields.map((field) =>
      field.id === id ? { ...field, value } : field
    );
    setCloFields(newCloFields);
  }

  // Add a new CLO input field
  function handleAddCloField() {
    setCloFields([...cloFields, { id: Date.now(), value: "" }]);
  }

  // Remove a CLO input field
  function handleRemoveCloField(id) {
    setCloFields(cloFields.filter((field) => field.id !== id));
  }

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
                <h2 className="dashboard-header">COURSE SYLLABUS</h2>
              </Col>
              <Col>
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item onClick={handleAddClick}>
                        Add Course Syllabus
                      </Menu.Item>
                      <Menu.Item onClick={() => navigate("/po-cilo-mapping")}>
                        Map POs to CILOs
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={["click"]}
                >
                  <Button
                    type="primary"
                    className="add-curriculum-btn"
                    icon={<SettingOutlined />}
                  >
                    Configure Course Syllabus <DownOutlined />
                  </Button>
                </Dropdown>
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
                  value={selectedFilterValue} // Use the selectedFilterValue here
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

            {/*Add/EditModal */}
            <Modal
              title={isEditMode ? "Edit Course" : "Add Course"}
              visible={isEditModalVisible}
              onCancel={handleModalCancel}
              footer={[
                <Button key="cancel" onClick={handleModalCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSaveChanges}>
                  {isEditMode ? "Save Changes" : "Add Course"}
                </Button>,
              ]}
              width={800}
              maskClosable={false}
            >
              <Form form={form} layout="vertical" onFinish={handleSaveChanges}>
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <Form.Item
                      label="Program"
                      name="program"
                      rules={[
                        { required: true, message: "Please select a program" },
                      ]}
                    >
                      <Select
                        value={selectedFilterValue} // Use the selectedFilterValue here
                        style={{ width: "100%" }}
                        onChange={handleProgramFilterChange}
                      >
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
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Effective Year"
                      name="effectiveYear"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the effective year",
                        },
                      ]}
                    >
                      <Input placeholder="Enter Effective Year" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Course Code"
                      name="courseCode"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the course code",
                        },
                      ]}
                    >
                      <Input placeholder="Enter Course Code" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Units"
                      name="units"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the number of units",
                        },
                      ]}
                    >
                      <InputNumber
                        min={1}
                        max={10}
                        placeholder="Enter Units"
                        style={{ width: "100%" }}
                      />
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
                          message: "Please enter the descriptive title",
                        },
                      ]}
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
                      rules={[
                        {
                          required: true,
                          message: "Please enter the course objective",
                        },
                      ]}
                    >
                      <Input.TextArea
                        rows={3}
                        placeholder="State Course Objective"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <Form.Item
                      label="Course Intended Learning Outcomes"
                      name="courseIntendedLearningOutcomes"
                      rules={[
                        {
                          required: true,
                          message: "Please add at least one course outcome",
                        },
                      ]}
                    >
                      {cloFields.map((field, index) => (
                        <Row key={field.id} gutter={[16, 8]}>
                          <Col xs={24} md={20}>
                            <Input
                              style={{ marginBottom: "15px" }}
                              placeholder="Enter Course Outcome"
                              value={field.value}
                              onChange={(e) =>
                                handleCloChange(e.target.value, field.id)
                              }
                            />
                          </Col>
                          <Col xs={24} md={4}>
                            <Button
                              style={{ marginBottom: "15px" }}
                              type="text"
                              icon={<DeleteOutlined />}
                              danger
                              onClick={() => handleRemoveCloField(field.id)}
                            />
                          </Col>
                        </Row>
                      ))}

                      <Row>
                        <Col>
                          <Button
                            type="dashed"
                            icon={<PlusCircleOutlined />}
                            onClick={handleAddCloField}
                            block
                            style={{ marginTop: 10 }}
                          >
                            Add Outcome
                          </Button>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Modal>

            {/* Delete Modal */}
            <Modal
              title="Delete Course"
              visible={isDeleteModalVisible}
              onOk={handleDeleteConfirm}
              onCancel={handleDeleteCancel}
              okText="Yes, Delete"
              cancelText="Cancel"
            >
              <p>Are you sure you want to delete this course?</p>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
