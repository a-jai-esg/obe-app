/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Select, Button, Card } from "antd";
import Sidebar from "../../../Global/Sidebar";
import html2pdf from "html2pdf.js";

const { Content } = Layout;
const { Option } = Select;

const students = [
  { id: 1, name: "John Doe", program: "BSIT" },
  { id: 2, name: "Jane Smith", program: "BSIS" },
  { id: 3, name: "Alice Johnson", program: "BSIT" },
  { id: 4, name: "Bob Brown", program: "BSSE" },
  { id: 5, name: "Emily Davis", program: "BSIS" },
  { id: 6, name: "Tom White", program: "BSSE" },
];

const programs = [
  { id: "BSIT", name: "BS Information Technology" },
  { id: "BSIS", name: "BS Information Systems" },
  { id: "BSSE", name: "BS Software Engineering" },
];

const programData = {
  BSIT: {
    outcomes: ["PO-01: Apply IT skills", "PO-02: Pursue lifelong learning"],
    courses: [
      { year: "1st Year", courses: ["IT101", "IT102", "IT103"] },
      { year: "2nd Year", courses: ["IT201", "IT202", "IT203"] },
      { year: "3rd Year", courses: ["IT301", "IT302", "IT303"] },
    ],
  },
  BSIS: {
    outcomes: ["PO-01: Develop information systems", "PO-02: Lead IT-driven transformation"],
    courses: [
      { year: "1st Year", courses: ["IS101", "IS102", "IS103"] },
      { year: "2nd Year", courses: ["IS201", "IS202", "IS203"] },
      { year: "3rd Year", courses: ["IS301", "IS302", "IS303"] },
    ],
  },
  BSSE: {
    outcomes: ["PO-01: Design software systems", "PO-02: Solve software challenges"],
    courses: [
      { year: "1st Year", courses: ["SE101", "SE102", "SE103"] },
      { year: "2nd Year", courses: ["SE201", "SE202", "SE203"] },
      { year: "3rd Year", courses: ["SE301", "SE302", "SE303"] },
    ],
  },
};

// Color mapping for specific courses (green, red, #2e8b57)
const courseColors = {
  IT101: "#90ee8f",
  IT102: "#2e8b57",
  IT103: "#008001",
  IT201: "#2e8b57",
  IT202: "#008001",
  IT203: "#2e8b57",
  IT301: "90ee8f",
  IT302: "90ee8f",
  IT303: "90ee8f",
  IS101: "#008001",
  IS102: "#90ee8f",
  IS103: "#008001",
  IS201: "#90ee8f",
  IS202: "#2e8b57",
  IS203: "#90ee8f",
  IS301: "#90ee8f",
  IS302: "#2e8b57",
  IS303: "#90ee8f",
  SE101: "#008001",
  SE102: "#008001",
  SE103: "#008001",
  SE201: "#90ee8f",
  SE202: "#2e8b57",
  SE203: "#008001",
  SE301: "#90ee8f",
  SE302: "90ee8f",
  SE303: "#90ee8f",
};

export default function OutcomesAttainmentReport() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [tableData, setTableData] = useState([]);

  const getStudentsByProgram = (programId) =>
    students.filter((student) => student.program === programId);

  const handleProgramSelect = (programId) => {
    setSelectedProgram(programId);
    setSelectedStudent(null); // Reset student selection when changing the program
    setTableData([]); // Clear table data when changing program

    if (programId) {
      const data = programData[programId];
      const courses = data.courses;
      const columns = [
        { title: "1st Year", courses: courses.find((c) => c.year === "1st Year")?.courses || [] },
        { title: "2nd Year", courses: courses.find((c) => c.year === "2nd Year")?.courses || [] },
        { title: "3rd Year", courses: courses.find((c) => c.year === "3rd Year")?.courses || [] },
      ];

      const mappedData = data.outcomes.map((outcome, index) => ({
        outcome,
        ...columns.reduce((acc, column) => {
          column.courses.forEach((course) => {
            acc[course] = `${course} grade`; // Placeholder for grades or data
          });
          return acc;
        }, {}),
      }));

      setTableData(mappedData);
    }
  };

  const generatePDF = () => {
    const printContents = document.getElementById("printablediv");
    const originalStyle = printContents.style.border;
    printContents.style.border = "none"; // Temporarily remove the border
  
    const options = {
      margin: 10,
      filename: 'outcomes_attainment_report.pdf',
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "pt", format: "legal", orientation: "landscape" },
      pagebreak: { mode: "css", before: "#pageBreak" },
    };
  
    const contentWithHeader = document.createElement("div");
    contentWithHeader.innerHTML = `${printContents.innerHTML}`;
  
    html2pdf()
      .set(options)
      .from(contentWithHeader)
      .save()
      .then(() => {
        printContents.style.border = originalStyle; // Restore original border
      });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Content style={{ padding: "20px" }}>
          <div className="dashboard-content">
            <h2 className="dashboard-header">OUTCOMES ATTAINMENT REPORT</h2>

            <Row gutter={16} style={{ marginBottom: 20 }}>
              <Col xs={24} sm={12} md={8}>
                <label>
                  <strong>Select Program:</strong>
                </label>
                <Select
                  style={{ width: "100%", marginTop: 5 }}
                  placeholder="Select a Program"
                  value={selectedProgram}
                  onChange={handleProgramSelect}
                >
                  {programs.map((program) => (
                    <Option key={program.id} value={program.id}>
                      {program.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <label>
                  <strong>Select Student:</strong>
                </label>
                <Select
                  style={{ width: "100%", marginTop: 5 }}
                  placeholder="Select a Student"
                  value={selectedStudent}
                  onChange={(value) => setSelectedStudent(value)}
                  disabled={!selectedProgram}
                >
                  {getStudentsByProgram(selectedProgram).map((student) => (
                    <Option key={student.id} value={student.id}>
                      {student.name}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>

            {(tableData.length > 0 && selectedStudent) ? (
              <div id="printablediv">
                <Card bordered={false} style={{ marginTop: 20 }}>
                <table  style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "10px", textAlign: "left", border: "1px solid #ddd" }}>Program Outcomes</th>
                      <th colSpan={3} style={{ backgroundColor: "#f0f0f0", padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>1st Year</th>
                      <th colSpan={3} style={{ backgroundColor: "#f0f0f0", padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>2nd Year</th>
                      <th colSpan={3} style={{ backgroundColor: "#f0f0f0", padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>3rd Year</th>
                    </tr>
                    <tr>
                      <th style={{ border: "1px solid #ddd" }}></th>
                      {["IT101", "IT102", "IT103"].map((course, idx) => (
                        <th key={idx} style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>{course}</th>
                      ))}
                      {["IT201", "IT202", "IT203"].map((course, idx) => (
                        <th key={idx} style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>{course}</th>
                      ))}
                      {["IT301", "IT302", "IT303"].map((course, idx) => (
                        <th key={idx} style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>{course}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((data, idx) => (
                      <tr key={idx}>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{data.outcome}</td>
                        {["IT101", "IT102", "IT103", "IT201", "IT202", "IT203", "IT301", "IT302", "IT303"].map((course, idx) => (
                          <td
                            key={idx}
                            style={{
                              padding: "10px",
                              textAlign: "center",
                              border: "1px solid #ddd",
                              backgroundColor: courseColors[course],
                            }}
                          >
                            {/* {data[course]} */}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                </Card>
                    <Col xs={24} style={{ textAlign: "right", marginTop: 20 }}>
                    <Button
                    type="primary"
                    onClick={generatePDF}
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        marginRight: 20,
                    }}
                    >
                        Download
                    </Button>
                </Col>
              </div>
            ) : (
              <p>Please select a program and a student to view data.</p>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
