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
  const [currentType, setCurrentType] = useState(''); // 'PEO' or 'PILO'
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); 

  // Data arrays for PEO and PILO
  const PEOData = [
    { key: "1", program: "BSIT", objective: "Apply IT skills." },
    { key: "2", program: "BSIT", objective: "Pursue lifelong learning." },
    { key: "3", program: "BSIS", objective: "Develop information systems." },
    { key: "4", program: "BSIS", objective: "Lead IT-driven business transformation." },
    { key: "5", program: "BSSE", objective: "Design and develop software systems." },
    { key: "6", program: "BSSE", objective: "Solve real-world software engineering challenges." },
  ];
  
  const PILOData = [
    { key: "1", program: "BSIT", outcome: "Effective communication." },
    { key: "2", program: "BSIT", outcome: "Problem-solving in IT." },
    { key: "3", program: "BSIS", outcome: "Analyze business requirements." },
    { key: "4", program: "BSIS", outcome: "Design IT solutions for business." },
    { key: "5", program: "BSSE", outcome: "Implement software development methodologies." },
    { key: "6", program: "BSSE", outcome: "Work in a team to develop software." },
  ];

  const [filteredPEOData, setFilteredPEOData] = useState(PEOData);
  const [filteredPILOData, setFilteredPILOData] = useState(PILOData);

  const PEOColumns = [
    { title: "Program", dataIndex: "program", key: "program" },
    { title: "Program Educational Objective", dataIndex: "objective", key: "objective" },
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
              onClick={() => handleEditClick(record, 'PEO')}>
                Edit
              </Menu.Item>
              <Menu.Item key="delete" icon={<DeleteOutlined />} 
                onClick={() => handleDeleteClick(record)} 
                danger
              >
                Delete
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button>Actions <DownOutlined /></Button>
        </Dropdown>
      ),
    },
  ];

  const PILOColumns = [
    { title: "Program", dataIndex: "program", key: "program" },
    { title: "Program Intended Learning Outcome", dataIndex: "outcome", key: "outcome" },
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
              onClick={() => handleEditClick(record, 'PILO')}>
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
          <Button>Actions <DownOutlined /></Button>
        </Dropdown>
      ),
    },
  ];

  function handleEditClick(record, type) {
    setCurrentType(type);
    setIsEditMode(true);
    setCurrentRecord(record);
    form.setFieldsValue(record);
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
  }

  function handleDeleteClick(record) {
    setCurrentRecord(record);
    setIsDeleteModalVisible(true);
  }

  function handleDeleteConfirm() {
    // Logic for deleting the record
    console.log(`Deleted record:`, currentRecord);
    // Remove the record from the data array based on currentType (PEO or PILO)
    if (currentType === 'PEO') {
      setFilteredPEOData(filteredPEOData.filter(item => item.key !== currentRecord.key));
    } else {
      setFilteredPILOData(filteredPILOData.filter(item => item.key !== currentRecord.key));
    }
    setCurrentRecord(null);
    form.resetFields()
    setIsDeleteModalVisible(false);
  }

  function handleDeleteCancel() {
    form.resetFields()
    setCurrentRecord(null);
    setIsDeleteModalVisible(false);
  }
  

  function handleSaveChanges() {
    form
      .validateFields()
      .then((values) => {
        if (isEditMode) {
          console.log(`Editing ${currentType}`, values);
        } else {
          console.log(`Adding new ${currentType}`, values);
        }
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validation failed:", info);
      });
  }

  function handleProgramFilterChange(value) {
    setFilteredPEOData(PEOData.filter(course => course.program === value || value === 'all'));
    setFilteredPILOData(PILOData.filter(course => course.program === value || value === 'all'));
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
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
              <Col>
                <h2 className="dashboard-header">OBE DATA CONFIGURATION</h2>
              </Col>
              <Col>
                <Dropdown overlay={
                  <Menu>
                    <Menu.Item key="addPO" onClick={() => handleAddClick('PEO')}>Add PEO</Menu.Item>
                    <Menu.Item key="addPILO" onClick={() => handleAddClick('PILO')}>Add PO/PILO</Menu.Item>
                    <Menu.Item 
                    key="map" 
                    onClick={() => navigate('/peo-pilo-mapping')}
                    >
                     Map POs/PILOs to PEO
                    </Menu.Item>
                  </Menu>
                } trigger={["click"]}>
                  <Button type="primary" icon={<PlusCircleOutlined />}>Add <DownOutlined /></Button>
                </Dropdown>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 20 }} align="middle">
              <Col>
              <span style={{ marginRight: 8 }}><strong>Filter by: </strong></span>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  defaultValue="all"
                  style={{ width: '100%' }}
                  onChange={handleProgramFilterChange}
                >
                  <Option value="all">All Programs</Option>
                  <Option value="BSIT">BSIT</Option>
                  <Option value="BSIS">BSIS</Option>
                  <Option value="BSSE">BSSE</Option>
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
              title={
                `${isEditMode ? "Edit" : "Add"} 
                ${currentType === 'PEO' ? 'Program Educational Objective' : 
                'Program Outcome/Program Intended Learning Outcome'}
             `}
              visible={isModalVisible}
              onCancel={handleModalCancel}
              onOk={handleSaveChanges}
              okText="Save Changes"
              width={600}
            >
              <Form form={form} layout="vertical">
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                <Form.Item
                    label="Program"
                    name="program"
                    rules={[{ required: true, message: "Please select a program" }]}
                    >
                    <Select placeholder="Select Program">
                        <Option value="BSIT">BSIT</Option>
                        <Option value="BSIS">BSIS</Option>
                        <Option value="BSSE">BSSE</Option>
                    </Select>
                    </Form.Item>
                </Col>
                </Row>
                <Form.Item
                  name={currentType === 'PEO' ? 'objective' : 'outcome'}
                  label={`${currentType === 'PEO' ? 'Program Educational Objective' : 'Program Outcome/Program Intended Learning Outcome'}`}
                  rules={[{ required: true, message: `Please enter a ${currentType === 'PEO' ? 'PEO Objective' : 'PILO Outcome'}` }]}
                >
                  <Input.TextArea rows={3} />
                </Form.Item>
              </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                title={
                    `Delete ${currentType === 'PEO' ? 'PEO' : 
                    'PO/PILO'}
                 `}
                visible={isDeleteModalVisible}
                onOk={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                okButtonProps={{ danger: true }}
                okText={'Delete'}
            >
                <p> Are you sure you want to delete?</p>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
