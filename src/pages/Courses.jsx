import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    getAllCourses,
    searchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
} from "../services/courseService";

import {
    getAllUniversities,
} from "../services/universityService";


// ==========================================
// Get Current User Role
// ==========================================

const getCurrentUserRole = () => {

    const storedRole =
        localStorage.getItem("role");

    if (storedRole) {

        return storedRole
            .replace("ROLE_", "")
            .toUpperCase();
    }


    const storedUser =
        localStorage.getItem("user");

    if (storedUser) {

        try {

            const user =
                JSON.parse(storedUser);

            const role =
                user?.role ||
                user?.userRole ||
                user?.authority;

            if (role) {

                return String(role)
                    .replace("ROLE_", "")
                    .toUpperCase();
            }

        } catch (error) {

            console.warn(
                "Unable to parse stored user:",
                error
            );
        }
    }


    return "STUDENT";
};


// ==========================================
// Courses Page
// ==========================================

function Courses() {

    // ==========================================
    // Role
    // ==========================================

    const [userRole] =
        useState(getCurrentUserRole);


    // ==========================================
    // Permissions
    // ==========================================

    const canAccessCourses =
        userRole === "ADMIN" ||
        userRole === "UNIVERSITY";


    const canManageCourses =
        userRole === "ADMIN" ||
        userRole === "UNIVERSITY";


    // ==========================================
    // Courses
    // ==========================================

    const [courses, setCourses] =
        useState([]);


    const [universities, setUniversities] =
        useState([]);


    const [loading, setLoading] =
        useState(true);


    // ==========================================
    // Search
    // ==========================================

    const [search, setSearch] =
        useState("");


    // ==========================================
    // Pagination
    // ==========================================

    const [page, setPage] =
        useState(1);


    const pageSize = 5;


    // ==========================================
    // Add / Edit Dialog
    // ==========================================

    const [openDialog, setOpenDialog] =
        useState(false);


    const [editMode, setEditMode] =
        useState(false);


    const [selectedCourseId, setSelectedCourseId] =
        useState(null);


    // ==========================================
    // Delete Dialog
    // ==========================================

    const [deleteDialog, setDeleteDialog] =
        useState(false);


    const [courseToDelete, setCourseToDelete] =
        useState(null);


    // ==========================================
    // Form Data
    // ==========================================

    const [formData, setFormData] =
        useState({
            courseName: "",
            courseCode: "",
            department: "",
            credits: "",
            duration: "",
            description: "",
            universityId: "",
        });


    // ==========================================
    // Form Errors
    // ==========================================

    const [formErrors, setFormErrors] =
        useState({
            courseName: "",
            courseCode: "",
            department: "",
            credits: "",
            duration: "",
            description: "",
            universityId: "",
        });


    // ==========================================
    // Saving / Deleting
    // ==========================================

    const [saving, setSaving] =
        useState(false);


    const [deleting, setDeleting] =
        useState(false);


    // ==========================================
    // Snackbar
    // ==========================================

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success",
        });


    // ==========================================
    // Initial Load
    // ==========================================

    useEffect(() => {

        if (!canAccessCourses) {

            setLoading(false);

            return;
        }


        loadCourses();

        loadUniversities();

    }, []);


    // ==========================================
    // Snackbar
    // ==========================================

    const showSnackbar = (
        message,
        severity = "success"
    ) => {

        setSnackbar({
            open: true,
            message,
            severity,
        });
    };


    const handleCloseSnackbar = (
        event,
        reason
    ) => {

        if (reason === "clickaway") {
            return;
        }


        setSnackbar((previous) => ({
            ...previous,
            open: false,
        }));
    };


    // ==========================================
    // Load Courses
    // ==========================================

    const loadCourses = async () => {

        if (!canAccessCourses) {
            return;
        }


        try {

            setLoading(true);


            const data =
                await getAllCourses();


            setCourses(
                Array.isArray(data)
                    ? data
                    : []
            );


            setPage(1);

        } catch (error) {

            console.error(
                "Failed to load courses:",
                error
            );


            if (
                error?.response?.status === 403
            ) {

                showSnackbar(
                    "You are not authorized to view courses.",
                    "error"
                );

            } else {

                showSnackbar(
                    "Failed to load courses.",
                    "error"
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // Load Universities
    // Only for authorized users
    // ==========================================

    const loadUniversities = async () => {

        if (!canManageCourses) {
            return;
        }


        try {

            const data =
                await getAllUniversities();


            setUniversities(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load universities:",
                error
            );


            if (
                error?.response?.status === 403
            ) {

                showSnackbar(
                    "You are not authorized to load universities.",
                    "error"
                );

            } else {

                showSnackbar(
                    "Failed to load universities.",
                    "error"
                );
            }
        }
    };


    // ==========================================
    // Search Courses
    // ==========================================

    const handleSearch = async (
        value
    ) => {

        if (!canAccessCourses) {
            return;
        }


        setSearch(value);

        setPage(1);


        if (value.trim() === "") {

            await loadCourses();

            return;
        }


        try {

            setLoading(true);


            const data =
                await searchCourses(
                    value.trim()
                );


            setCourses(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to search courses:",
                error
            );


            if (
                error?.response?.status === 403
            ) {

                showSnackbar(
                    "You are not authorized to search courses.",
                    "error"
                );

            } else {

                showSnackbar(
                    "Failed to search courses.",
                    "error"
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // Pagination
    // ==========================================

    const totalPages =
        Math.ceil(
            courses.length /
            pageSize
        );


    const displayedCourses =
        useMemo(() => {

            const startIndex =
                (page - 1) *
                pageSize;


            const endIndex =
                startIndex +
                pageSize;


            return courses.slice(
                startIndex,
                endIndex
            );

        }, [
            courses,
            page,
        ]);


    const handlePageChange = (
        event,
        selectedPage
    ) => {

        setPage(
            selectedPage
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    // ==========================================
    // Form Input
    // ==========================================

    const handleInputChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;


        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));


        setFormErrors((previous) => ({
            ...previous,
            [name]: "",
        }));
    };


    // ==========================================
    // Validate Form
    // ==========================================

    const validateForm = () => {

        const errors = {};


        // Course Name

        if (!formData.courseName.trim()) {

            errors.courseName =
                "Course name is required.";

        } else if (
            formData.courseName.trim().length < 2
        ) {

            errors.courseName =
                "Course name must contain at least 2 characters.";
        }


        // Course Code

        if (!formData.courseCode.trim()) {

            errors.courseCode =
                "Course code is required.";
        }


        // Department

        if (!formData.department.trim()) {

            errors.department =
                "Department is required.";
        }


        // Credits

        if (!formData.credits) {

            errors.credits =
                "Credits are required.";

        } else if (
            Number(formData.credits) < 1
        ) {

            errors.credits =
                "Credits must be at least 1.";
        }


        // Duration

        if (!formData.duration) {

            errors.duration =
                "Duration is required.";

        } else if (
            Number(formData.duration) < 1
        ) {

            errors.duration =
                "Duration must be at least 1.";
        }


        // Description

        if (
            formData.description.length > 1000
        ) {

            errors.description =
                "Description cannot exceed 1000 characters.";
        }


        // University

        if (!formData.universityId) {

            errors.universityId =
                "University is required.";
        }


        setFormErrors({
            courseName:
                errors.courseName || "",

            courseCode:
                errors.courseCode || "",

            department:
                errors.department || "",

            credits:
                errors.credits || "",

            duration:
                errors.duration || "",

            description:
                errors.description || "",

            universityId:
                errors.universityId || "",
        });


        return Object.keys(errors).length === 0;
    };


    // ==========================================
    // Reset Form
    // ==========================================

    const resetForm = () => {

        setFormData({
            courseName: "",
            courseCode: "",
            department: "",
            credits: "",
            duration: "",
            description: "",
            universityId: "",
        });


        setFormErrors({
            courseName: "",
            courseCode: "",
            department: "",
            credits: "",
            duration: "",
            description: "",
            universityId: "",
        });
    };


    // ==========================================
    // Open Add Dialog
    // ==========================================

    const handleOpenAddDialog = () => {

        if (!canManageCourses) {
            return;
        }


        setEditMode(false);

        setSelectedCourseId(null);

        resetForm();

        setOpenDialog(true);
    };


    // ==========================================
    // Open Edit Dialog
    // ==========================================

    const handleOpenEditDialog = (
        course
    ) => {

        if (!canManageCourses) {
            return;
        }


        setEditMode(true);


        setSelectedCourseId(
            course.id
        );


        setFormData({
            courseName:
                course.courseName || "",

            courseCode:
                course.courseCode || "",

            department:
                course.department || "",

            credits:
                course.credits !== null &&
                course.credits !== undefined
                    ? String(course.credits)
                    : "",

            duration:
                course.duration !== null &&
                course.duration !== undefined
                    ? String(course.duration)
                    : "",

            description:
                course.description || "",

            universityId:
                course.universityId !== null &&
                course.universityId !== undefined
                    ? String(course.universityId)
                    : "",
        });


        setFormErrors({
            courseName: "",
            courseCode: "",
            department: "",
            credits: "",
            duration: "",
            description: "",
            universityId: "",
        });


        setOpenDialog(true);
    };


    // ==========================================
    // Close Dialog
    // ==========================================

    const handleCloseDialog = () => {

        if (saving) {
            return;
        }


        setOpenDialog(false);

        setEditMode(false);

        setSelectedCourseId(null);

        resetForm();
    };


    // ==========================================
    // Add / Update Course
    // ==========================================

    const handleSubmit = async () => {

        if (!canManageCourses) {
            return;
        }


        if (!validateForm()) {
            return;
        }


        try {

            setSaving(true);


            const courseData = {

                courseName:
                    formData.courseName.trim(),

                courseCode:
                    formData.courseCode.trim(),

                department:
                    formData.department.trim(),

                credits:
                    Number(
                        formData.credits
                    ),

                duration:
                    Number(
                        formData.duration
                    ),

                description:
                    formData.description.trim(),

                universityId:
                    Number(
                        formData.universityId
                    ),
            };


            if (editMode) {

                await updateCourse(
                    selectedCourseId,
                    courseData
                );


                showSnackbar(
                    "Course updated successfully.",
                    "success"
                );

            } else {

                await createCourse(
                    courseData
                );


                showSnackbar(
                    "Course added successfully.",
                    "success"
                );
            }


            handleCloseDialog();


            await loadCourses();

        } catch (error) {

            console.error(
                "Failed to save course:",
                error
            );


            const backendMessage =
                error?.response?.data?.message;


            showSnackbar(
                backendMessage ||
                "Failed to save course. Please try again.",
                "error"
            );

        } finally {

            setSaving(false);
        }
    };


    // ==========================================
    // Open Delete Dialog
    // ==========================================

    const handleOpenDeleteDialog = (
        course
    ) => {

        if (!canManageCourses) {
            return;
        }


        setCourseToDelete(
            course
        );


        setDeleteDialog(true);
    };


    // ==========================================
    // Close Delete Dialog
    // ==========================================

    const handleCloseDeleteDialog = () => {

        if (deleting) {
            return;
        }


        setDeleteDialog(false);

        setCourseToDelete(null);
    };


    // ==========================================
    // Delete Course
    // ==========================================

    const handleDeleteCourse = async () => {

        if (!canManageCourses) {
            return;
        }


        if (!courseToDelete) {
            return;
        }


        try {

            setDeleting(true);


            await deleteCourse(
                courseToDelete.id
            );


            setDeleteDialog(false);

            setCourseToDelete(null);


            showSnackbar(
                "Course deleted successfully.",
                "success"
            );


            await loadCourses();

        } catch (error) {

            console.error(
                "Failed to delete course:",
                error
            );


            const backendMessage =
                error?.response?.data?.message;


            showSnackbar(
                backendMessage ||
                "Failed to delete course. Please try again.",
                "error"
            );

        } finally {

            setDeleting(false);
        }
    };


    // ==========================================
    // Unauthorized View
    // ==========================================

    if (!canAccessCourses) {

        return (

            <Box
                sx={{
                    width: "100%",

                    minHeight:
                        "60vh",

                    display: "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    px: 2,
                }}
            >

                <Card
                    elevation={0}

                    sx={{
                        width: "100%",

                        maxWidth: 520,

                        borderRadius: 3,

                        border:
                            "1px solid #e5e7eb",

                        textAlign:
                            "center",
                    }}
                >

                    <CardContent
                        sx={{
                            py: 6,

                            px: 3,
                        }}
                    >

                        <Typography
                            variant="h5"

                            sx={{
                                fontWeight: 700,

                                color:
                                    "#111827",

                                mb: 1,
                            }}
                        >
                            Access Restricted
                        </Typography>


                        <Typography
                            variant="body1"

                            sx={{
                                color:
                                    "#6b7280",

                                mb: 1,
                            }}
                        >
                            You are not authorized
                            to view courses.
                        </Typography>


                        <Typography
                            variant="body2"

                            sx={{
                                color:
                                    "#9ca3af",
                            }}
                        >
                            Current role:{" "}

                            <strong>
                                {userRole}
                            </strong>
                        </Typography>

                    </CardContent>

                </Card>

            </Box>
        );
    }


    // ==========================================
    // Main Render
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
                    display: "flex",

                    justifyContent:
                        "space-between",

                    alignItems: {
                        xs: "stretch",
                        sm: "center",
                    },

                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },

                    mb: 3,

                    gap: 2,
                }}
            >

                <Box>

                    <Typography
                        variant="h4"

                        sx={{
                            fontWeight: 700,

                            color:
                                "#111827",

                            fontSize: {
                                xs: "2rem",
                                sm: "2.125rem",
                            },
                        }}
                    >
                        Courses
                    </Typography>


                    <Typography
                        variant="body1"

                        sx={{
                            color:
                                "#6b7280",

                            mt: 0.5,
                        }}
                    >
                        Manage courses registered
                        on EduChain.
                    </Typography>

                </Box>


                {/* ==========================================
                    Add Course
                ========================================== */}

                {canManageCourses && (

                    <Button
                        variant="contained"

                        startIcon={
                            <AddIcon />
                        }

                        onClick={
                            handleOpenAddDialog
                        }

                        sx={{
                            borderRadius: 2,

                            textTransform:
                                "none",

                            fontWeight: 600,

                            px: 2.5,

                            width: {
                                xs: "100%",
                                sm: "auto",
                            },

                            minWidth: {
                                xs: "100%",
                                sm: 140,
                            },
                        }}
                    >
                        Add Course
                    </Button>

                )}

            </Box>


            {/* ==========================================
                Search
            ========================================== */}

            <Card
                elevation={0}

                sx={{
                    borderRadius: 3,

                    border:
                        "1px solid #e5e7eb",

                    mb: 2,
                }}
            >

                <CardContent
                    sx={{
                        p: 2,
                    }}
                >

                    <TextField
                        fullWidth

                        value={
                            search
                        }

                        onChange={(event) =>
                            handleSearch(
                                event.target.value
                            )
                        }

                        placeholder="Search course by name..."

                        size="small"

                        slotProps={{
                            input: {

                                startAdornment: (
                                    <SearchIcon
                                        sx={{
                                            color:
                                                "#6b7280",

                                            mr: 1,
                                        }}
                                    />
                                ),
                            },
                        }}

                        sx={{
                            maxWidth: 500,

                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                            },
                        }}
                    />

                </CardContent>

            </Card>


            {/* ==========================================
                Results Count
            ========================================== */}

            {!loading && (

                <Box
                    sx={{
                        display: "flex",

                        justifyContent:
                            "space-between",

                        alignItems:
                            "center",

                        mb: 1.5,

                        px: 0.5,
                    }}
                >

                    <Typography
                        variant="body2"

                        sx={{
                            color:
                                "#6b7280",
                        }}
                    >

                        {search.trim()

                            ? `Found ${
                                courses.length
                            } ${
                                courses.length === 1
                                    ? "course"
                                    : "courses"
                            }`

                            : `Showing ${
                                displayedCourses.length
                            } of ${
                                courses.length
                            } ${
                                courses.length === 1
                                    ? "course"
                                    : "courses"
                            }`
                        }

                    </Typography>

                </Box>

            )}


            {/* ==========================================
                Courses Table
            ========================================== */}

            <Card
                elevation={0}

                sx={{
                    borderRadius: 3,

                    border:
                        "1px solid #e5e7eb",

                    width: "100%",

                    overflow: "hidden",
                }}
            >

                <CardContent
                    sx={{
                        p: 0,
                    }}
                >

                    {loading ? (

                        <Box
                            sx={{
                                display: "flex",

                                justifyContent:
                                    "center",

                                alignItems:
                                    "center",

                                py: 8,
                            }}
                        >

                            <CircularProgress />

                        </Box>

                    ) : (

                        <TableContainer
                            component={Paper}

                            elevation={0}

                            sx={{
                                width: "100%",

                                overflowX:
                                    "auto",
                            }}
                        >

                            <Table
                                sx={{
                                    minWidth: 850,
                                }}
                            >

                                {/* Table Header */}

                                <TableHead>

                                    <TableRow
                                        sx={{
                                            backgroundColor:
                                                "#f9fafb",
                                        }}
                                    >

                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            ID
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Course Name
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Course Code
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Department
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Credits
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Duration
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            University
                                        </TableCell>


                                        {canManageCourses && (

                                            <TableCell
                                                sx={{
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Actions
                                            </TableCell>

                                        )}

                                    </TableRow>

                                </TableHead>


                                {/* Table Body */}

                                <TableBody>

                                    {displayedCourses.length === 0 ? (

                                        <TableRow>

                                            <TableCell
                                                colSpan={
                                                    canManageCourses
                                                        ? 8
                                                        : 7
                                                }

                                                align="center"

                                                sx={{
                                                    py: 7,
                                                }}
                                            >

                                                <Typography
                                                    sx={{
                                                        fontWeight:
                                                            600,

                                                        color:
                                                            "#374151",

                                                        mb: 0.5,
                                                    }}
                                                >
                                                    No courses found
                                                </Typography>


                                                <Typography
                                                    variant="body2"

                                                    sx={{
                                                        color:
                                                            "#9ca3af",
                                                    }}
                                                >

                                                    {search.trim()
                                                        ? "Try changing your search."
                                                        : "No courses are currently available."
                                                    }

                                                </Typography>

                                            </TableCell>

                                        </TableRow>

                                    ) : (

                                        displayedCourses.map(
                                            (course) => (

                                                <TableRow
                                                    key={
                                                        course.id
                                                    }

                                                    hover
                                                >

                                                    <TableCell>
                                                        {
                                                            course.id
                                                        }
                                                    </TableCell>


                                                    <TableCell>

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

                                                    </TableCell>


                                                    <TableCell>
                                                        {
                                                            course.courseCode ||
                                                            "-"
                                                        }
                                                    </TableCell>


                                                    <TableCell>
                                                        {
                                                            course.department ||
                                                            "-"
                                                        }
                                                    </TableCell>


                                                    <TableCell>
                                                        {
                                                            course.credits ??
                                                            "-"
                                                        }
                                                    </TableCell>


                                                    <TableCell>
                                                        {
                                                            course.duration ??
                                                            "-"
                                                        }
                                                    </TableCell>


                                                    <TableCell>
                                                        {
                                                            course.universityName ||
                                                            "-"
                                                        }
                                                    </TableCell>


                                                    {/* Actions */}

                                                    {canManageCourses && (

                                                        <TableCell>

                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        "flex",

                                                                    gap:
                                                                        0.5,

                                                                    flexWrap:
                                                                        "wrap",
                                                                }}
                                                            >

                                                                <Button
                                                                    size="small"

                                                                    onClick={() =>
                                                                        handleOpenEditDialog(
                                                                            course
                                                                        )
                                                                    }

                                                                    sx={{
                                                                        textTransform:
                                                                            "none",
                                                                    }}
                                                                >
                                                                    Edit
                                                                </Button>


                                                                <Button
                                                                    size="small"

                                                                    color="error"

                                                                    onClick={() =>
                                                                        handleOpenDeleteDialog(
                                                                            course
                                                                        )
                                                                    }

                                                                    sx={{
                                                                        textTransform:
                                                                            "none",
                                                                    }}
                                                                >
                                                                    Delete
                                                                </Button>

                                                            </Box>

                                                        </TableCell>

                                                    )}

                                                </TableRow>

                                            )
                                        )

                                    )}

                                </TableBody>

                            </Table>

                        </TableContainer>

                    )}


                    {/* ==========================================
                        Pagination
                    ========================================== */}

                    {!loading &&
                        totalPages > 1 && (

                            <Box
                                sx={{
                                    display: "flex",

                                    justifyContent:
                                        "center",

                                    alignItems:
                                        "center",

                                    py: 2.5,

                                    px: 2,

                                    borderTop:
                                        "1px solid #e5e7eb",

                                    overflowX:
                                        "auto",
                                }}
                            >

                                <Pagination
                                    count={
                                        totalPages
                                    }

                                    page={
                                        page
                                    }

                                    onChange={
                                        handlePageChange
                                    }

                                    color="primary"

                                    shape="rounded"

                                    showFirstButton

                                    showLastButton
                                />

                            </Box>

                        )}

                </CardContent>

            </Card>


            {/* ==========================================
                Add / Edit Course Dialog
            ========================================== */}

            {canManageCourses && (

                <Dialog
                    open={
                        openDialog
                    }

                    onClose={
                        handleCloseDialog
                    }

                    fullWidth

                    maxWidth="md"
                >

                    <DialogTitle
                        sx={{
                            fontWeight: 700,

                            fontSize:
                                "1.5rem",
                        }}
                    >

                        {editMode
                            ? "Edit Course"
                            : "Add Course"
                        }

                    </DialogTitle>


                    <DialogContent>

                        <Typography
                            variant="body2"

                            sx={{
                                color:
                                    "#6b7280",

                                mb: 2,
                            }}
                        >

                            {editMode
                                ? "Update course information."
                                : "Add a new course to the EduChain platform."
                            }

                        </Typography>


                        {/* Course Name */}

                        <TextField
                            fullWidth
                            required

                            label="Course Name"

                            name="courseName"

                            value={
                                formData.courseName
                            }

                            onChange={
                                handleInputChange
                            }

                            error={
                                Boolean(
                                    formErrors.courseName
                                )
                            }

                            helperText={
                                formErrors.courseName
                            }

                            margin="normal"
                        />


                        {/* Course Code */}

                        <TextField
                            fullWidth
                            required

                            label="Course Code"

                            name="courseCode"

                            value={
                                formData.courseCode
                            }

                            onChange={
                                handleInputChange
                            }

                            error={
                                Boolean(
                                    formErrors.courseCode
                                )
                            }

                            helperText={
                                formErrors.courseCode
                            }

                            margin="normal"
                        />


                        {/* Department */}

                        <TextField
                            fullWidth
                            required

                            label="Department"

                            name="department"

                            value={
                                formData.department
                            }

                            onChange={
                                handleInputChange
                            }

                            error={
                                Boolean(
                                    formErrors.department
                                )
                            }

                            helperText={
                                formErrors.department
                            }

                            margin="normal"
                        />


                        {/* Credits */}

                        <TextField
                            fullWidth
                            required

                            type="number"

                            label="Credits"

                            name="credits"

                            value={
                                formData.credits
                            }

                            onChange={
                                handleInputChange
                            }

                            error={
                                Boolean(
                                    formErrors.credits
                                )
                            }

                            helperText={
                                formErrors.credits
                            }

                            slotProps={{
                                htmlInput: {
                                    min: 1,
                                },
                            }}

                            margin="normal"
                        />


                        {/* Duration */}

                        <TextField
                            fullWidth
                            required

                            type="number"

                            label="Duration"

                            name="duration"

                            value={
                                formData.duration
                            }

                            onChange={
                                handleInputChange
                            }

                            error={
                                Boolean(
                                    formErrors.duration
                                )
                            }

                            helperText={
                                formErrors.duration
                            }

                            slotProps={{
                                htmlInput: {
                                    min: 1,
                                },
                            }}

                            margin="normal"
                        />


                        {/* Description */}

                        <TextField
                            fullWidth

                            multiline

                            rows={4}

                            label="Description"

                            name="description"

                            value={
                                formData.description
                            }

                            onChange={
                                handleInputChange
                            }

                            error={
                                Boolean(
                                    formErrors.description
                                )
                            }

                            helperText={
                                formErrors.description ||
                                `${formData.description.length}/1000 characters`
                            }

                            slotProps={{
                                htmlInput: {
                                    maxLength: 1000,
                                },
                            }}

                            margin="normal"
                        />


                        {/* University */}

                        <FormControl
                            fullWidth
                            required

                            margin="normal"

                            error={
                                Boolean(
                                    formErrors.universityId
                                )
                            }
                        >

                            <InputLabel>
                                University
                            </InputLabel>


                            <Select
                                name="universityId"

                                value={
                                    formData.universityId
                                }

                                label="University"

                                onChange={
                                    handleInputChange
                                }
                            >

                                {universities.map(
                                    (university) => (

                                        <MenuItem
                                            key={
                                                university.id
                                            }

                                            value={
                                                String(
                                                    university.id
                                                )
                                            }
                                        >
                                            {
                                                university.universityName
                                            }
                                        </MenuItem>

                                    )
                                )}

                            </Select>


                            {formErrors.universityId && (

                                <FormHelperText>
                                    {
                                        formErrors.universityId
                                    }
                                </FormHelperText>

                            )}

                        </FormControl>

                    </DialogContent>


                    {/* Dialog Actions */}

                    <DialogActions
                        sx={{
                            px: 3,

                            pb: 2,
                        }}
                    >

                        <Button
                            onClick={
                                handleCloseDialog
                            }

                            disabled={
                                saving
                            }

                            sx={{
                                textTransform:
                                    "none",
                            }}
                        >
                            Cancel
                        </Button>


                        <Button
                            variant="contained"

                            onClick={
                                handleSubmit
                            }

                            disabled={
                                saving
                            }

                            sx={{
                                textTransform:
                                    "none",

                                fontWeight: 600,

                                minWidth: 140,
                            }}
                        >

                            {saving ? (

                                <Box
                                    sx={{
                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        gap: 1,
                                    }}
                                >

                                    <CircularProgress
                                        size={18}

                                        color="inherit"
                                    />

                                    Saving...

                                </Box>

                            ) : (

                                editMode
                                    ? "Update Course"
                                    : "Add Course"

                            )}

                        </Button>

                    </DialogActions>

                </Dialog>

            )}


            {/* ==========================================
                Delete Confirmation Dialog
            ========================================== */}

            {canManageCourses && (

                <Dialog
                    open={
                        deleteDialog
                    }

                    onClose={
                        handleCloseDeleteDialog
                    }

                    maxWidth="xs"

                    fullWidth
                >

                    <DialogTitle
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        Delete Course
                    </DialogTitle>


                    <DialogContent>

                        <Typography>

                            Are you sure you want
                            to delete{" "}

                            <strong>
                                {
                                    courseToDelete
                                        ?.courseName
                                }
                            </strong>

                            ?

                        </Typography>


                        <Typography
                            variant="body2"

                            sx={{
                                color:
                                    "#6b7280",

                                mt: 1,
                            }}
                        >
                            This action cannot be undone.
                        </Typography>

                    </DialogContent>


                    <DialogActions
                        sx={{
                            px: 3,

                            pb: 2,
                        }}
                    >

                        <Button
                            onClick={
                                handleCloseDeleteDialog
                            }

                            disabled={
                                deleting
                            }

                            sx={{
                                textTransform:
                                    "none",
                            }}
                        >
                            Cancel
                        </Button>


                        <Button
                            variant="contained"

                            color="error"

                            onClick={
                                handleDeleteCourse
                            }

                            disabled={
                                deleting
                            }

                            sx={{
                                textTransform:
                                    "none",

                                minWidth: 100,
                            }}
                        >

                            {deleting ? (

                                <Box
                                    sx={{
                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        gap: 1,
                                    }}
                                >

                                    <CircularProgress
                                        size={18}

                                        color="inherit"
                                    />

                                    Deleting...

                                </Box>

                            ) : (

                                "Delete"

                            )}

                        </Button>

                    </DialogActions>

                </Dialog>

            )}


            {/* ==========================================
                Snackbar
            ========================================== */}

            <Snackbar
                open={
                    snackbar.open
                }

                autoHideDuration={
                    3500
                }

                onClose={
                    handleCloseSnackbar
                }

                anchorOrigin={{
                    vertical:
                        "bottom",

                    horizontal:
                        "right",
                }}
            >

                <Alert
                    onClose={
                        handleCloseSnackbar
                    }

                    severity={
                        snackbar.severity
                    }

                    variant="filled"

                    sx={{
                        width:
                            "100%",
                    }}
                >
                    {
                        snackbar.message
                    }
                </Alert>

            </Snackbar>

        </Box>
    );
}


export default Courses;