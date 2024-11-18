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
  const [allData, setAllData] = useState([]);
  const [programTitles, setProgramTitles] = useState([]);
  const [programTitleToCodeMap, setProgramTitleToCodeMap] = useState({}); // Mapping of titles to codes
  const [currentType, setCurrentType] = useState(""); // 'PEO' or 'PILO'
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [groupedData, setGroupedData] = useState([
    { id: Date.now(), value: "" },
  ]);

  // Fetch the programs list
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

        const data = response.data;
        setAllData(data);

        // Create a mapping of program titles to program codes
        const titleToCodeMap = data.reduce((map, program) => {
          map[program.Program_Title] = program.Program_Code;
          return map;
        }, {});

        setProgramTitleToCodeMap(titleToCodeMap);
        setProgramTitles(Object.keys(titleToCodeMap)); // List of program titles
      } catch (error) {
        console.error("Error fetching program data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Data arrays for PEO and PILO based on the fetched data
  const PEOData = allData.map((program, index) => ({
    key: index.toString(),
    program: program.Program_Title,
    objectives: program.PEOs, // Assuming PEOs are part of the fetched data
    programCode: program.Program_Code, // Program Code mapped
  }));

  const PILOData = allData.map((program, index) => ({
    key: index.toString(),
    program: program.Program_Title,
    outcomes: program.PILOs, // Assuming PILOs are part of the fetched data
    programCode: program.Program_Code, // Program Code mapped
  }));

  const [filteredPEOData, setFilteredPEOData] = useState(PEOData);
  const [filteredPILOData, setFilteredPILOData] = useState(PILOData);

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
      title: "Program Intended Learning Outcomes",
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

  function handleSaveChanges() {
    form
      .validateFields()
      .then((values) => {
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

        setIsModalVisible(false);
        form.resetFields();
      })
      .catch((error) => {
        console.log("Validation Failed:", error);
      });
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout">
        <Content style={{ margin: "0 16px" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Tabs defaultActiveKey="1">
              <TabPane tab="PEOs" key="1">
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={() => handleAddClick("PEO")}
                  style={{ marginBottom: 16 }}
                >
                  Add New PEO
                </Button>
                <Table
                  loading={loading}
                  dataSource={filteredPEOData}
                  columns={PEOColumns}
                  pagination={false}
                />
              </TabPane>
              <TabPane tab="PILOs" key="2">
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={() => handleAddClick("PILO")}
                  style={{ marginBottom: 16 }}
                >
                  Add New PILO
                </Button>
                <Table
                  loading={loading}
                  dataSource={filteredPILOData}
                  columns={PILOColumns}
                  pagination={false}
                />
              </TabPane>
            </Tabs>

            <Modal
              title={isEditMode ? "Edit Record" : `Add New ${currentType}`}
              visible={isModalVisible}
              onCancel={handleModalCancel}
              onOk={handleSaveChanges}
              okText={isEditMode ? "Save Changes" : "Save"}
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  name="program"
                  label="Program Title"
                  rules={[
                    { required: true, message: "Please select a program" },
                  ]}
                >
                  <Select
                    placeholder="Select Program"
                    onChange={(value) => handleProgramChange(value)}
                  >
                    {programTitles.map((title, index) => (
                      <Option key={index} value={title}>
                        {title}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="groupedData"
                  label={`Program ${
                    currentType === "PEO"
                      ? "Educational Objectives"
                      : "Intended Learning Outcomes"
                  }`}
                  rules={[
                    {
                      required: true,
                      message: `Please provide ${currentType}`,
                    },
                  ]}
                >
                  <div>
                    {groupedData.map((field, index) => (
                      <Row key={field.id}>
                        <Col span={20}>
                          <Input
                            value={field.value}
                            onChange={(e) => {
                              const updatedData = [...groupedData];
                              updatedData[index].value = e.target.value;
                              setGroupedData(updatedData);
                            }}
                            placeholder="Enter Objective/Outcome"
                          />
                        </Col>
                        <Col span={4}>
                          <Button
                            type="danger"
                            onClick={() => {
                              const updatedData = groupedData.filter(
                                (f) => f.id !== field.id
                              );
                              setGroupedData(updatedData);
                            }}
                          >
                            Delete
                          </Button>
                        </Col>
                      </Row>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => {
                        setGroupedData([
                          ...groupedData,
                          { id: Date.now(), value: "" },
                        ]);
                      }}
                      style={{ marginTop: 16 }}
                    >
                      Add Another
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Modal>

            <Modal
              title="Confirm Delete"
              visible={isDeleteModalVisible}
              onOk={handleDeleteConfirm}
              onCancel={handleDeleteCancel}
              okText="Delete"
              cancelText="Cancel"
            >
              <p>Are you sure you want to delete this record?</p>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
