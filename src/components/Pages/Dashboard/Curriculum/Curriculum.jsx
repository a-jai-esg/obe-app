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
} from "antd";
import Sidebar from "../../../Global/Sidebar";
import axios from "axios";
import "./Curriculum.css";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Option } = Select;

export default function Curriculum() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Track edit mode

  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [revisionCodeData, setRevisionCodeData] = useState([]);

  const [programTitles, setProgramTitles] = useState([]);
  const [selectedProgramTitle, setSelectedProgramTitle] = useState(null); // Track selected program title for filtering
  const [selectedProgramCode, setSelectedProgramCode] = useState(null);

  // Fetch program data from API
  useEffect(() => {
    setLoading(true);
    const extractedUserObject = localStorage.getItem("user");
    const parsedObject = JSON.parse(extractedUserObject);

    const departmentCode = parsedObject.Department_Code;

    axios
      .post(
        "http://localhost:3000/api/system/programs-master/read",
        { Department_Code: departmentCode },
        { withCredentials: true }
      )
      .then((response) => {
        const data = response.data;
        setAllData(data);
        setFilteredData(data);
        setLoading(false);
        const titles = Array.from(
          new Set(data.map((item) => item.Program_Title))
        );

        setProgramTitles(titles);
        setProgramCodes(programCode);
      })
      .catch((error) => {
        console.error("Error fetching program data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedProgramTitle) {
      setLoading(true); // Start loading before the API call

      const findProgramByTitle = (title) => {
        return filteredData.filter(
          (program) => program.Program_Title === title
        );
      };

      const programCode = findProgramByTitle(selectedProgramTitle);
      if (programCode.length > 0) {
        console.log(programCode[0].Program_Code); // get first index

        setSelectedProgramCode(programCode[0].Program_Code);

        axios
          .post(
            "http://localhost:3000/api/system/curriculum-master/read", // Update with the correct endpoint
            { Program_Code: programCode[0].Program_Code }, // Pass selected program title or code
            { withCredentials: true }
          )
          .then((response) => {
            const data = response.data;
            setRevisionCodeData(Array.isArray(data) ? data : [data]); // Ensure the data is always an array
            setLoading(false); // Stop loading once data is received
          })
          .catch((error) => {
            console.error("Error fetching revision codes:", error);
            setLoading(false);
          });
      } else {
        setLoading(false); // Stop loading if no program code is found
      }
    }
  }, [selectedProgramTitle]);

  // Handle program title filter change
  function handleFilterChange(value) {
    setSelectedProgramTitle(value);
    if (value) {
      const filtered = allData.filter((item) => item.Program_Title === value);
      setFilteredData(filtered);
    } else {
      setFilteredData(allData); // Reset filter
    }
  }

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

  // Handle save changes (add or update)
  function handleSaveChanges() {
    form
      .validateFields()
      .then((values) => {
        console.log(isEditMode);

        if (isEditMode) {
          // Update course
          axios
            .put(
              "http://localhost:3000/api/system/curriculum-courses-file-master/update",
              {
                Program_Code: selectedProgramCode,
                Curr_Rev_Code: values.Curr_Rev_Code,
                Curr_Course_Code: values.Curr_Course_Code,
                Curr_Course_Desc: values.Curr_Course_Desc,
                Curr_Year: Number(values.Curr_Year),
                Curr_Sem: Number(values.Curr_Sem),
                Curr_Units: Number(values.Curr_Units),
                Curr_LEC_Hrs: Number(values.Curr_LEC_Hrs),
                Curr_LAB_Hrs: Number(values.Curr_LAB_Hrs),
                Curr_Status: 1,
                Curr_CRS_CustomField1: null,
                Curr_CRS_CustomField2: null,
                Curr_CRS_CustomField3: null,
              },
              { withCredentials: true }
            )
            .then((response) => {
              const updatedData = response.data;
              setAllData(updatedData);
              setFilteredData(updatedData);
              setIsEditModalVisible(false);
              form.resetFields();
            })
            .catch((error) => {
              console.error("Error updating course:", error);
            });
        } else {
          // Add new course
          axios
            .post(
              "http://localhost:3000/api/system/curriculum-courses-file-master/create",
              {
                Program_Code: selectedProgramCode,
                Curr_Rev_Code: values.Curr_Rev_Code,
                Curr_Course_Code: values.Curr_Course_Code,
                Curr_Course_Desc: values.Curr_Course_Desc,
                Curr_Year: Number(values.Curr_Year),
                Curr_Sem: Number(values.Curr_Sem),
                Curr_Units: Number(values.Curr_Units),
                Curr_LEC_Hrs: Number(values.Curr_LEC_Hrs),
                Curr_LAB_Hrs: Number(values.Curr_LAB_Hrs),
                Curr_Status: 1,
                Curr_CRS_CustomField1: null,
                Curr_CRS_CustomField2: null,
                Curr_CRS_CustomField3: null,
              },
              { withCredentials: true }
            )
            .then((response) => {
              const newData = response.data;
              setAllData(newData);
              setFilteredData(newData);
              setIsEditModalVisible(false);
              form.resetFields();
            })
            .catch((error) => {
              console.error("Error adding course:", error);
            });
        }
      })
      .catch((info) => {
        console.log("Validation failed:", info);
      });
  }

  // Handle delete
  function handleDeleteClick(courseId) {
    axios
      .delete(
        `http://localhost:3000/api/system/curriculum-courses-file-master/delete`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        const updatedData = response.data;
        setAllData(updatedData);
        setFilteredData(updatedData);
      })
      .catch((error) => {
        console.error("Error deleting course:", error);
      });
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
      title: "Rev Code",
      dataIndex: "revCode",
      key: "revCode",
    },
    {
      title: "Effective Year",
      dataIndex: "effectiveYear",
      key: "effectiveYear",
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Dropdown
          overlay={
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
                onClick={() => handleDeleteClick(record.id)} // Use course ID
              >
                Delete
              </Menu.Item>
            </Menu>
          }
        >
          <Button>
            Actions <DownOutlined />
          </Button>
        </Dropdown>
      ),
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

            {/* Filter Dropdown */}
            <Row style={{ marginBottom: 20 }}>
              <Col span={6}>
                <Select
                  placeholder="Select Program"
                  value={selectedProgramTitle}
                  onChange={handleFilterChange}
                  style={{ width: "100%" }}
                >
                  <Option value={null}>All Programs</Option>
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
              <Table
                columns={columns}
                dataSource={filteredData}
                bordered
                pagination={{ pageSize: 10 }}
                responsive={true}
              />
            )}
          </div>
        </Content>
      </Layout>

      {/* Add/Edit Curriculum Modal */}
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
          {/* Program Field Spanning Full Width */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24}>
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

          {/* Effective Year, Revision Code, and Course Code in One Row */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8} md={8}>
              <Form.Item
                label="Course Code"
                name="Curr_Course_Code"
                rules={[
                  { required: true, message: "Please enter course code" },
                ]}
              >
                <Input placeholder="Enter Course Code" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8} md={8}>
              <Form.Item
                label="Effective Year"
                name="effectiveYear"
                rules={[
                  { required: true, message: "Please enter effective year" },
                ]}
              >
                <Input placeholder="Enter Effective Year" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8} md={8}>
              {/* Revision Code Field */}
              <Form.Item
                label="Revision Code"
                name="Curr_Rev_Code"
                rules={[
                  { required: true, message: "Please select revision code" },
                ]}
              >
                <Select placeholder="Select Revision Code" loading={loading}>
                  {revisionCodeData.map((revCode) => (
                    <Option
                      key={revCode.Curr_Rev_Code}
                      value={revCode.Curr_Rev_Code}
                    >
                      {revCode.Curr_Rev_Code} - {revCode.Curr_Status} (
                      {revCode.Curr_Year})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Descriptive Title, Year, Semester, and Units in One Row */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8} md={8}>
              <Form.Item
                label="Descriptive Title"
                name="Curr_Course_Desc"
                rules={[
                  { required: true, message: "Please enter descriptive title" },
                ]}
              >
                <Input placeholder="Enter Descriptive Title" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8} md={8}>
              <Form.Item
                label="Year"
                name="Curr_Year"
                rules={[{ required: true, message: "Please select a year" }]}
              >
                <Select placeholder="Select Year">
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={8} md={8}>
              <Form.Item
                label="Semester"
                name="Curr_Sem"
                rules={[
                  { required: true, message: "Please select a semester" },
                ]}
              >
                <Select placeholder="Select Semester">
                  <Option value="1">1st Semester</Option>
                  <Option value="2">2nd Semester</Option>
                  <Option value="4">Summer</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={8} md={8}>
              <Form.Item
                label="Units"
                name="Curr_Units"
                rules={[{ required: true, message: "Please enter units" }]}
              >
                <Input placeholder="Enter Units" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Hours Lecture"
                name="Curr_LEC_Hrs"
                rules={[
                  { required: true, message: "Please enter hours for lecture" },
                ]}
              >
                <Input placeholder="Enter Hours for Lecture" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Hours Laboratory"
                name="Curr_LAB_Hrs"
                rules={[
                  {
                    required: true,
                    message: "Please enter hours for laboratory",
                  },
                ]}
              >
                <Input placeholder="Enter Hours for Laboratory" />
              </Form.Item>
            </Col>
          </Row>

          {/* Save Changes Button */}
          <Button
            type="primary"
            onClick={handleSaveChanges}
            style={{ width: "100%" }}
          >
            Save Changes
          </Button>
        </Form>
      </Modal>
    </Layout>
  );
}
