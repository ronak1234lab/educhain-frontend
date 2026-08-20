import { useState } from "react";

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Universities from "./pages/Universities";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Certificates from "./pages/Certificates";
import VerifyCertificate from "./pages/VerifyCertificate";
import Search from "./pages/Search";
import BlockchainDashboard from "./pages/BlockchainDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    // ==========================================
    // Mobile Sidebar State
    // ==========================================

    const [mobileOpen, setMobileOpen] =
        useState(false);

    // ==========================================
    // Mobile Sidebar Toggle
    // ==========================================

    const handleDrawerToggle = () => {

        setMobileOpen(
            (previous) => !previous
        );
    };

    return (
        <BrowserRouter>

            <Routes>

                {/* ==========================================
                    Public Routes
                ========================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* ==========================================
                    Protected Application
                ========================================== */}

                <Route
                    element={<ProtectedRoute />}
                >

                    <Route
                        path="/"
                        element={
                            <MainLayout
                                mobileOpen={mobileOpen}
                                handleDrawerToggle={
                                    handleDrawerToggle
                                }
                            />
                        }
                    >

                        {/* ==========================================
                            Dashboard
                        ========================================== */}

                        <Route
                            index
                            element={<Dashboard />}
                        />

                        {/* ==========================================
                            Universities
                        ========================================== */}

                        <Route
                            path="universities"
                            element={<Universities />}
                        />

                        {/* ==========================================
                            Students
                        ========================================== */}

                        <Route
                            path="students"
                            element={<Students />}
                        />

                        {/* ==========================================
                            Courses
                        ========================================== */}

                        <Route
                            path="courses"
                            element={<Courses />}
                        />

                        {/* ==========================================
                            Certificates
                        ========================================== */}

                        <Route
                            path="certificates"
                            element={<Certificates />}
                        />

                        {/* ==========================================
                            Verify Certificate
                        ========================================== */}

                        <Route
                            path="verify-certificate"
                            element={
                                <VerifyCertificate />
                            }
                        />

                        {/* ==========================================
                            Blockchain Dashboard
                        ========================================== */}

                        <Route
                            path="blockchain"
                            element={
                                <BlockchainDashboard />
                            }
                        />

                        {/* ==========================================
                            Global Search
                        ========================================== */}

                        <Route
                            path="search"
                            element={<Search />}
                        />

                    </Route>

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;