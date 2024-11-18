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
  const [programTitles, setProgramTitles] = useState([]);
  const [filteredPEOData, setFilteredPEOData] = useState([]);
  const [filteredPILOData, setFilteredPILOData] = useState([]);
  const [programData, setProgramData] = useState({
    objective: "",
    outcome: "",
  });
  const [selectedFilterValue, setSelectedFilterValue] = useState("all");
  const [selectedProgramCode, setSelectedProgramCode] = useState(null);
  const [allData, setAllData] = useState([]); // Store all program data

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
        setAllData(data); // Store all program data
        setProgramData(data);
        const titles = Array.from(
          new Set(data.map((item) => item.Program_Title))
        );
        setProgramTitles(titles);

        setFilteredPEOData(
          data.map((program) => ({
            key: program.Program_Title,
            program: program.Program_Title,
            objectives: program.PEOs,
          }))
        );

        setFilteredPILOData(
          data.map((program) => ({
            key: program.Program_Title,
            program: program.Program_Title,
            outcomes: program.PILOs,
          }))
        );
      } catch (error) {
        console.error("Error fetching program data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Handle filter change to update selected program
  const handleFilterChange = (value) => {
    setSelectedFilterValue(value);
    if (value === "all" || value === null) {
      setSelectedProgramCode(null);
    } else {
      const filtered = allData.filter((item) => item.Program_Title === value);
      setSelectedProgramCode(
        filtered.length > 0 ? filtered[0].Program_Code : null
      );
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    const extractedUserObject = localStorage.getItem("user");
    const parsedObject = JSON.parse(extractedUserObject);

    try {
      const programCodeFromFilter = selectedProgramCode || selectedFilterValue; // Use selectedProgramCode if available

      let payload;
      if (currentType === "PEO") {
        payload = {
          program_code: currentRecord
            ? currentRecord.program_code
            : programCodeFromFilter,
          peo_desc: programData.objective, // For PEO, use objective
          peo_status: 1,
          peo_custom_field1: null,
          peo_custom_field2: null,
          peo_custom_field3: null,
        };
      } else if (currentType === "PILO") {
        payload = {
          program_code: currentRecord
            ? currentRecord.program_code
            : programCodeFromFilter,
          po_desc: programData.outcome, // For PILO, use outcome
          po_status: 1,
          po_custom_field1: null,
          po_custom_field2: null,
          po_custom_field3: null,
        };
      }

      let response;
      if (isEditMode) {
        if (currentType === "PEO") {
          response = await axios.put(
            `http://localhost:3000/api/system/peo-master/update/${currentRecord.peo_seq_number}`,
            payload,
            { withCredentials: true }
          );
        } else if (currentType === "PILO") {
          response = await axios.put(
            `http://localhost:3000/api/system/pilo-master/update/${currentRecord.pilo_seq_number}`,
            payload,
            { withCredentials: true }
          );
        }
      } else {
        if (currentType === "PEO") {
          response = await axios.post(
            "http://localhost:3000/api/system/peo-master/create",
            payload,
            { withCredentials: true }
          );
        } else if (currentType === "PILO") {
          response = await axios.post(
            "http://localhost:3000/api/system/pilo-master/create",
            payload,
            { withCredentials: true }
          );
        }
      }

      if (response.status === 201 || response.status === 200) {
        setIsModalVisible(false);
        fetchInitialData();
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddClick = (type) => {
    setCurrentType(type);
    setIsModalVisible(true);
    setIsEditMode(false);
    setProgramData({
      objective: "", // reset objective or outcome
      outcome: "",
    });
  };

  const handleEditClick = (record, type) => {
    setCurrentType(type);
    setIsModalVisible(true);
    setIsEditMode(true);
    setCurrentRecord(record);
    if (type === "PEO") {
      setProgramData({ objective: record.objectives });
    } else {
      setProgramData({ outcome: record.outcomes });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProgramData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const PEOColumns = [
    { title: "Program", dataIndex: "program", key: "program" },
    {
      title: "Program Educational Objectives",
      dataIndex: "objectives",
      key: "objectives",
      render: (objectives) =>
        objectives ? <span>{objectives}</span> : "No Objectives Available",
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
      render: (outcomes) =>
        outcomes ? <span>{outcomes}</span> : "No Outcomes Available",
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

  return (
    <Layout>
      <Sidebar />
      <Content style={{ padding: "0 50px" }}>
        <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
          <Col span={24}>
            <Select
              defaultValue="all"
              style={{ width: "100%" }}
              onChange={handleFilterChange}
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

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Tabs
              defaultActiveKey="PEO"
              onChange={(key) => setCurrentType(key)}
            >
              <TabPane tab="Program Educational Objectives" key="PEO">
                <Button
                  icon={<PlusCircleOutlined />}
                  onClick={() => handleAddClick("PEO")}
                  disabled={selectedFilterValue === "all"}
                >
                  Add PEO
                </Button>
                <Table
                  columns={PEOColumns}
                  dataSource={filteredPEOData}
                  loading={loading}
                />
              </TabPane>

              <TabPane tab="Program Intended Learning Outcomes" key="PILO">
                <Button
                  icon={<PlusCircleOutlined />}
                  onClick={() => handleAddClick("PILO")}
                  disabled={selectedFilterValue === "all"}
                >
                  Add PILO
                </Button>
                <Table
                  columns={PILOColumns}
                  dataSource={filteredPILOData}
                  loading={loading}
                />
              </TabPane>
            </Tabs>
          </Col>
        </Row>

        <Modal
          title={isEditMode ? "Edit Record" : `Add ${currentType}`}
          visible={isModalVisible}
          onCancel={handleModalCancel}
          onOk={handleSaveChanges}
        >
          <Form form={form}>
            {currentType === "PEO" && (
              <Form.Item label="Program Educational Objective">
                <Input
                  name="objective"
                  value={programData.objective}
                  onChange={handleChange}
                />
              </Form.Item>
            )}
            {currentType === "PILO" && (
              <Form.Item label="Program Intended Learning Outcome">
                <Input
                  name="outcome"
                  value={programData.outcome}
                  onChange={handleChange}
                />
              </Form.Item>
            )}
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}

/*
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
  const [programTitles, setProgramTitles] = useState([]);
  const [filteredPEOData, setFilteredPEOData] = useState([]);
  const [filteredPILOData, setFilteredPILOData] = useState([]);
  const [programData, setProgramData] = useState({
    objective: "",
    outcome: "",
  });
  const [selectedFilterValue, setSelectedFilterValue] = useState("all");

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
        setProgramData(data);
        const titles = Array.from(
          new Set(data.map((item) => item.Program_Title))
        );
        setProgramTitles(titles);

        setFilteredPEOData(
          data.map((program) => ({
            key: program.Program_Title,
            program: program.Program_Title,
            objectives: program.PEOs,
          }))
        );

        setFilteredPILOData(
          data.map((program) => ({
            key: program.Program_Title,
            program: program.Program_Title,
            outcomes: program.PILOs,
          }))
        );
      } catch (error) {
        console.error("Error fetching program data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleSaveChanges = async () => {
    setLoading(true);
    const extractedUserObject = localStorage.getItem("user");
    const parsedObject = JSON.parse(extractedUserObject);

    try {
      const programCodeFromFilter = selectedFilterValue; // Use selectedFilterValue

      let payload;
      if (currentType === "PEO") {
        payload = {
          program_code: currentRecord
            ? currentRecord.program_code
            : programCodeFromFilter,
          peo_desc: programData.objective, // For PEO, use objective
          peo_status: "active",
          peo_custom_field1: null,
          peo_custom_field2: null,
          peo_custom_field3: null,
        };
      } else if (currentType === "PILO") {
        payload = {
          program_code: currentRecord
            ? currentRecord.program_code
            : programCodeFromFilter,
          po_desc: programData.outcome, // For PILO, use outcome
          po_status: "active",
          po_custom_field1: null,
          po_custom_field2: null,
          po_custom_field3: null,
        };
      }

      let response;
      if (isEditMode) {
        if (currentType === "PEO") {
          response = await axios.put(
            `http://localhost:3000/api/system/peo-master/update/${currentRecord.peo_seq_number}`,
            payload,
            { withCredentials: true }
          );
        } else if (currentType === "PILO") {
          response = await axios.put(
            `http://localhost:3000/api/system/pilo-master/update/${currentRecord.pilo_seq_number}`,
            payload,
            { withCredentials: true }
          );
        }
      } else {
        if (currentType === "PEO") {
          response = await axios.post(
            "http://localhost:3000/api/system/peo-master/create",
            payload,
            { withCredentials: true }
          );
        } else if (currentType === "PILO") {
          response = await axios.post(
            "http://localhost:3000/api/system/pilo-master/create",
            payload,
            { withCredentials: true }
          );
        }
      }

      if (response.status === 201 || response.status === 200) {
        setIsModalVisible(false);
        fetchInitialData();
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddClick = (type) => {
    setCurrentType(type);
    setIsModalVisible(true);
    setIsEditMode(false);
    setProgramData({
      objective: "", // reset objective or outcome
      outcome: "",
    });
  };

  const handleEditClick = (record, type) => {
    setCurrentType(type);
    setIsModalVisible(true);
    setIsEditMode(true);
    setCurrentRecord(record);
    if (type === "PEO") {
      setProgramData({ objective: record.objectives });
    } else {
      setProgramData({ outcome: record.outcomes });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProgramData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const PEOColumns = [
    { title: "Program", dataIndex: "program", key: "program" },
    {
      title: "Program Educational Objectives",
      dataIndex: "objectives",
      key: "objectives",
      render: (objectives) =>
        objectives ? <span>{objectives}</span> : "No Objectives Available",
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
      render: (outcomes) =>
        outcomes ? <span>{outcomes}</span> : "No Outcomes Available",
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

  function handleMappingNavigation() {
    navigate("/peo-pilo-mapping");
  }
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout">
        <Content style={{ margin: "16px" }}>
          <Row gutter={16} style={{ marginBottom: 20 }} align="middle">
            <Col>
              <span style={{ marginRight: 8 }}>
                <strong>Filter by: </strong>
              </span>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select defaultValue="all" style={{ width: 400 }}>
                <Option value="all">All Programs</Option>
                {programTitles.map((program) => (
                  <Option key={program} value={program}>
                    {program}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row gutter={[16, 16]} justify="end">
            <Col>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      key="addPEO"
                      icon={<PlusCircleOutlined />}
                      onClick={() => handleAddClick("PEO")}
                    >
                      Add PEO
                    </Menu.Item>
                    <Menu.Item
                      key="addPILO"
                      icon={<PlusCircleOutlined />}
                      onClick={() => handleAddClick("PILO")}
                    >
                      Add PO/PILO
                    </Menu.Item>
                    <Menu.Item
                      key="mapPOtoPEO"
                      icon={<PlusCircleOutlined />}
                      onClick={handleMappingNavigation}
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

          <Tabs defaultActiveKey="PEO">
            <TabPane tab="PEO" key="PEO">
              <Table
                dataSource={filteredPEOData}
                columns={PEOColumns}
                pagination={{ pageSize: 5 }}
                loading={loading}
              />
            </TabPane>
            <TabPane tab="PILO" key="PILO">
              <Table
                dataSource={filteredPILOData}
                columns={PILOColumns}
                pagination={{ pageSize: 5 }}
                loading={loading}
              />
            </TabPane>
          </Tabs>

          <Modal
            title={isEditMode ? `Edit ${currentType}` : `Add ${currentType}`}
            visible={isModalVisible}
            onCancel={handleModalCancel}
            footer={null}
          >
            <Form form={form} layout="vertical" onFinish={handleSaveChanges}>
              <Form.Item
                label={`${currentType} Description`}
                name="description"
                rules={[
                  {
                    required: true,
                    message: `${currentType} description is required`,
                  },
                ]}
              >
                <Input
                  name={currentType === "PEO" ? "objective" : "outcome"}
                  value={
                    programData[currentType === "PEO" ? "objective" : "outcome"]
                  }
                  onChange={handleChange}
                />
              </Form.Item>
              <Row justify="space-between">
                <Button onClick={handleModalCancel}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Row>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
}

*/
