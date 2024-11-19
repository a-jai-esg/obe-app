/* eslint-disable no-unused-vars */
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
  Tabs,
} from "antd";
import Sidebar from "../../../Global/Sidebar";
import "../Curriculum/Curriculum.css";
import "./OBEDataConfiguration.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const { Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;

export default function Curriculum() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  // States for handling modals
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [currentType, setCurrentType] = useState(""); // 'PEO' or 'PILO'
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [groupedData, setGroupedData] = useState([
    { id: Date.now(), value: "" },
  ]);

  const [programTitles, setProgramTitles] = useState([]);
  const [selectedFilterValue, setSelectedFilterValue] = useState("all");

  // program data
  const [programData, setProgramData] = useState([]);
  const [filteredPEOData, setFilteredPEOData] = useState([]);
  const [filteredPILOData, setFilteredPILOData] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const extractedUserObject = localStorage.getItem("user");
        const parsedObject = JSON.parse(extractedUserObject);

        const response = await axios.post(
          "http://localhost:3000/api/system/programs-master/read",
          { dept_code: parsedObject.Department_Code },
          { withCredentials: true }
        );

        // Set program data and extract program titles
        setProgramData(response.data);
        const titles = Array.from(
          new Set(response.data.map((item) => item.Program_Title))
        );
        setProgramTitles(titles);

        // Extract the program code based on the selected program title
        const selectedProgram = response.data.find(
          (program) => program.Program_Title === selectedFilterValue
        );

        if (selectedProgram) {
          const program_code = selectedProgram.Program_Code;

          // Fetch PEO data
          const peoResponse = await axios.post(
            "http://localhost:3000/api/system/peo-master/read",
            {
              dept_code: parsedObject.Department_Code,
              program_code: program_code,
            },
            { withCredentials: true }
          );

          setFilteredPEOData(peoResponse.data); // Set initial filtered PEO data

          // Fetch PILO data
          const poResponse = await axios.post(
            "http://localhost:3000/api/system/po-master/read",
            {
              dept_code: parsedObject.Department_Code,
              program_code: program_code,
            },
            { withCredentials: true }
          );

          setFilteredPILOData(poResponse.data); // Set initial filtered PILO data
        }
      } catch (error) {
        console.error("Error fetching program data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [selectedFilterValue]); // Depend on selectedFilterValue

  const PEOColumns = [
    { title: "Program", dataIndex: "program", key: "program" },
    {
      title: "Program Educational Objectives",
      dataIndex: "objectives",
      key: "objectives",
      render: (objectives) => (
        <ul>
          {objectives.map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="edit"
                icon={<EditOutlined />}
                onClick={() => handleEditClick(record, "PEO")}
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
          }
          trigger={["click"]}
        >
          <Button>
            Actions <DownOutlined />
          </Button>
        </Dropdown>
      ),
    },
  ];

  const PILOColumns = [
    { title: "Program", dataIndex: "program", key: "program" },
    {
      title: "Program Intented Learning Outcomes",
      dataIndex: "outcomes",
      key: "outcomes",
      render: (outcomes) => (
        <ul>
          {outcomes.map((outcome, index) => (
            <li key={index}>{outcome}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="edit"
                icon={<EditOutlined />}
                onClick={() => handleEditClick(record, "PILO")}
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
          }
          trigger={["click"]}
        >
          <Button>
            Actions <DownOutlined />
          </Button>
        </Dropdown>
      ),
    },
  ];

  // function handleEditClick(record, type) {
  //   setCurrentType(type);
  //   setIsEditMode(true);
  //   setCurrentRecord(record);
  //   form.setFieldsValue(record);
  //   setIsModalVisible(true);
  // }
  function handleEditClick(record, type) {
    setCurrentType(type);
    setIsEditMode(true);
    setCurrentRecord(record);
    form.setFieldsValue(record);

    if (type === "PEO") {
      setGroupedData(
        record.objectives.map((objective) => ({
          id: Date.now() + Math.random(), // Unique ID for each objective
          value: objective,
        }))
      );
    } else {
      setGroupedData(
        record.outcomes.map((outcome) => ({
          id: Date.now() + Math.random(), // Unique ID for each outcome
          value: outcome,
        }))
      );
    }
    setIsModalVisible(true);
  }

  function handleAddClick(type) {
    setCurrentType(type);
    setIsEditMode(false);
    form.resetFields();
    setIsModalVisible(true);
  }

  function handleModalCancel() {
    form.resetFields();
    setIsModalVisible(false);
    setIsEditMode(false);
    setGroupedData([{ id: Date.now(), value: "" }]);
  }

  function handleDeleteClick(record) {
    setCurrentRecord(record);
    setIsDeleteModalVisible(true);
  }

  function handleDeleteConfirm() {
    // Logic for deleting the record
    console.log(`Deleted record:`, currentRecord);
    // Remove the record from the data array based on currentType (PEO or PILO)
    if (currentType === "PEO") {
      setFilteredPEOData(
        filteredPEOData.filter((item) => item.key !== currentRecord.key)
      );
    } else {
      setFilteredPILOData(
        filteredPILOData.filter((item) => item.key !== currentRecord.key)
      );
    }
    setCurrentRecord(null);
    form.resetFields();
    setIsDeleteModalVisible(false);
  }

  function handleDeleteCancel() {
    form.resetFields();
    setCurrentRecord(null);
    setIsDeleteModalVisible(false);
  }

  function handleSaveChanges(values) {
    if (isEditMode) {
      console.log(`Editing ${currentType}`, values);
      if (currentType === "PEO") {
        // Update PEO data
        const updatedData = filteredPEOData.map((item) =>
          item.key === currentRecord.key
            ? {
                ...item,
                objectives: groupedData.map((field) => field.value),
              }
            : item
        );
        setFilteredPEOData(updatedData);
      } else {
        // Update PILO data
        const updatedData = filteredPILOData.map((item) =>
          item.key === currentRecord.key
            ? { ...item, outcomes: groupedData.map((field) => field.value) }
            : item
        );
        setFilteredPILOData(updatedData);
      }
    } else {
      console.log(`Adding new ${currentType}`, values);
      if (currentType === "PEO") {
        // Add new PEO data
        setFilteredPEOData([
          ...filteredPEOData,
          {
            ...values,
            objectives: groupedData.map((field) => field.value),
          },
        ]);
      } else {
        // Add new PILO data
        setFilteredPILOData([
          ...filteredPILOData,
          { ...values, outcomes: groupedData.map((field) => field.value) },
        ]);
      }
    }
    form.resetFields();
    setIsModalVisible(false);
  }

  function handleProgramFilterChange(value) {
    setFilteredPEOData(
      PEOData.filter((course) => course.program === value || value === "all")
    );
    setFilteredPILOData(
      PILOData.filter((course) => course.program === value || value === "all")
    );
  }

  function handleGroupedData(value, id) {
    const newgroupedData = groupedData.map((field) =>
      field.id === id ? { ...field, value } : field
    );
    setGroupedData(newgroupedData);
  }

  function handleAdd() {
    setGroupedData([...groupedData, { id: Date.now(), value: "" }]);
  }

  function handleRemove(id) {
    setGroupedData(groupedData.filter((field) => field.id !== id));
  }

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
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: 20 }}
            >
              <Col>
                <h2 className="dashboard-header">OBE DATA CONFIGURATION</h2>
              </Col>
              <Col>
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item
                        key="addPO"
                        onClick={() => handleAddClick("PEO")}
                      >
                        Add PEO
                      </Menu.Item>
                      <Menu.Item
                        key="addPILO"
                        onClick={() => handleAddClick("PILO")}
                      >
                        Add PO/PILO
                      </Menu.Item>
                      <Menu.Item
                        key="map"
                        onClick={() => navigate("/peo-pilo-mapping")}
                      >
                        Map POs/PILOs to PEO
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={["click"]}
                >
                  <Button type="primary" icon={<PlusCircleOutlined />}>
                    Add <DownOutlined />
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
            </Row>

            {loading ? (
              <div style={{ textAlign: "center", marginTop: "100px" }}>
                <Spin size="large" />
              </div>
            ) : (
              <Tabs defaultActiveKey="PEO">
                <TabPane tab="Program Educational Objectives" key="PEO">
                  <div className="table-shadow-wrapper">
                    <Table
                      columns={PEOColumns}
                      dataSource={filteredPEOData}
                      bordered
                      pagination={{ pageSize: 10 }}
                      responsive={true}
                    />
                  </div>
                </TabPane>
                <TabPane tab="Program Outcomes" key="PILO">
                  <div className="table-shadow-wrapper">
                    <Table
                      columns={PILOColumns}
                      dataSource={filteredPILOData}
                      bordered
                      pagination={{ pageSize: 10 }}
                      responsive={true}
                    />
                  </div>
                </TabPane>
              </Tabs>
            )}

            <Modal
              title={`${isEditMode ? "Edit" : "Add"} 
                ${
                  currentType === "PEO"
                    ? "Program Educational Objective"
                    : "Program Outcome/Program Intended Learning Outcome"
                }
             `}
              visible={isModalVisible}
              onCancel={handleModalCancel}
              onOk={handleSaveChanges}
              okText="Save Changes"
              width={600}
              maskClosable={false}
            >
              <Form form={form} layout="vertical">
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <Form.Item
                      label="Program"
                      name="program"
                      rules={[
                        { required: true, message: "Please select a program" },
                      ]}
                    >
                      <Select placeholder="Select Program">
                        <Option value="all">All Programs</Option>
                        {programTitles.map((title) => (
                          <Option key={title} value={title}>
                            {title}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                {currentType !== "PILO" ? (
                  <>
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <Form.Item
                          label="Program Educational Objectives"
                          name="objectives"
                          rules={[
                            {
                              required: true,
                              message: "Please add at least one objective",
                            },
                          ]}
                        >
                          {groupedData.map((field, index) => (
                            <Row key={field.id} gutter={[16, 8]}>
                              <Col xs={24} md={20}>
                                <Input
                                  style={{ marginBottom: "15px" }}
                                  placeholder="Enter Objective"
                                  value={field.value}
                                  onChange={(e) =>
                                    handleGroupedData(e.target.value, field.id)
                                  }
                                />
                              </Col>
                              <Col xs={24} md={4}>
                                <Button
                                  style={{ marginBottom: "15px" }}
                                  type="text"
                                  icon={<DeleteOutlined />}
                                  danger
                                  onClick={() => handleRemove(field.id)}
                                />
                              </Col>
                            </Row>
                          ))}

                          <Row>
                            <Col>
                              <Button
                                type="dashed"
                                icon={<PlusCircleOutlined />}
                                onClick={handleAdd}
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
                  </>
                ) : (
                  <>
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <Form.Item
                          label="Program Intended Learning Outcomes"
                          name="outcomes"
                          rules={[
                            {
                              required: true,
                              message: "Please add at least one outcome",
                            },
                          ]}
                        >
                          {groupedData.map((field, index) => (
                            <Row key={field.id} gutter={[16, 8]}>
                              <Col xs={24} md={20}>
                                <Input
                                  style={{ marginBottom: "15px" }}
                                  placeholder="Enter Outcome"
                                  value={field.value}
                                  onChange={(e) =>
                                    handleGroupedData(e.target.value, field.id)
                                  }
                                />
                              </Col>
                              <Col xs={24} md={4}>
                                <Button
                                  style={{ marginBottom: "15px" }}
                                  type="text"
                                  icon={<DeleteOutlined />}
                                  danger
                                  onClick={() => handleRemove(field.id)}
                                />
                              </Col>
                            </Row>
                          ))}

                          <Row>
                            <Col>
                              <Button
                                type="dashed"
                                icon={<PlusCircleOutlined />}
                                onClick={handleAdd}
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
                  </>
                )}
              </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
              title={`Delete ${currentType === "PEO" ? "PEO" : "PO/PILO"}
                 `}
              visible={isDeleteModalVisible}
              onOk={handleDeleteConfirm}
              onCancel={handleDeleteCancel}
              okButtonProps={{ danger: true }}
              okText={"Delete"}
            >
              <p> Are you sure you want to delete?</p>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
