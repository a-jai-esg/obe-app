/* eslint-disable no-unused-vars */
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
import OutcomesAttainmentReport from "./components/Pages/Dashboard/OutcomesAttainmentReport/OutcomesAttainmentReport";
import ProtectedRoute from "./components/Pages/ProtectedRoute";
import "./index.css";

const App = () => (
  <Router>
    <Routes>
      <Route
        path="/"
        element={<ProtectedRoute element={Login} isProtected={false} />}
      />
      <Route
        path="/login"
        element={<ProtectedRoute element={Login} isProtected={false} />}
      />
      <Route
        path="/register"
        element={<ProtectedRoute element={Registration} isProtected={false} />}
      />
      <Route
        path="/dashboard"
        element={<ProtectedRoute element={Dashboard} isProtected={true} />}
      />
      <Route
        path="/obe-data-configuration"
        element={<ProtectedRoute element={OBEDataConfig} isProtected={true} />}
      />
      <Route
        path="/peo-pilo-mapping"
        element={
          <ProtectedRoute element={PEOToPILOMapping} isProtected={true} />
        }
      />
      <Route
        path="/curriculum"
        element={<ProtectedRoute element={Curriculum} isProtected={true} />}
      />
      <Route
        path="/po-cilo-mapping"
        element={
          <ProtectedRoute element={POToCILOMapping} isProtected={true} />
        }
      />
      <Route
        path="/course-syllabus"
        element={<ProtectedRoute element={CourseSyllabus} isProtected={true} />}
      />
      <Route
        path="/outcomes-report"
        element={<ProtectedRoute element={OutcomesAttainmentReport} isProtected={true} />}
      />
    </Routes>
  </Router>
);

export default App;
