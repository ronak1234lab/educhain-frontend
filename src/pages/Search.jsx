import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { searchUniversities } from "../services/universityService";
import { searchStudents } from "../services/studentService";
import { searchCourses } from "../services/courseService";
import { getAllCertificates } from "../services/certificateService";


function Search() {

    const [searchParams] = useSearchParams();


    // ==========================================
    // Search Query
    // Supports both:
    // /search?query=...
    // /search?q=...
    // ==========================================

    const query =
        searchParams.get("query") ||
        searchParams.get("q") ||
        "";


    // ==========================================
    // Search Results
    // ==========================================

    const [universities, setUniversities] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [certificates, setCertificates] = useState([]);


    // ==========================================
    // Loading
    // ==========================================

    const [loading, setLoading] = useState(true);


    // ==========================================
    // Global Search
    // ==========================================

    useEffect(() => {

        const performSearch = async () => {

            if (!query.trim()) {

                setUniversities([]);
                setStudents([]);
                setCourses([]);
                setCertificates([]);

                setLoading(false);

                return;
            }


            try {

                setLoading(true);


                // ==========================================
                // Universities
                // ==========================================

                try {

                    const universityData =
                        await searchUniversities(query);

                    setUniversities(
                        universityData || []
                    );

                } catch (error) {

                    console.error(
                        "University search failed:",
                        error
                    );

                    setUniversities([]);

                }


                // ==========================================
                // Students
                // ==========================================

                try {

                    const studentData =
                        await searchStudents(query);

                    setStudents(
                        studentData || []
                    );

                } catch (error) {

                    console.error(
                        "Student search failed:",
                        error
                    );

                    setStudents([]);

                }


                // ==========================================
                // Courses
                // ==========================================

                try {

                    const courseData =
                        await searchCourses(query);

                    setCourses(
                        courseData || []
                    );

                } catch (error) {

                    console.error(
                        "Course search failed:",
                        error
                    );

                    setCourses([]);

                }


                // ==========================================
                // Certificates
                // ==========================================

                try {

                    const certificateData =
                        await getAllCertificates();

                    const lowerQuery =
                        query.toLowerCase();


                    const filteredCertificates =
                        (certificateData || []).filter(
                            (certificate) =>
                                certificate.certificateNumber
                                    ?.toLowerCase()
                                    .includes(lowerQuery) ||

                                certificate.studentName
                                    ?.toLowerCase()
                                    .includes(lowerQuery) ||

                                certificate.courseName
                                    ?.toLowerCase()
                                    .includes(lowerQuery) ||

                                certificate.universityName
                                    ?.toLowerCase()
                                    .includes(lowerQuery)
                        );


                    setCertificates(
                        filteredCertificates
                    );

                } catch (error) {

                    console.error(
                        "Certificate search failed:",
                        error
                    );

                    setCertificates([]);

                }

            } finally {

                setLoading(false);

            }

        };


        performSearch();

    }, [query]);


    // ==========================================
    // Total Results
    // ==========================================

    const totalResults =
        universities.length +
        students.length +
        courses.length +
        certificates.length;


    // ==========================================
    // UI
    // ==========================================

    return (
        <Box>

            {/* ==========================================
                Header
            ========================================== */}

            <Box sx={{ mb: 3 }}>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: "#111827",
                    }}
                >
                    Search Results
                </Typography>


                <Typography
                    variant="body1"
                    sx={{
                        color: "#6b7280",
                        mt: 0.5,
                    }}
                >
                    Results for:{" "}
                    <strong>
                        {query}
                    </strong>
                </Typography>

            </Box>


            {/* ==========================================
                Loading
            ========================================== */}

            {loading ? (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 8,
                    }}
                >

                    <CircularProgress />

                </Box>

            ) : (

                <>

                    {/* ==========================================
                        Result Count
                    ========================================== */}

                    <Typography
                        sx={{
                            color: "#6b7280",
                            mb: 2,
                        }}
                    >
                        {totalResults} result
                        {totalResults !== 1 ? "s" : ""} found
                    </Typography>


                    {/* ==========================================
                        Universities
                    ========================================== */}

                    {universities.length > 0 && (

                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border:
                                    "1px solid #e5e7eb",
                                mb: 3,
                            }}
                        >

                            <CardContent>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        gap: 1,
                                        mb: 2,
                                    }}
                                >

                                    <SchoolIcon
                                        sx={{
                                            color:
                                                "#2563eb",
                                        }}
                                    />

                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                        }}
                                    >
                                        Universities
                                    </Typography>

                                </Box>


                                {universities.map(
                                    (university) => (

                                        <Box
                                            key={
                                                university.id
                                            }
                                            sx={{
                                                py: 1.5,
                                            }}
                                        >

                                            <Typography
                                                sx={{
                                                    fontWeight:
                                                        600,
                                                }}
                                            >
                                                {
                                                    university.universityName
                                                }
                                            </Typography>


                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color:
                                                        "#6b7280",
                                                }}
                                            >
                                                {
                                                    university.email
                                                }
                                                {" • "}
                                                {
                                                    university.address
                                                }
                                            </Typography>

                                        </Box>

                                    )
                                )}

                            </CardContent>

                        </Card>

                    )}


                    {/* ==========================================
                        Students
                    ========================================== */}

                    {students.length > 0 && (

                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border:
                                    "1px solid #e5e7eb",
                                mb: 3,
                            }}
                        >

                            <CardContent>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        gap: 1,
                                        mb: 2,
                                    }}
                                >

                                    <PeopleIcon
                                        sx={{
                                            color:
                                                "#2563eb",
                                        }}
                                    />

                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                        }}
                                    >
                                        Students
                                    </Typography>

                                </Box>


                                {students.map(
                                    (student) => (

                                        <Box
                                            key={
                                                student.id
                                            }
                                            sx={{
                                                py: 1.5,
                                            }}
                                        >

                                            <Typography
                                                sx={{
                                                    fontWeight:
                                                        600,
                                                }}
                                            >
                                                {
                                                    student.studentName
                                                }
                                            </Typography>


                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color:
                                                        "#6b7280",
                                                }}
                                            >
                                                {
                                                    student.email
                                                }
                                                {" • "}
                                                {
                                                    student.department
                                                }
                                            </Typography>

                                        </Box>

                                    )
                                )}

                            </CardContent>

                        </Card>

                    )}


                    {/* ==========================================
                        Courses
                    ========================================== */}

                    {courses.length > 0 && (

                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border:
                                    "1px solid #e5e7eb",
                                mb: 3,
                            }}
                        >

                            <CardContent>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        gap: 1,
                                        mb: 2,
                                    }}
                                >

                                    <MenuBookIcon
                                        sx={{
                                            color:
                                                "#2563eb",
                                        }}
                                    />

                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                        }}
                                    >
                                        Courses
                                    </Typography>

                                </Box>


                                {courses.map(
                                    (course) => (

                                        <Box
                                            key={
                                                course.id
                                            }
                                            sx={{
                                                py: 1.5,
                                            }}
                                        >

                                            <Typography
                                                sx={{
                                                    fontWeight:
                                                        600,
                                                }}
                                            >
                                                {
                                                    course.courseName
                                                }
                                            </Typography>


                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color:
                                                        "#6b7280",
                                                }}
                                            >
                                                {
                                                    course.courseCode
                                                }
                                                {" • "}
                                                {
                                                    course.department
                                                }
                                            </Typography>

                                        </Box>

                                    )
                                )}

                            </CardContent>

                        </Card>

                    )}


                    {/* ==========================================
                        Certificates
                    ========================================== */}

                    {certificates.length > 0 && (

                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border:
                                    "1px solid #e5e7eb",
                                mb: 3,
                            }}
                        >

                            <CardContent>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        gap: 1,
                                        mb: 2,
                                    }}
                                >

                                    <WorkspacePremiumIcon
                                        sx={{
                                            color:
                                                "#2563eb",
                                        }}
                                    />

                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                        }}
                                    >
                                        Certificates
                                    </Typography>

                                </Box>


                                {certificates.map(
                                    (certificate) => (

                                        <Box
                                            key={
                                                certificate.id
                                            }
                                            sx={{
                                                py: 1.5,
                                            }}
                                        >

                                            <Typography
                                                sx={{
                                                    fontWeight:
                                                        600,
                                                }}
                                            >
                                                {
                                                    certificate.certificateNumber
                                                }
                                            </Typography>


                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color:
                                                        "#6b7280",
                                                }}
                                            >
                                                {
                                                    certificate.studentName
                                                }
                                                {" • "}
                                                {
                                                    certificate.courseName
                                                }
                                                {" • "}
                                                {
                                                    certificate.status
                                                }
                                            </Typography>

                                        </Box>

                                    )
                                )}

                            </CardContent>

                        </Card>

                    )}


                    {/* ==========================================
                        No Results
                    ========================================== */}

                    {totalResults === 0 && (

                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border:
                                    "1px solid #e5e7eb",
                            }}
                        >

                            <CardContent
                                sx={{
                                    textAlign: "center",
                                    py: 8,
                                }}
                            >

                                <SearchIcon
                                    sx={{
                                        fontSize: 50,
                                        color: "#9ca3af",
                                        mb: 1,
                                    }}
                                />


                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                    }}
                                >
                                    No results found
                                </Typography>


                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#6b7280",
                                        mt: 1,
                                    }}
                                >
                                    Try searching with a
                                    different name,
                                    course, university,
                                    or certificate number.
                                </Typography>

                            </CardContent>

                        </Card>

                    )}

                </>

            )}

        </Box>
    );
}

export default Search;