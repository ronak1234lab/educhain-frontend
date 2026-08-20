import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({
                        mobileOpen,
                        handleDrawerToggle,
                    }) {

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                backgroundColor: "#ffffff",
                overflowX: "hidden",
            }}
        >

            {/* ==========================================
                Sidebar
            ========================================== */}

            <Sidebar
                mobileOpen={mobileOpen}
                handleDrawerToggle={
                    handleDrawerToggle
                }
            />

            {/* ==========================================
                Main Application Area
            ========================================== */}

            <Box
                sx={{
                    width: {
                        xs: "100%",
                        md: "calc(100% - 250px)",
                    },

                    marginLeft: {
                        xs: 0,
                        md: "250px",
                    },

                    minHeight: "100vh",

                    display: "flex",

                    flexDirection: "column",

                    boxSizing: "border-box",

                    overflowX: "hidden",

                    backgroundColor:
                        "#ffffff",
                }}
            >

                {/* ==========================================
                    Navbar
                ========================================== */}

                <Navbar
                    onMenuClick={
                        handleDrawerToggle
                    }
                />

                {/* ==========================================
                    Page Content
                ========================================== */}

                <Box
                    component="main"
                    sx={{
                        width: "100%",

                        flex: 1,

                        minHeight:
                            "calc(100vh - 72px)",

                        backgroundColor:
                            "#f5f7fb",

                        boxSizing:
                            "border-box",

                        padding: {
                            xs: "20px 12px",
                            sm: "24px",
                            md: "32px",
                        },

                        overflowX: "hidden",
                    }}
                >

                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: "1600px",
                            margin: "0 auto",
                        }}
                    >

                        <Outlet />

                    </Box>

                </Box>

            </Box>

        </Box>
    );
}

export default MainLayout;