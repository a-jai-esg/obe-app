/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Pages/Login/Login";
import Registration from "./components/Pages/Registration/Registration";
import Dashboard from "./components/Pages/Dashboard/Dashboard";
import Curriculum from "./components/Pages/Dashboard/Curriculum/Curriculum";
import "./index.css";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/curriculum" element={<Curriculum />} />
    </Routes>
  </Router>
);

export default App;
