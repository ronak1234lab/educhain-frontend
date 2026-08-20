import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Typography,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllUniversities } from "../services/universityService";
import { getAllStudents } from "../services/studentService";
import { getAllCourses } from "../services/courseService";
import { getAllCertificates } from "../services/certificateService";


function Dashboard() {

    const navigate = useNavigate();


    // ==========================================
    // Get Logged-In User Role
    // ==========================================

    const role =
        localStorage.getItem("role")?.toUpperCase();


    // ==========================================
    // Dashboard Statistics
    // ==========================================

    const [statistics, setStatistics] = useState([
        {
            title: "Universities",
            value: 0,
            path: "/universities",
            icon: <SchoolIcon />,
            iconColor: "#2563eb",
            background: "#eff6ff",
            allowed: false,
        },
        {
            title: "Students",
            value: 0,
            path: "/students",
            icon: <PeopleIcon />,
            iconColor: "#16a34a",
            background: "#f0fdf4",
            allowed: false,
        },
        {
            title: "Courses",
            value: 0,
            path: "/courses",
            icon: <MenuBookIcon />,
            iconColor: "#9333ea",
            background: "#faf5ff",
            allowed: false,
        },
        {
            title: "Certificates",
            value: 0,
            path: "/certificates",
            icon: <WorkspacePremiumIcon />,
            iconColor: "#ea580c",
            background: "#fff7ed",
            allowed: false,
        },
    ]);


    // ==========================================
    // Loading & Error State
    // ==========================================

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // Load Dashboard Statistics
    // ==========================================

    const loadStatistics = async () => {

        try {

            setLoading(true);

            setError("");


            // ==========================================
            // Start With Empty Statistics
            // ==========================================

            let universityData = null;

            let studentData = null;

            let courseData = null;

            let certificateData = null;


            // ==========================================
            // ADMIN
            // ==========================================

            if (role === "ADMIN") {

                const [
                    universities,
                    students,
                    courses,
                    certificates,
                ] = await Promise.all([
                    getAllUniversities(),
                    getAllStudents(),
                    getAllCourses(),
                    getAllCertificates(),
                ]);

                universityData = universities;

                studentData = students;

                courseData = courses;

                certificateData = certificates;
            }


                // ==========================================
                // STUDENT
            // ==========================================

            else if (role === "STUDENT") {

                const [
                    students,
                    certificates,
                ] = await Promise.all([
                    getAllStudents(),
                    getAllCertificates(),
                ]);

                studentData = students;

                certificateData = certificates;
            }


                // ==========================================
                // UNIVERSITY
            // ==========================================

            else if (role === "UNIVERSITY") {

                const [
                    universities,
                    students,
                    courses,
                    certificates,
                ] = await Promise.all([
                    getAllUniversities(),
                    getAllStudents(),
                    getAllCourses(),
                    getAllCertificates(),
                ]);

                universityData = universities;

                studentData = students;

                courseData = courses;

                certificateData = certificates;
            }


                // ==========================================
                // EMPLOYER
            // ==========================================

            else if (role === "EMPLOYER") {

                const certificates =
                    await getAllCertificates();

                certificateData = certificates;
            }


            // ==========================================
            // Update Statistics
            // ==========================================

            setStatistics([
                {
                    title: "Universities",
                    value: universityData?.length || 0,
                    path: "/universities",
                    icon: <SchoolIcon />,
                    iconColor: "#2563eb",
                    background: "#eff6ff",
                    allowed: universityData !== null,
                },

                {
                    title: "Students",
                    value: studentData?.length || 0,
                    path: "/students",
                    icon: <PeopleIcon />,
                    iconColor: "#16a34a",
                    background: "#f0fdf4",
                    allowed: studentData !== null,
                },

                {
                    title: "Courses",
                    value: courseData?.length || 0,
                    path: "/courses",
                    icon: <MenuBookIcon />,
                    iconColor: "#9333ea",
                    background: "#faf5ff",
                    allowed: courseData !== null,
                },

                {
                    title: "Certificates",
                    value: certificateData?.length || 0,
                    path: "/certificates",
                    icon: <WorkspacePremiumIcon />,
                    iconColor: "#ea580c",
                    background: "#fff7ed",
                    allowed: certificateData !== null,
                },
            ]);


        } catch (error) {

            console.error(
                "Failed to load dashboard statistics:",
                error
            );

            setError(
                "Unable to load dashboard statistics. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // Load Statistics When Dashboard Opens
    // ==========================================

    useEffect(() => {

        loadStatistics();

    }, []);


    // ==========================================
    // Dashboard UI
    // ==========================================

    return (

        <Box
            sx={{
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden",
            }}
        >

            {/* ==========================================
                Page Header
            ========================================== */}

            <Box
                sx={{
                    mb: 4,
                }}
            >

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: "#111827",
                        mb: 1,

                        fontSize: {
                            xs: "2rem",
                            sm: "2.125rem",
                        },
                    }}
                >
                    Overview
                </Typography>


                <Typography
                    variant="body1"
                    sx={{
                        color: "#6b7280",
                    }}
                >
                    Here's what's happening with your
                    EduChain platform.
                </Typography>

            </Box>


            {/* ==========================================
                Error Message
            ========================================== */}

            {error && (

                <Card
                    elevation={0}
                    sx={{
                        mb: 3,
                        borderRadius: 3,
                        border: "1px solid #fecaca",
                        backgroundColor: "#fef2f2",
                    }}
                >

                    <CardContent
                        sx={{
                            display: "flex",

                            alignItems: {
                                xs: "stretch",
                                sm: "center",
                            },

                            justifyContent:
                                "space-between",

                            flexDirection: {
                                xs: "column",
                                sm: "row",
                            },

                            gap: 2,
                        }}
                    >

                        <Typography
                            sx={{
                                color: "#dc2626",
                                fontWeight: 500,
                            }}
                        >
                            {error}
                        </Typography>


                        <Button
                            variant="contained"
                            color="error"
                            onClick={loadStatistics}
                            sx={{
                                textTransform: "none",
                                borderRadius: 2,

                                minWidth: {
                                    xs: "100%",
                                    sm: "auto",
                                },
                            }}
                        >
                            Retry
                        </Button>

                    </CardContent>

                </Card>

            )}


            {/* ==========================================
                Statistics Cards
            ========================================== */}

            <Grid
                container
                spacing={3}
            >

                {statistics
                    .filter((stat) => stat.allowed)
                    .map((stat) => (

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 3,
                            }}
                            key={stat.title}
                        >

                            <Card
                                elevation={0}
                                onClick={() =>
                                    navigate(stat.path)
                                }
                                sx={{
                                    height: "100%",
                                    borderRadius: 3,
                                    border:
                                        "1px solid #e5e7eb",
                                    backgroundColor:
                                        "#ffffff",

                                    cursor: "pointer",

                                    transition:
                                        "all 0.25s ease",

                                    "&:hover": {
                                        transform:
                                            "translateY(-4px)",

                                        boxShadow:
                                            "0 12px 30px rgba(15, 23, 42, 0.08)",
                                    },
                                }}
                            >

                                <CardContent
                                    sx={{
                                        p: {
                                            xs: 2.5,
                                            sm: 3,
                                        },
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "space-between",
                                            gap: 2,
                                        }}
                                    >

                                        {/* Card Information */}

                                        <Box
                                            sx={{
                                                minWidth: 0,
                                            }}
                                        >

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color:
                                                        "#6b7280",
                                                    fontWeight: 500,
                                                    mb: 1,
                                                }}
                                            >
                                                {stat.title}
                                            </Typography>


                                            {loading ? (

                                                <CircularProgress
                                                    size={28}
                                                />

                                            ) : (

                                                <Typography
                                                    variant="h4"
                                                    sx={{
                                                        fontWeight:
                                                            700,
                                                        color:
                                                            "#111827",
                                                    }}
                                                >
                                                    {stat.value}
                                                </Typography>

                                            )}

                                        </Box>


                                        {/* Icon */}

                                        <Box
                                            sx={{
                                                width: 52,
                                                height: 52,
                                                minWidth: 52,
                                                borderRadius: 2,

                                                display: "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",

                                                backgroundColor:
                                                stat.background,

                                                color:
                                                stat.iconColor,
                                            }}
                                        >
                                            {stat.icon}
                                        </Box>

                                    </Box>

                                </CardContent>

                            </Card>

                        </Grid>

                    ))}

            </Grid>


            {/* ==========================================
                Welcome Section
            ========================================== */}

            <Card
                elevation={0}
                sx={{
                    mt: 4,
                    borderRadius: 3,
                    border:
                        "1px solid #e5e7eb",
                    backgroundColor:
                        "#ffffff",
                }}
            >

                <CardContent
                    sx={{
                        p: {
                            xs: 2.5,
                            sm: 4,
                        },
                    }}
                >

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: "#111827",
                            mb: 1,
                        }}
                    >
                        Welcome to EduChain
                    </Typography>


                    <Typography
                        variant="body1"
                        sx={{
                            color: "#6b7280",
                            lineHeight: 1.7,
                        }}
                    >
                        Manage universities, students,
                        courses and blockchain-verified
                        certificates from one centralized
                        platform.
                    </Typography>

                </CardContent>

            </Card>

        </Box>
    );
}


export default Dashboard;