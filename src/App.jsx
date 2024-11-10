// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Pages/Login/Login";
import Registration from "./components/Pages/Registration/Registration";
import Dashboard from "./components/Pages/Dashboard/Dashboard";
import OBEDataConfig from "./components/Pages/Dashboard/OBEDataConfiguration/OBEDataConfiguration";
import PEOToPILOMapping from "./components/Pages/Dashboard/OBEDataConfiguration/PEOToPILOMapping";
import Curriculum from "./components/Pages/Dashboard/Curriculum/Curriculum";
import POToCILOMapping from "./components/Pages/Dashboard/CourseSyllabus/POToCILOMapping";
import CourseSyllabus from "./components/Pages/Dashboard/CourseSyllabus/CourseSyllabus";
import "./index.css";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/obe-data-configuration" element={<OBEDataConfig />} />
      <Route path="/peo-pilo-mapping" element={<PEOToPILOMapping />} />
      <Route path="/curriculum" element={<Curriculum />} />
      <Route path="/po-cilo-mapping" element={<POToCILOMapping />} />
      <Route path="/course-syllabus" element={<CourseSyllabus />} />
    </Routes>
  </Router>
);

export default App;
