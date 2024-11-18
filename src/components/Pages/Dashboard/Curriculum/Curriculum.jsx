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

const { Content } = Layout;
const { Option } = Select;

export default function Curriculum() {
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [allData, setAllData] = useState([]);
  const [revisionCodeData, setRevisionCodeData] = useState([]);
  const [programTitles, setProgramTitles] = useState([]);
  const [selectedProgramTitle, setSelectedProgramTitle] = useState(null);
  const [selectedProgramCode, setSelectedProgramCode] = useState(null);
  const [departmentCode, setDepartmentCode] = useState(null);
  const [tableData, setTableData] = useState([]);

  // fetch the programs list
  useEffect(() => {
    const fetchInitialData = async () => {
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

        const data = response.data;
        setAllData(data);

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

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/system/curriculum-courses-file-master/read",
          {
            program_code: selectedProgramTitle ? selectedProgramCode : null,
            dept_code: departmentCode,
          },
          { withCredentials: true }
        );

        const data = response.data;
        const filteredTableData = data.map((item) => ({
          record_id: item.Record_ID,
          program: item.Program_Code,
          course_code: item.Curr_Course_Code,
          descriptive_title: item.Curr_Course_Desc,
          year: item.Curr_Year,
          semester: item.Curr_Sem,
          units: item.Curr_Units,
          rev_code: item.Curr_Rev_Code,
          effective_year: item.Effective_Year,
        }));

        setTableData(filteredTableData);
      } catch (error) {
        console.error("Error fetching table data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, [selectedProgramTitle, selectedProgramCode, departmentCode]);

  useEffect(() => {
    const fetchRevisionCodes = async () => {
      if (!selectedProgramTitle) {
        setRevisionCodeData([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/system/curriculum-master/read",
          {
            program_code: selectedProgramCode,
            dept_code: departmentCode,
          },
          { withCredentials: true }
        );

        const revisionCodes = response.data;
        setRevisionCodeData(
          Array.isArray(revisionCodes) ? revisionCodes : [revisionCodes]
        );
      } catch (error) {
        console.error("Error fetching revision codes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevisionCodes();
  }, [selectedProgramTitle, selectedProgramCode, departmentCode]);

  const handleFilterChange = (value) => {
    setSelectedProgramTitle(value);
    if (value === "All Programs" || value === null) {
      setSelectedProgramCode(null);
    } else {
      const filtered = allData.filter((item) => item.Program_Title === value);
      setSelectedProgramCode(
        filtered.length > 0 ? filtered[0].Program_Code : null
      );
    }
  };

  const handleEditClick = (course) => {
    setIsEditMode(true);
    setIsEditModalVisible(true);
    form.setFieldsValue(course);
  };

  const handleAddClick = () => {
    form.resetFields();
    setIsEditMode(false);
    setIsEditModalVisible(true);
  };

  const handleModalCancel = () => {
    form.resetFields();
    setIsEditMode(false);
    setIsEditModalVisible(false);
  };

  const handleSaveChanges = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        program_code: selectedProgramCode,
        curr_rev_code: values.Curr_Rev_Code,
        curr_course_code: values.Curr_Course_Code,
        curr_course_desc: values.Curr_Course_Desc,
        curr_year: Number(values.Curr_Year),
        curr_sem: Number(values.Curr_Sem),
        curr_units: Number(values.Curr_Units),
        curr_lec_hrs: Number(values.Curr_LEC_Hrs),
        curr_lab_hrs: Number(values.Curr_LAB_Hrs),
        curr_status: 1,
        curr_crs_customfield1: null,
        curr_crs_customfield2: null,
        curr_crs_customfield3: null,
      };

      if (isEditMode) {
        await axios.post(
          "http://localhost:3000/api/system/curriculum-courses-file-master/update",
          payload,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          "http://localhost:3000/api/system/curriculum-courses-file-master/create",
          payload,
          { withCredentials: true }
        );
      }

      handleModalCancel();
      setSelectedProgramTitle(selectedProgramTitle); // Refresh the table data
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleDeleteClick = async (courseId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/system/curriculum-courses-file-master/delete`,
        {
          data: { id: courseId },
          withCredentials: true,
        }
      );
      setSelectedProgramTitle(selectedProgramTitle); // Refresh the table data
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "record_id",
      key: "record_id",
    },
    {
      title: "Program",
      dataIndex: "program",
      key: "program",
    },
    {
      title: "Course Code",
      dataIndex: "course_code",
      key: "course_code",
    },
    {
      title: "Descriptive Title",
      dataIndex: "descriptive_title",
      key: "descriptive_title",
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
      dataIndex: "rev_code",
      key: "rev_code",
    },
    {
      title: "Effective Year",
      dataIndex: "effective_year",
      key: "effective_year",
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
                onClick={() => handleDeleteClick(record.record_id)}
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
                  disabled={!selectedProgramTitle} // Disable button when "All Programs" is selected
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
                dataSource={tableData}
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
              <Form.Item label="Program" name="program">
                <span>
                  <b>{selectedProgramTitle}</b>
                </span>
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
              {/* Revision Code Field */}
              <Form.Item
                label="Revision Code"
                name="Curr_Rev_Code"
                rules={[
                  { required: true, message: "Please select revision code" },
                ]}
              >
                <Select placeholder="Select Revision Code" loading={loading}>
                  {revisionCodeData.map((revCode) => {
                    console.log(revCode);
                    return (
                      <Option
                        key={revCode.Curr_Rev_Code}
                        value={revCode.Curr_Rev_Code}
                      >
                        {revCode.Curr_Rev_Code} - {revCode.Curr_Status} (
                        {revCode.Program_Code}- {revCode.Curr_Year})
                      </Option>
                    );
                  })}
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
