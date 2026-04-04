import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import AdminDashboard from "./AdminDashboard";
import ParentReport from "./ParentReport";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/report" element={<ParentReport />} />
      </Routes>
    </BrowserRouter>
  );
}