import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AppointmentsPage from "./pages/AppointmentsPage.jsx";
import AppointmentDetailPage from "./pages/AppointmentDetailPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Route map: Layout wraps every page via <Outlet />
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<AppointmentsPage />} />
        <Route path="/appointments/:id" element={<AppointmentDetailPage />} />
        <Route path="/tasks/:id" element={<AppointmentDetailPage />} />
        <Route path="/despre" element={<AboutPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
