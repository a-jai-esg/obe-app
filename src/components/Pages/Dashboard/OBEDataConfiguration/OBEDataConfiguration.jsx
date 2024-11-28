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
  const [programData, setProgramData] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null); // Store selected program

  // Program related data
  const [filteredPEOData, setFilteredPEOData] = useState([]);
  const [filteredPILOData, setFilteredPILOData] = useState([]);
  const [programCode, setProgramCode] = useState();
  const [deptCode, setDepartmentCode] = useState();

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

  // Fetch PEO and PILO data only if programCode is set
  useEffect(() => {
    const fetchPeoMasterData = async () => {
      setLoading(true);

      try {
        const response = await axios.post(
          "http://localhost:3000/api/system/peo-master/read",
          {
            program_code: programCode === null ? null : programCode,
            dept_code: deptCode,
          },
          { withCredentials: true }
        );
        setFilteredPEOData(response.data);
      } catch (error) {
        console.error("Error fetching PEO master data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPoMasterData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/system/po-master/read",
          { program_code: programCode === null ? null : programCode },
          { withCredentials: true }
        );
        setFilteredPILOData(response.data);
      } catch (error) {
        console.error("Error fetching PO master data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeoMasterData();
    fetchPoMasterData();
  }, [programCode]); // Fetch PEO and PILO data when programCode changes

  // groupings:
  const groupPEOsByProgram = (peoData) => {
    return peoData.reduce((acc, peo) => {
      if (!acc[peo.Program_Code]) {
        acc[peo.Program_Code] = []; // Initialize an array for each program code
      }
      acc[peo.Program_Code].push(peo); // Add PEO to the respective program code
      return acc;
    }, {});
  };

  // Group the PEO data by Program Code
  const groupedPEOData = groupPEOsByProgram(filteredPEOData);

  const peoTableData = Object.keys(groupedPEOData).map((programCode) => {
    return {
      Program_Code: programCode,
      objectives: groupedPEOData[programCode].map(
        (peo) => `${peo.PEO_SeqNumber}: ${peo.PEO_Desc}`
      ), // Prepare PEOs as a list
    };
  });

  const PEOColumns = [
    { title: "Program", dataIndex: "Program_Code", key: "Program_Code" },
    {
      title: "Program Educational Objectives",
      dataIndex: "objectives",
      key: "objectives",
      render: (objectives) => (
        <ul>
          {objectives.length > 0 ? (
            objectives.map((objective, index) => (
              <li key={index}>
                <strong>{objective.split(":")[0]}</strong>:{" "}
                {objective.split(":")[1]}
              </li>
            ))
          ) : (
            <li>No objectives available</li>
          )}
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

  const groupPOsByProgram = (poData) => {
    return poData.reduce((acc, po) => {
      if (!acc[po.Program_Code]) {
        acc[po.Program_Code] = []; // Initialize an array for each program code
      }
      acc[po.Program_Code].push(po); // Add PO to the respective program code
      return acc;
    }, {});
  };

  // Group the PO data by Program Code
  const groupedPOData = groupPOsByProgram(filteredPILOData);

  const poTableData = Object.keys(groupedPOData).map((programCode) => {
    return {
      Program_Code: programCode,
      outcomes: groupedPOData[programCode].map(
        (po) => `${po.PO_SeqNumber}: ${po.PO_Desc}`
      ), // Prepare PILOs as a list
    };
  });

  const PILOColumns = [
    { title: "Program", dataIndex: "Program_Code", key: "Program_Code" },
    {
      title: "Program Intended Learning Outcomes",
      dataIndex: "outcomes",
      key: "outcomes",
      render: (outcomes) => (
        <ul>
          {outcomes.length > 0 ? (
            outcomes.map((outcome, index) => (
              <li key={index}>
                <strong>{outcome.split(":")[0]}</strong>:{" "}
                {outcome.split(":")[1]}
              </li>
            ))
          ) : (
            <li>No outcomes available</li>
          )}
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
      console.log("PEO", record);
      return;
      setGroupedData(
        record.objectives.map((objective) => ({
          id: Date.now() + Math.random(), // Unique ID for each objective
          value: objective,
        }))
      );
    } else {
      console.log("non-PEO", record);
      return;
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
              <Tabs defaultActiveKey="PEO">
                <TabPane tab="Program Educational Objectives" key="PEO">
                  <div className="table-shadow-wrapper">
                    <Table
                      columns={PEOColumns}
                      dataSource={peoTableData}
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
                      dataSource={poTableData}
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
              form={form}
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
                      <Select
                        placeholder="Select Program"
                        onChange={handleProgramFilterChange}
                      >
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
