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
  const [selectedFilterValue, setSelectedFilterValue] = useState("all");

  // program data
  const [programData, setProgramData] = useState([]);

  // States to store PEO and PILO data separately
  const [PEOData, setPEOData] = useState([]);
  const [PILOData, setPILOData] = useState([]);
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

          setPEOData(peoResponse.data);
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

          setPILOData(poResponse.data);
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

  // Filter programs based on selected filter value
  useEffect(() => {
    const filterData = (filterValue) => {
      if (filterValue === "all") {
        setFilteredPEOData(PEOData);
        setFilteredPILOData(PILOData);
      } else {
        setFilteredPEOData(
          PEOData.filter((program) => program.Program_Title === filterValue)
        );
        setFilteredPILOData(
          PILOData.filter((program) => program.Program_Title === filterValue)
        );
      }
    };
    filterData(selectedFilterValue);
  }, [selectedFilterValue, PEOData, PILOData]);

  const handleSaveChanges = async () => {
    setLoading(true);
    const extractedUserObject = localStorage.getItem("user");
    const parsedObject = JSON.parse(extractedUserObject);

    try {
      const programCodeFromFilter = selectedFilterValue;

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
            "http://localhost:3000/api/system/po-master/create",
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
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ padding: "0 24px 24px" }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <Row justify="space-between">
            <Col>
              <h1>OBE Data Configuration</h1>
            </Col>
          </Row>

          <Row justify="space-between" style={{ marginBottom: 16 }}>
            <Col>
              <Select
                defaultValue="all"
                style={{ width: 200 }}
                onChange={(value) => setSelectedFilterValue(value)}
              >
                <Option value="all">All Programs</Option>
                {programTitles.map((title) => (
                  <Option key={title} value={title}>
                    {title}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Button
                icon={<PlusCircleOutlined />}
                type="primary"
                onClick={() => handleAddClick("PEO")}
              >
                Add PEO
              </Button>
              <Button
                icon={<PlusCircleOutlined />}
                type="primary"
                onClick={() => handleAddClick("PILO")}
              >
                Add PILO
              </Button>
            </Col>
          </Row>

          {loading ? (
            <Spin size="large" />
          ) : (
            <Tabs defaultActiveKey="1">
              <TabPane tab="PEO" key="1">
                <Table
                  columns={PEOColumns}
                  dataSource={filteredPEOData}
                  rowKey="peo_seq_number"
                />
              </TabPane>
              <TabPane tab="PILO" key="2">
                <Table
                  columns={PILOColumns}
                  dataSource={filteredPILOData}
                  rowKey="pilo_seq_number"
                />
              </TabPane>
            </Tabs>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
