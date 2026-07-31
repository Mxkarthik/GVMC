import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Overview from "./pages/Overview";
import HeroPage from "./pages/Hero/HeroPage";
import ProjectsPage from "./pages/Projects/ProjectsPage";
import ProjectFormPage from "./pages/Projects/ProjectFormPage";
import ServicesPage from "./pages/Services/ServicesPage";
import ServiceFormPage from "./pages/Services/ServiceFormPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Overview />} />
                <Route path="hero" element={<HeroPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="projects/new" element={<ProjectFormPage />} />
                <Route path="projects/:id/edit" element={<ProjectFormPage />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="services/new" element={<ServiceFormPage />} />
                <Route path="services/:id/edit" element={<ServiceFormPage />} />
            </Route>
        </Routes>
    );
}

export default App;
