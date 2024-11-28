/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Layout,
  Table,
  Select,
  Button,
  Row,
  Col,
  Spin,
  Modal,
  Form,
} from "antd";
import Sidebar from "../../../Global/Sidebar";
import "../Curriculum/Curriculum.css";
import "./OBEDataConfiguration.css";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Option } = Select;

export default function Curriculum() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [allData, setAllData] = useState([]);
  const [programTitles, setProgramTitles] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedProgramCode, setSelectedProgramCode] = useState(null);
  const [departmentCode, setDepartmentCode] = useState(null);
  const [filteredPEOData, setFilteredPEOData] = useState([]);
  const [filteredPILOData, setFilteredPILOData] = useState([]);
  const [PEOColumns, setPEOColumns] = useState([]);

  // Fetch the programs list
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

  const handleProgramFilterChange = async (value) => {
    setSelectedProgram(value);
    if (value === "All Programs" || value === null) {
      setSelectedProgramCode(null);
    } else {
      const filtered = allData.filter((item) => item.Program_Title === value);
      setSelectedProgramCode(
        filtered.length > 0 ? filtered[0].Program_Code : null
      );
    }
  };

  useEffect(() => {
    const fetchPEOAndPILOData = async () => {
      if (selectedProgramCode) {
        try {
          setLoading(true);
          const [peoResponse, poResponse] = await Promise.all([
            axios.post(
              "http://localhost:3000/api/system/peo-master/read",
              { program_code: selectedProgramCode, dept_code: departmentCode },
              { withCredentials: true }
            ),
            axios.post(
              "http://localhost:3000/api/system/po-master/read",
              { program_code: selectedProgramCode, dept_code: departmentCode },
              { withCredentials: true }
            ),
          ]);

          const peoData = peoResponse.data.map((item, index) => ({
            key: index + 1,
            program: item.Program_Code,
            courseCode: item.PEO_SeqNumber,
            objective: item.PEO_Desc,
            identifier: item.PEO_SeqNumber,
            status: item.PEO_Status,
          }));
          setFilteredPEOData(peoData);

          const poData = poResponse.data.map((item, index) => ({
            key: index + 1,
            program: item.Program_Code,
            courseCode: item.PO_SeqNumber,
            objective: item.PO_Desc,
            identifier: item.PO_SeqNumber,
            status: item.PILO_Status,
          }));

          setFilteredPILOData(poData);

          // Extract unique PEO and PILO identifiers
          const uniquePEOIdentifiers = Array.from(
            new Set(peoData.map((item) => item.identifier))
          );

          // Create PEO columns dynamically
          const newPEOColumns = [
            {
              title: "PEO/PO",
              dataIndex: "identifier",
              key: "identifier",
              render: (text) => <strong>{text}</strong>,
            },
            ...uniquePEOIdentifiers.map((identifier) => ({
              title: identifier,
              key: identifier,
              render: (_, record) => (
                <Form.Item
                  name={`${record.key}-${identifier}`}
                  initialValue={record.status || ""} // Set initial value to status (if available)
                  rules={[
                    // { required: true, message: `This field is required` },
                    { required: false },
                  ]}
                >
                  <Select style={{ width: "100%" }}>
                    <Option value="None">None</Option>
                    <Option value="Introduced">Introduced</Option>
                    <Option value="Enhanced">Enhanced</Option>
                    <Option value="Practiced">Practiced</Option>
                  </Select>
                </Form.Item>
              ),
            })),
          ];

          setPEOColumns(newPEOColumns);
        } catch (error) {
          console.error("Error fetching PEO/PILO data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setFilteredPEOData([]);
        setFilteredPILOData([]);
        setPEOColumns([]);
      }
    };

    fetchPEOAndPILOData();
  }, [selectedProgramCode, departmentCode]);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Saved Values:", values);

        // Prepare an array to hold promises for API requests
        const apiPromises = Object.keys(values).map((key) => {
          return new Promise(async (resolve, reject) => {
            try {
              // Example key format: 1-BSIT-PEO-02

              // Split the key to extract the identifiers
              const [poSeq, programCode, peoLabel, peoSeq] = key.split("-");

              // Format PO sequence number to be two digits
              const formattedPoSeq =
                programCode + "-PO-" + poSeq.padStart(2, "0");
              const formattedPeoSeq = programCode + "-PEO-" + peoSeq;

              console.log(formattedPeoSeq);
              console.log(formattedPoSeq);

              // Determine the peo_po_activation_code value
              let peo_po_activation_code = String(values[key]).trim();
              if (
                peo_po_activation_code === "" ||
                peo_po_activation_code === "N"
              ) {
                peo_po_activation_code = null;
              } else {
                peo_po_activation_code = peo_po_activation_code
                  .charAt(0)
                  .toUpperCase();
              }

              // Prepare the data object for the API request
              const data = {
                program_code: programCode,
                peo_seq_number: formattedPeoSeq,
                po_seq_number: formattedPoSeq,
                peo_po_activation_code: peo_po_activation_code,
                peo_po_status: 1, // Assuming status as Active; adjust if needed
                peo_po_custom_field1: "", // Placeholder for custom fields if required
                peo_po_custom_field2: "",
                peo_po_custom_field3: "",
              };

              // Check if the mapping exists
              const response = await axios.post(
                "http://localhost:3000/api/system/peo-po-master/read",
                {
                  program_code: programCode,
                  peo_seq_number: formattedPeoSeq,
                  po_seq_number: formattedPoSeq,
                },
                {
                  withCredentials: true,
                }
              );

              console.log(response);
              await axios
                .post(
                  "http://localhost:3000/api/system/peo-po-master/create",
                  data,
                  {
                    withCredentials: true,
                  }
                )
                .catch(() => {
                  console.log("activation code: " + String(values[key]).trim());
                  axios.post(
                    "http://localhost:3000/api/system/peo-po-master/update",
                    {
                      program_code: programCode,
                      peo_seq_number: formattedPeoSeq,
                      po_seq_number: formattedPoSeq,
                      updatedFields: {
                        peo_po_activation_code: peo_po_activation_code,
                        peo_po_status: 1,
                        peo_po_custom_field1: "",
                        peo_po_custom_field2: "",
                        peo_po_custom_field3: "",
                      },
                    },
                    {
                      withCredentials: true,
                    }
                  );
                });

              resolve();
            } catch (error) {
              console.error(
                "Error checking/updating/creating PEO-PO mapping:",
                error
              );
              reject(
                new Error("Failed to save some mappings. Please try again.")
              );
            }
          });
        });

        // Wait for all API requests to complete
        Promise.all(apiPromises)
          .then(() => {
            Modal.success({
              title: "Success",
              content: "Data saved successfully.",
            });
          })
          .catch((error) => {
            Modal.error({
              title: "Error",
              content: error.message,
            });
          });
      })
      .catch((err) => {
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
            <Row justify="space-between" style={{ marginBottom: 20 }}>
              <Col>
                <h2 className="dashboard-header">Mapping of POs to PEOs</h2>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <strong>Select Program:</strong>
                <Select
                  value={selectedProgram}
                  onChange={handleProgramFilterChange}
                  style={{ width: "100%", marginTop: 8 }}
                >
                  {programTitles.map((title) => (
                    <Option key={title} value={title}>
                      {title}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>

            {loading ? (
              <div style={{ textAlign: "center", marginTop: 50 }}>
                <Spin size="large" />
              </div>
            ) : filteredPEOData.length > 0 ? (
              <div className="table-shadow-wrapper">
                <Form form={form} onFinish={handleSave}>
                  <Table
                    columns={PEOColumns}
                    dataSource={filteredPILOData}
                    pagination={{ pageSize: 5 }}
                    rowKey="key"
                  />
                  <Row justify="end" style={{ marginTop: 20 }}>
                    <Button
                      style={{ marginRight: 8 }}
                      onClick={() => navigate("/obe-data-configuration")}
                    >
                      Cancel
                    </Button>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Row>
                </Form>
              </div>
            ) : (
              <div style={{ textAlign: "center", marginTop: 50 }}>
                <p>Please select a program to view data.</p>
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
