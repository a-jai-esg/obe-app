/* eslint-disable no-unused-vars */
import React from "react";
import { Layout, Card, Row, Col } from "antd";
import Sidebar from "../../Global/Sidebar";
import OBE from "../../../assets/Images/obe-image.png"; 
import Curriculum from "../../../assets/Images/curriculum-image.webp";
import CourseSyllabus from "../../../assets/Images/course-syllabus-image.jpg";
import Reports from "../../../assets/Images/reports-image.jpg";
import "./Dashboard.css"; // Import the CSS file

const { Content } = Layout;

const Dashboard = () => (
  <Layout style={{ minHeight: "100vh" }}>
    <Sidebar />
    <Layout>
      <Content>
        <div className="dashboard-content">
          <h2 className="dashboard-header">Welcome to the Dashboard!</h2>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card bordered={false}>
                <img 
                  src={OBE} 
                  alt="OBE Image" 
                  className="card-image" 
                />
                <div className="card-title">
                  <strong>OBE Data Configuration</strong>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Card bordered={false}>
                <img 
                  src={Curriculum} 
                  alt="Curriculum Image" 
                  className="card-image" 
                />
                <div className="card-title">
                  <strong>Curriculum</strong>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Card bordered={false}>
                <img 
                  src={CourseSyllabus} 
                  alt="Course Syllabus" 
                  className="card-image" 
                />
                <div className="card-title">
                  <strong>Course Syllabus</strong>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Card bordered={false}>
                <img 
                  src={Reports} 
                  alt="Reports Image" 
                  className="card-image" 
                />
                <div className="card-title">
                  <strong>Outcomes Attainable Report</strong>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  </Layout>
);

export default Dashboard;
