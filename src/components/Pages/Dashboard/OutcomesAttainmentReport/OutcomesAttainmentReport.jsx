/* eslint-disable no-unused-vars */
import React, { useState, useEffect, Fragment } from "react";
import { Layout, Row, Col, Select, Button, Card } from "antd";
import Sidebar from "../../../Global/Sidebar";
import html2pdf from "html2pdf.js";
import axios from "axios";




//const [students, setStudents] = useState(""); 
const { Content } = Layout;
const { Option } = Select;

const handlePostRequest = (url, data) => {

    return axios.post(url, data, { withCredentials: true })
    .catch(error => {
        const err_message = error.message 
        console.error("Error updating data:", error);
    });  
};


/*const students = [
  { id: 1, name: "John Doe", program: "BSIT" },
  { id: 2, name: "Jane Smith", program: "BSIS" },
  { id: 3, name: "Alice Johnson", program: "BSIT" },
  { id: 4, name: "Bob Brown", program: "BSSE" },
  { id: 5, name: "Emily Davis", program: "BSIS" },
  { id: 6, name: "Tom White", program: "BSSE" },
];*/

/*const programs = [
  { id: "BSIT", name: "BS Information Technology" },
  { id: "BSIS", name: "BS Information Systems" },
  { id: "BSSE", name: "BS Software Engineering" },
];*/

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
const gradeColors = ["#FF6666","#FFCCCC","#339900","#336600", "#FFFFCC"];

export default function OutcomesAttainmentReport() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [terms, setTerms] = useState([]);
  const [grades, setGrades] = useState([]);
  const [programOutcomes, setProgramOutcomes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [cilo_mapping, setCILOMapping] = useState([]);
  const [outcomeCount, setoutcomeCount] = useState(0);

  const handleTermSelect = (term) => {
    setSelectedTerm(term);
    setSelectedStudent(null); // Reset student selection when changing the program
    handlePostRequest("http://localhost:3000/api/system/students-data/read",{coursecode: selectedProgram, term: term}).then(response => {
      setStudents(response.data);
    });
    
  };

  const handleSelectStudent = (value) => {
    setSelectedStudent(value);
    handlePostRequest("http://localhost:3000/api/system/students-data/outcomes",{idnumber: value, coursecode: selectedProgram}).then(response => {
      setProgramOutcomes(response.data.outcomes);
      setSubjects(response.data.subjects);
      setGrades(response.data.grades);
      setCILOMapping(response.data.cilo_map);

    });

    // handlePostRequest("http://localhost:3000/api/system/students-data/outcomes/subjects",{}).then(response => {
    //   setProgramOutcomes(response.data);
    // });
  }
    
  const handleProgramSelect = (programId) => {
    setSelectedProgram(programId);
    setSelectedStudent(null); // Reset student selection when changing the program
    setTableData([]); // Clear table data when changing program
    handlePostRequest("http://localhost:3000/api/system/students-data/terms",{coursecode: programId}).then(response => {
      setTerms(response.data);
    });
    
  };

  useEffect(() => {
    if (programs.length === 0) {
      handlePostRequest("http://localhost:3000/api/system/students-data/programs",{}).then(response => {
        setPrograms(response.data);
      });
    }
   
  });

  const convertTermToReadable = (term, compact, educLevel=null) => {
      let sem = "";
      let toReturn = "";
      if(term.charAt(4) === "1") sem = compact ? "1st Sem" : "1st Semester";
      if(term.charAt(4) === "2") sem = compact ? "2nd Sem" : "2nd Semester";
      if(term.charAt(4) === "4") sem = "Summer";

      const schyearTo = term.substring(0, 4);
      const schyearFrom = parseInt(schyearTo, 10) - 1;
      toReturn = sem + " S.Y. " +  schyearFrom + " - " + schyearTo;
      if(compact) toReturn = sem + " SY " +  schyearFrom + "-" + schyearTo;
      if(educLevel && ["JHS","BED"].includes(educLevel) && !toReturn.includes("Summer")) {        
          if(compact) toReturn = toReturn.substring(toReturn.length - 12);
          else toReturn = toReturn.substring(toReturn.length - 16);
      }
      return toReturn;
  }

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
            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col>
                <table  style={{ width: "100%", background: 'white', borderCollapse: "collapse", marginTop: 20 }}> 
                  <tr>
                    <th style={{ padding: "10px", textAlign: "left", border: "1px solid #ddd" }}>Legend:</th>
                    <td style={{ padding: "10px", textAlign: "left", border: "1px solid #ddd", backgroundColor: gradeColors[3] }}>High Attainment</td>
                    <td style={{ padding: "10px", textAlign: "left", border: "1px solid #ddd", backgroundColor: gradeColors[2] }}>Moderate Attainment</td>
                    <td style={{ padding: "10px", textAlign: "left", border: "1px solid #ddd", backgroundColor: gradeColors[1] }}>Low Attainment</td>
                    <td style={{ padding: "10px", textAlign: "left", border: "1px solid #ddd", backgroundColor: gradeColors[0] }}>Not Yet Attained</td>
                    <td style={{ padding: "10px", textAlign: "left", border: "1px solid #ddd", backgroundColor: gradeColors[4] }}>No Data/ Subject not yet taken</td>
                  </tr>
                </table>
                </Col>
            </Row>
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
                    <Option key={program.COURSECODE} value={program.COURSECODE}>
                      {program.Program_Title}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <label>
                  <strong>Select Batch/Term:</strong>
                </label>
                 <Select
                  style={{ width: "100%", marginTop: 5 }}
                  placeholder="Select a Term"
                  value={selectedTerm}
                  onChange={(value) => handleTermSelect(value)}
                  disabled={!selectedProgram}
                >
                  {terms.map((te) => (
                    <Option key={te.term} value={te.term}>
                      {convertTermToReadable(te.term)}
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
                  onChange={(value) => handleSelectStudent(value)}
                  disabled={!terms}
                >
                  {students.filter(x => x.COURSECODE === selectedProgram).map((student) => (
                    <Option key={student.IDNUMBER} value={student.IDNUMBER}>
                      {student.LASTNAME}, {student.FIRSTNAME} {student.MIDNAME}
                    </Option>
                  ))}
                </Select> 
              </Col>
            </Row>
          
            { 
              subjects && selectedStudent ? (
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
                      {
                        subjects.length !== 0 &&
                        subjects.map((subject, index) => {
                          var splittedSub = subject.subject_code.split('-');
                          return(
                            <th key={index} style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>{splittedSub[splittedSub.length-1]}</th>
                          )
                        })
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {
                      programOutcomes.map((data, idx) => {
                        
                        return (
                          <tr key={idx}>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{data.description}</td>
                        {
                          subjects.map((subject, index) => {
                            var filteredGrade = grades.filter(x => x.internal_code === subject.internal_code);
                            var gradeColor = 0;
                            var gradeLevel = filteredGrade.length === 0 ? 99 : parseInt(filteredGrade[0].FINAL);
                            var isPO = false;

                            if(filteredGrade.length !== 0){
                              var cilo = cilo_mapping.filter(x => x.internal_code === filteredGrade[0].internal_code)[0];
                              var splittedSequence = cilo.sequence.split(',');
                              var ciloCheck = (parseInt(idx)+1).toString();
                              if(splittedSequence.includes(ciloCheck)){
                                isPO = true;
                              }

                            }
                            
                            if (gradeLevel >= 10 && gradeLevel <= 17 ) gradeColor = 3;
                            else if (gradeLevel >= 18 && gradeLevel <= 23 ) gradeColor = 2;
                            else if (gradeLevel >= 24 && gradeLevel <= 30 ) gradeColor = 1;
                            else if (gradeLevel !== 99 && gradeLevel > 30) gradeColor = 0;
                            else if (gradeLevel === 99) gradeColor = 4;
                            return (
                              <td
                                key={idx}
                                style={{
                                  padding: "10px",
                                  textAlign: "center",
                                  border: "1px solid #ddd",
                                  backgroundColor: isPO ? gradeColors[gradeColor] : "",
                                }}
                              >
                                {/* {filteredGrade[0]?.FINAL} - {gradeColor} */}
                              </td>
                            );
                          })
                        }
                        
                      </tr>
                        )
                      })
                    
                    }
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
              ) : (<p>Please select a program and a student to view data.</p>)
            }

          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
