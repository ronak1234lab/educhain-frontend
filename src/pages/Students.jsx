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
    getAllStudents,
    searchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
} from "../services/studentService";

import {
    getAllUniversities,
} from "../services/universityService";


// ==========================================
// Get Current User Role
// ==========================================

const getCurrentUserRole = () => {

    const role =
        localStorage.getItem("role");

    if (role) {
        return role
            .replace("ROLE_", "")
            .toUpperCase();
    }


    const user =
        localStorage.getItem("user");

    if (user) {

        try {

            const parsedUser =
                JSON.parse(user);

            const userRole =
                parsedUser?.role ||
                parsedUser?.userRole;

            if (userRole) {

                return String(userRole)
                    .replace("ROLE_", "")
                    .toUpperCase();
            }

        } catch (error) {

            console.warn(
                "Unable to read stored user:",
                error
            );
        }
    }


    return "STUDENT";
};


// ==========================================
// Students
// ==========================================

function Students() {

    // ==========================================
    // Role
    // ==========================================

    const [userRole] =
        useState(getCurrentUserRole);


    const canManageStudents =
        userRole === "ADMIN" ||
        userRole === "UNIVERSITY";


    const canLoadUniversities =
        userRole === "ADMIN" ||
        userRole === "UNIVERSITY";


    // ==========================================
    // Students
    // ==========================================

    const [students, setStudents] =
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


    const [selectedStudentId, setSelectedStudentId] =
        useState(null);


    // ==========================================
    // Delete Dialog
    // ==========================================

    const [deleteDialog, setDeleteDialog] =
        useState(false);


    const [studentToDelete, setStudentToDelete] =
        useState(null);


    // ==========================================
    // Form Data
    // ==========================================

    const [formData, setFormData] =
        useState({
            studentName: "",
            email: "",
            phone: "",
            gender: "",
            dateOfBirth: "",
            address: "",
            enrollmentNumber: "",
            department: "",
            semester: "",
            universityId: "",
        });


    // ==========================================
    // Form Errors
    // ==========================================

    const [formErrors, setFormErrors] =
        useState({
            studentName: "",
            email: "",
            phone: "",
            gender: "",
            dateOfBirth: "",
            address: "",
            enrollmentNumber: "",
            department: "",
            semester: "",
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

        loadStudents();

        if (canLoadUniversities) {
            loadUniversities();
        }

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
    // Load Students
    // ==========================================

    const loadStudents = async () => {

        try {

            setLoading(true);

            const data =
                await getAllStudents();

            setStudents(
                Array.isArray(data)
                    ? data
                    : []
            );

            setPage(1);

        } catch (error) {

            console.error(
                "Failed to load students:",
                error
            );

            showSnackbar(
                "Failed to load students.",
                "error"
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // Load Universities
    // Only ADMIN / UNIVERSITY
    // ==========================================

    const loadUniversities = async () => {

        if (!canLoadUniversities) {
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

            showSnackbar(
                "Failed to load universities.",
                "error"
            );
        }
    };


    // ==========================================
    // Search Students
    // ==========================================

    const handleSearch = async (
        value
    ) => {

        setSearch(value);

        setPage(1);


        if (value.trim() === "") {

            await loadStudents();

            return;
        }


        try {

            setLoading(true);

            const data =
                await searchStudents(
                    value.trim()
                );

            setStudents(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to search students:",
                error
            );

            showSnackbar(
                "Failed to search students.",
                "error"
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // Pagination
    // ==========================================

    const totalPages =
        Math.ceil(
            students.length /
            pageSize
        );


    const displayedStudents =
        useMemo(() => {

            const startIndex =
                (page - 1) *
                pageSize;

            const endIndex =
                startIndex +
                pageSize;

            return students.slice(
                startIndex,
                endIndex
            );

        }, [
            students,
            page,
        ]);


    const handlePageChange = (
        event,
        selectedPage
    ) => {

        setPage(selectedPage);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    // ==========================================
    // Handle Input
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


        if (!formData.studentName.trim()) {

            errors.studentName =
                "Student name is required.";

        } else if (
            formData.studentName.trim().length < 3
        ) {

            errors.studentName =
                "Student name must contain at least 3 characters.";
        }


        if (!formData.email.trim()) {

            errors.email =
                "Email is required.";

        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email.trim()
            )
        ) {

            errors.email =
                "Please enter a valid email address.";
        }


        if (!formData.phone.trim()) {

            errors.phone =
                "Phone number is required.";

        } else if (
            !/^[0-9]{10}$/.test(
                formData.phone.trim()
            )
        ) {

            errors.phone =
                "Phone number must contain exactly 10 digits.";
        }


        if (!formData.gender) {

            errors.gender =
                "Gender is required.";
        }


        if (!formData.dateOfBirth) {

            errors.dateOfBirth =
                "Date of birth is required.";
        }


        if (!formData.address.trim()) {

            errors.address =
                "Address is required.";
        }


        if (!formData.enrollmentNumber.trim()) {

            errors.enrollmentNumber =
                "Enrollment number is required.";
        }


        if (!formData.department.trim()) {

            errors.department =
                "Department is required.";
        }


        if (!formData.semester) {

            errors.semester =
                "Semester is required.";

        } else {

            const semester =
                Number(formData.semester);

            if (
                semester < 1 ||
                semester > 12
            ) {

                errors.semester =
                    "Semester must be between 1 and 12.";
            }
        }


        if (!formData.universityId) {

            errors.universityId =
                "University is required.";
        }


        setFormErrors({
            studentName:
                errors.studentName || "",

            email:
                errors.email || "",

            phone:
                errors.phone || "",

            gender:
                errors.gender || "",

            dateOfBirth:
                errors.dateOfBirth || "",

            address:
                errors.address || "",

            enrollmentNumber:
                errors.enrollmentNumber || "",

            department:
                errors.department || "",

            semester:
                errors.semester || "",

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
            studentName: "",
            email: "",
            phone: "",
            gender: "",
            dateOfBirth: "",
            address: "",
            enrollmentNumber: "",
            department: "",
            semester: "",
            universityId: "",
        });


        setFormErrors({
            studentName: "",
            email: "",
            phone: "",
            gender: "",
            dateOfBirth: "",
            address: "",
            enrollmentNumber: "",
            department: "",
            semester: "",
            universityId: "",
        });
    };


    // ==========================================
    // Open Add Dialog
    // ==========================================

    const handleOpenAddDialog = () => {

        if (!canManageStudents) {
            return;
        }

        setEditMode(false);

        setSelectedStudentId(null);

        resetForm();

        setOpenDialog(true);
    };


    // ==========================================
    // Open Edit Dialog
    // ==========================================

    const handleOpenEditDialog = (
        student
    ) => {

        if (!canManageStudents) {
            return;
        }

        setEditMode(true);

        setSelectedStudentId(
            student.id
        );


        setFormData({
            studentName:
                student.studentName || "",

            email:
                student.email || "",

            phone:
                student.phone || "",

            gender:
                student.gender || "",

            dateOfBirth:
                student.dateOfBirth || "",

            address:
                student.address || "",

            enrollmentNumber:
                student.enrollmentNumber || "",

            department:
                student.department || "",

            semester:
                student.semester
                    ? String(student.semester)
                    : "",

            universityId:
                student.universityId
                    ? String(student.universityId)
                    : "",
        });


        setFormErrors({
            studentName: "",
            email: "",
            phone: "",
            gender: "",
            dateOfBirth: "",
            address: "",
            enrollmentNumber: "",
            department: "",
            semester: "",
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

        setSelectedStudentId(null);

        resetForm();
    };


    // ==========================================
    // Add / Update Student
    // ==========================================

    const handleSubmit = async () => {

        if (!canManageStudents) {
            return;
        }


        if (!validateForm()) {
            return;
        }


        try {

            setSaving(true);


            const studentData = {

                studentName:
                    formData.studentName.trim(),

                email:
                    formData.email.trim(),

                phone:
                    formData.phone.trim(),

                gender:
                formData.gender,

                dateOfBirth:
                formData.dateOfBirth,

                address:
                    formData.address.trim(),

                enrollmentNumber:
                    formData.enrollmentNumber.trim(),

                department:
                    formData.department.trim(),

                semester:
                    Number(formData.semester),

                universityId:
                    Number(formData.universityId),
            };


            if (editMode) {

                await updateStudent(
                    selectedStudentId,
                    studentData
                );


                showSnackbar(
                    "Student updated successfully.",
                    "success"
                );

            } else {

                await createStudent(
                    studentData
                );


                showSnackbar(
                    "Student added successfully.",
                    "success"
                );
            }


            handleCloseDialog();

            await loadStudents();

        } catch (error) {

            console.error(
                "Failed to save student:",
                error
            );


            const backendMessage =
                error?.response?.data?.message;


            showSnackbar(
                backendMessage ||
                "Failed to save student. Please try again.",
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
        student
    ) => {

        if (!canManageStudents) {
            return;
        }

        setStudentToDelete(
            student
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

        setStudentToDelete(null);
    };


    // ==========================================
    // Delete Student
    // ==========================================

    const handleDeleteStudent = async () => {

        if (!canManageStudents) {
            return;
        }


        if (!studentToDelete) {
            return;
        }


        try {

            setDeleting(true);


            await deleteStudent(
                studentToDelete.id
            );


            setDeleteDialog(false);

            setStudentToDelete(null);


            showSnackbar(
                "Student deleted successfully.",
                "success"
            );


            await loadStudents();

        } catch (error) {

            console.error(
                "Failed to delete student:",
                error
            );


            const backendMessage =
                error?.response?.data?.message;


            showSnackbar(
                backendMessage ||
                "Failed to delete student. Please try again.",
                "error"
            );

        } finally {

            setDeleting(false);
        }
    };


    // ==========================================
    // Render
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
                Header
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
                            color: "#111827",

                            fontSize: {
                                xs: "2rem",
                                sm: "2.125rem",
                            },
                        }}
                    >
                        Students
                    </Typography>


                    <Typography
                        variant="body1"
                        sx={{
                            color: "#6b7280",
                            mt: 0.5,
                        }}
                    >

                        {canManageStudents
                            ? "Manage students registered on EduChain."
                            : "View students registered on EduChain."
                        }

                    </Typography>

                </Box>


                {/* ==========================================
                    Add Student
                    Only ADMIN / UNIVERSITY
                ========================================== */}

                {canManageStudents && (

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
                        Add Student
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

                        value={search}

                        onChange={(event) =>
                            handleSearch(
                                event.target.value
                            )
                        }

                        placeholder="Search student by name..."

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
                                students.length
                            } ${
                                students.length === 1
                                    ? "student"
                                    : "students"
                            }`

                            : `Showing ${
                                displayedStudents.length
                            } of ${
                                students.length
                            } ${
                                students.length === 1
                                    ? "student"
                                    : "students"
                            }`
                        }

                    </Typography>

                </Box>

            )}


            {/* ==========================================
                Students Table
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
                                    minWidth: 750,
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
                                            Student Name
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Email
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Phone
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            University
                                        </TableCell>


                                        {/* Actions only for managers */}

                                        {canManageStudents && (

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

                                    {displayedStudents.length === 0 ? (

                                        <TableRow>

                                            <TableCell
                                                colSpan={
                                                    canManageStudents
                                                        ? 6
                                                        : 5
                                                }

                                                align="center"

                                                sx={{
                                                    py: 7,
                                                }}
                                            >

                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: "#374151",
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    No students found
                                                </Typography>


                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "#9ca3af",
                                                    }}
                                                >
                                                    {search.trim()
                                                        ? "Try changing your search."
                                                        : "No students are currently available."
                                                    }
                                                </Typography>

                                            </TableCell>

                                        </TableRow>

                                    ) : (

                                        displayedStudents.map(
                                            (student) => (

                                                <TableRow
                                                    key={
                                                        student.id
                                                    }
                                                    hover
                                                >

                                                    <TableCell>
                                                        {
                                                            student.id
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
                                                                student.studentName
                                                            }
                                                        </Typography>

                                                    </TableCell>


                                                    <TableCell>
                                                        {
                                                            student.email ||
                                                            "-"
                                                        }
                                                    </TableCell>


                                                    <TableCell>
                                                        {
                                                            student.phone ||
                                                            "-"
                                                        }
                                                    </TableCell>


                                                    <TableCell>
                                                        {
                                                            student.universityName ||
                                                            "-"
                                                        }
                                                    </TableCell>


                                                    {/* Actions */}

                                                    {canManageStudents && (

                                                        <TableCell>

                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        "flex",

                                                                    gap: 0.5,

                                                                    flexWrap:
                                                                        "wrap",
                                                                }}
                                                            >

                                                                <Button
                                                                    size="small"

                                                                    onClick={() =>
                                                                        handleOpenEditDialog(
                                                                            student
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
                                                                            student
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
                Add / Edit Dialog
            ========================================== */}

            {canManageStudents && (

                <Dialog
                    open={openDialog}

                    onClose={
                        handleCloseDialog
                    }

                    fullWidth

                    maxWidth="md"
                >

                    <DialogTitle
                        sx={{
                            fontWeight: 700,
                            fontSize: "1.5rem",
                        }}
                    >
                        {editMode
                            ? "Edit Student"
                            : "Add Student"
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
                                ? "Update student information."
                                : "Add a new student to the EduChain platform."
                            }
                        </Typography>


                        {/* Student Name */}

                        <TextField
                            fullWidth
                            required

                            label="Student Name"

                            name="studentName"

                            value={
                                formData.studentName
                            }

                            onChange={
                                handleInputChange
                            }

                            error={
                                Boolean(
                                    formErrors.studentName
                                )
                            }

                            helperText={
                                formErrors.studentName
                            }

                            margin="normal"
                        />


                        {/* Email */}

                        <TextField
                            fullWidth
                            required

                            type="email"

                            label="Email"

                            name="email"

                            value={
                                formData.email
                            }

                            onChange={
                                handleInputChange
                            }

                            error={
                                Boolean(
                                    formErrors.email
                                )
                            }

                            helperText={
                                formErrors.email
                            }

                            margin="normal"
                        />


                        {/* Phone */}

                        <TextField
                            fullWidth
                            required

                            label="Phone Number"

                            name="phone"

                            value={
                                formData.phone
                            }

                            onChange={(event) => {

                                const value =
                                    event.target.value;

                                if (
                                    /^[0-9]*$/.test(
                                        value
                                    ) &&
                                    value.length <= 10
                                ) {

                                    handleInputChange(
                                        event
                                    );
                                }
                            }}

                            error={
                                Boolean(
                                    formErrors.phone
                                )
                            }

                            helperText={
                                formErrors.phone ||
                                "Enter exactly 10 digits."
                            }

                            slotProps={{
                                htmlInput: {
                                    inputMode: "numeric",
                                    maxLength: 10,
                                },
                            }}

                            margin="normal"
                        />


                        {/* Gender */}

                        <FormControl
                            fullWidth
                            required
                            margin="normal"

                            error={
                                Boolean(
                                    formErrors.gender
                                )
                            }
                        >

                            <InputLabel>
                                Gender
                            </InputLabel>

                            <Select
                                name="gender"

                                value={
                                    formData.gender
                                }

                                label="Gender"

                                onChange={
                                    handleInputChange
                                }
                            >

                                <MenuItem value="Male">
                                    Male
                                </MenuItem>

                                <MenuItem value="Female">
                                    Female
                                </MenuItem>

                                <MenuItem value="Other">
                                    Other
                                </MenuItem>

                            </Select>


                            {formErrors.gender && (

                                <Typography
                                    variant="caption"
                                    sx={{
                                        color:
                                            "#d32f2f",

                                        ml: 1.75,

                                        mt: 0.5,
                                    }}
                                >
                                    {
                                        formErrors.gender
                                    }
                                </Typography>

                            )}

                        </FormControl>


                        {/* Date of Birth */}

                        <TextField
                            fullWidth
                            required

                            type="date"

                            label="Date of Birth"

                            name="dateOfBirth"

                            value={
                                formData.dateOfBirth
                            }

                            onChange={
                                handleInputChange
                            }

                            error={
                                Boolean(
                                    formErrors.dateOfBirth
                                )
                            }

                            helperText={
                                formErrors.dateOfBirth
                            }

                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}

                            margin="normal"
                        />


                        {/* Address */}

                        <TextField
                            fullWidth
                            required

                            multiline

                            rows={2}

                            label="Address"

                            name="address"

                            value={
                                formData.address
                            }

                            onChange={
                                handleInputChange
                            }

                            error={
                                Boolean(
                                    formErrors.address
                                )
                            }

                            helperText={
                                formErrors.address
                            }

                            margin="normal"
                        />


                        {/* Enrollment Number */}

                        <TextField
                            fullWidth
                            required

                            label="Enrollment Number"

                            name="enrollmentNumber"

                            value={
                                formData.enrollmentNumber
                            }

                            onChange={
                                handleInputChange
                            }

                            error={
                                Boolean(
                                    formErrors.enrollmentNumber
                                )
                            }

                            helperText={
                                formErrors.enrollmentNumber
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


                        {/* Semester */}

                        <TextField
                            fullWidth
                            required

                            type="number"

                            label="Semester"

                            name="semester"

                            value={
                                formData.semester
                            }

                            onChange={
                                handleInputChange
                            }

                            error={
                                Boolean(
                                    formErrors.semester
                                )
                            }

                            helperText={
                                formErrors.semester ||
                                "Enter semester from 1 to 12."
                            }

                            slotProps={{
                                htmlInput: {
                                    min: 1,
                                    max: 12,
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

                                <Typography
                                    variant="caption"
                                    sx={{
                                        color:
                                            "#d32f2f",

                                        ml: 1.75,

                                        mt: 0.5,
                                    }}
                                >
                                    {
                                        formErrors.universityId
                                    }
                                </Typography>

                            )}

                        </FormControl>

                    </DialogContent>


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
                                    ? "Update Student"
                                    : "Add Student"

                            )}

                        </Button>

                    </DialogActions>

                </Dialog>

            )}


            {/* ==========================================
                Delete Confirmation
            ========================================== */}

            {canManageStudents && (

                <Dialog
                    open={deleteDialog}

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
                        Delete Student
                    </DialogTitle>


                    <DialogContent>

                        <Typography>

                            Are you sure you want to delete{" "}

                            <strong>
                                {
                                    studentToDelete
                                        ?.studentName
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
                                handleDeleteStudent
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

                autoHideDuration={3500}

                onClose={
                    handleCloseSnackbar
                }

                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
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
                        width: "100%",
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


export default Students;