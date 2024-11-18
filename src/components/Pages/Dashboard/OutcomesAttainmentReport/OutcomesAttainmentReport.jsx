/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Layout, Row, Col, Select, Button, Card } from "antd";
import Sidebar from "../../../Global/Sidebar";
import html2pdf from "html2pdf.js";

const { Content } = Layout;
const { Option } = Select;

const students = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alice Johnson" },
];

const programs = [
  { id: "BSIT", name: "BS Information Technology" },
  { id: "BSIS", name: "BS Information Systems" },
  { id: "BSSE", name: "BS Software Engineering" },
];

const programData = {
  BSIT: {
    outcomes: ["PO-01: Apply IT skills", "PO-02: Pursue lifelong learning"],
    seoulAccordAttributes: ["Recognize the importance of IT education", "Encourage innovation and leadership in technology"],
    courses: [
      { year: "1st Year", courses: ["IT101", "IT102", "IT103"] },
      { year: "2nd Year", courses: ["IT201", "IT202", "IT203"] },
      { year: "3rd Year", courses: ["IT301", "IT302", "IT303"] },
    ],
  },
  BSIS: {
    outcomes: ["PO-01: Develop information systems", "PO-02: Lead IT-driven transformation"],
    seoulAccordAttributes: ["Foster collaboration and interdisciplinary learning", "Promote ethical use of information systems"],
    courses: [
      { year: "1st Year", courses: ["IS101", "IS102", "IS103"] },
      { year: "2nd Year", courses: ["IS201", "IS202", "IS203"] },
      { year: "3rd Year", courses: ["IS301", "IS302", "IS303"] },
    ],
  },
  BSSE: {
    outcomes: ["PO-01: Design software systems", "PO-02: Solve software challenges"],
    seoulAccordAttributes: ["Develop software engineering solutions", "Address real-world problems through software"],
    courses: [
      { year: "1st Year", courses: ["SE101", "SE102", "SE103"] },
      { year: "2nd Year", courses: ["SE201", "SE202", "SE203"] },
      { year: "3rd Year", courses: ["SE301", "SE302", "SE303"] },
    ],
  },
};

// Color mapping for specific courses (green, red, yellow)
const courseColors = {
  IT101: "red",
  IT102: "yellow",
  IT103: "green",
  IT201: "yellow",
  IT202: "green",
  IT203: "yellow",
  IT301: "white",
  IT302: "white",
  IT303: "white",
  IS101: "green",
  IS102: "red",
  IS103: "green",
  IS201: "red",
  IS202: "yellow",
  IS203: "red",
  IS301: "red",
  IS302: "yellow",
  IS303: "red",
  SE101: "green",
  SE102: "green",
  SE103: "green",
  SE201: "red",
  SE202: "yellow",
  SE203: "green",
  SE301: "red",
  SE302: "green",
  SE303: "red",
};

export default function OutcomesAttainmentReport() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [tableData, setTableData] = useState([]);

  const handleProgramSelect = (programId) => {
    setSelectedProgram(programId);

    if (programId) {
      const data = programData[programId];
      const courses = data.courses;
      const columns = [
        { title: "1st Year", courses: courses.find(c => c.year === "1st Year")?.courses || [] },
        { title: "2nd Year", courses: courses.find(c => c.year === "2nd Year")?.courses || [] },
        { title: "3rd Year", courses: courses.find(c => c.year === "3rd Year")?.courses || [] },
      ];

      const mappedData = data.outcomes.map((outcome, index) => ({
        outcome,
        seoulAccord: data.seoulAccordAttributes.join(", "),
        ...columns.reduce((acc, column) => {
          column.courses.forEach(course => {
            acc[course] = `${course} grade`; // Placeholder for grades or data
          });
          return acc;
        }, {}),
      }));

      setTableData(mappedData);
    } else {
      setTableData([]);
    }
  };

// function generatePDF() {
//     const printContents = document.getElementById("printablediv").innerHTML;
//     const originalContents = document.body.innerHTML;
    
//     // Temporarily modify the body content for printing
//     document.body.innerHTML = printContents;
  
//     // Create a new print window for the PDF generation
//     const options = {
//       filename: 'outcomes_attainment_report.pdf',
//       html2canvas: { scale: 2 }, // Increase the scale for higher resolution
//       jsPDF: { unit: 'in', format: 'legal', orientation: 'landscape' },
//     };
  
//     // Use html2pdf to generate the PDF with the current content
//     html2pdf().from(document.body).set(options).save();
  
//     // Revert the body content back to the original
//     document.body.innerHTML = originalContents;
//   }

function generatePDF() {
    // Get the content to print
    const printContents = document.getElementById("printablediv");
  
    // Temporarily remove the border by adding a class or modifying styles
    const originalStyle = printContents.style.border; // Save the original border style
    printContents.style.border = "none"; // Remove the border
  
    // Configure `html2pdf` options
    const options = {
      margin: 10,
      filename: 'outcomes_attainment_report.pdf',
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "pt", format: "legal", orientation: "landscape" },
      pagebreak: { mode: "css", before: "#pageBreak" },
    };

    // Create the content with the header
    const contentWithHeader = document.createElement("div");
    contentWithHeader.innerHTML = `${printContents.innerHTML}`;
  
    // Convert the content to PDF
    html2pdf()
      .set(options)
      .from(contentWithHeader)
      .save()
      .then(() => {
        // Restore the original border style after generating the PDF
        printContents.style.border = originalStyle;
      });
  }
  
  
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Content style={{ padding: "20px" }}>
          <div className="dashboard-content">
            <h2 className="dashboard-header">OUTCOMES ATTAINMENT REPORT</h2>

            <Row gutter={16} style={{ marginBottom: 20 }}>
              <Col xs={24} sm={12} md={8}>
                <label><strong>Select Student:</strong></label>
                <Select
                  style={{ width: "100%", marginTop: 5 }}
                  placeholder="Select a Student"
                  onChange={(value) => setSelectedStudent(value)}
                >
                  {students.map((student) => (
                    <Option key={student.id} value={student.id}>
                      {student.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <label><strong>Select Program:</strong></label>
                <Select
                  style={{ width: "100%", marginTop: 5 }}
                  placeholder="Select a Program"
                  value={selectedProgram}
                  onChange={handleProgramSelect}
                  disabled={!selectedStudent}
                >
                  {programs.map((program) => (
                    <Option key={program.id} value={program.id}>
                      {program.name}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>

            {tableData.length > 0 ? (
              <div id="printablediv">
                <Card bordered={false} style={{ marginTop: 20 }}>
                <table  style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "10px", textAlign: "left", border: "1px solid #ddd" }}>Program Outcomes</th>
                      <th style={{ padding: "10px", textAlign: "left", border: "1px solid #ddd" }}>Seoul Accord Attributes</th>
                      <th colSpan={3} style={{ backgroundColor: "#f0f0f0", padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>1st Year</th>
                      <th colSpan={3} style={{ backgroundColor: "#f0f0f0", padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>2nd Year</th>
                      <th colSpan={3} style={{ backgroundColor: "#f0f0f0", padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>3rd Year</th>
                    </tr>
                    <tr>
                      <th style={{ border: "1px solid #ddd" }}></th>
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
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{data.seoulAccord}</td>
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
                            {data[course]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                </Card>
                {/* <table  style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "10px", textAlign: "left", border: "1px solid #ddd" }}>Program Outcomes</th>
                      <th style={{ padding: "10px", textAlign: "left", border: "1px solid #ddd" }}>Seoul Accord Attributes</th>
                      <th colSpan={3} style={{ backgroundColor: "#f0f0f0", padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>1st Year</th>
                      <th colSpan={3} style={{ backgroundColor: "#f0f0f0", padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>2nd Year</th>
                      <th colSpan={3} style={{ backgroundColor: "#f0f0f0", padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>3rd Year</th>
                    </tr>
                    <tr>
                      <th style={{ border: "1px solid #ddd" }}></th>
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
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{data.seoulAccord}</td>
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
                            {data[course]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table> */}
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
              <p>Please select a student and a program to view data.</p>
            )}
            
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
