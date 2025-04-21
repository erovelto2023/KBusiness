import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import StudentLayout from "./StudentLayout";
import StudentDashboard from "./StudentDashboard";
import CourseCatalog from "./CourseCatalog";
import CourseView from "./CourseView";

const LMSRoutes: React.FC = () => (
  <Routes>
    <Route element={<StudentLayout />}>
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="catalog" element={<CourseCatalog />} />
      <Route path="course/:courseId" element={<CourseView />} />
      <Route index element={<Navigate to="catalog" replace />} />
    </Route>
  </Routes>
);

export default LMSRoutes;
